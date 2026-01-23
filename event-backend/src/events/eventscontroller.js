const pool = require("../db"); // adapte si ton fichier db s'appelle autrement

async function listEvents(req, res) {
  try {
    const result = await pool.query(`
      SELECT
        e.id,
        e.title,
        e.description,
        e.event_date,
        e.capacity,
        u.username AS organizer
      FROM events e
      JOIN users u ON u.id = e.organizer_id
      ORDER BY e.event_date ASC
    `);

    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Impossible de charger les événements" });
  }
}

async function createEvent(req, res) {
  try {
    const { title, description, event_date, capacity } = req.body;

    if (!title || !description || !event_date || !capacity) {
      return res.status(400).json({ error: "Champs manquants" });
    }

    const cap = Number(capacity);
    if (!Number.isInteger(cap) || cap <= 0) {
      return res.status(400).json({ error: "Capacité invalide" });
    }

    // organizer_id vient du JWT (requireAuth)
    const organizerId = req.user.id;

    const result = await pool.query(
      `
      INSERT INTO events (title, description, event_date, capacity, organizer_id)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING id, title, description, event_date, capacity
      `,
      [title, description, event_date, cap, organizerId]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Impossible de créer l'événement" });
  }
}

async function getEventDetails(req, res) {
  try {
    const eventId = Number(req.params.id);
    if (!Number.isInteger(eventId)) {
      return res.status(400).json({ error: "ID invalide" });
    }

    const userId = req.user.id;

    const result = await pool.query(
      `
      SELECT
        e.id,
        e.title,
        e.description,
        e.event_date,
        e.capacity,
        u.username AS organizer,
        (e.capacity - COUNT(r.user_id)) AS remaining,
        EXISTS (
          SELECT 1
          FROM registrations r2
          WHERE r2.event_id = e.id AND r2.user_id = $2
        ) AS "isRegistered"
      FROM events e
      JOIN users u ON u.id = e.organizer_id
      LEFT JOIN registrations r ON r.event_id = e.id
      WHERE e.id = $1
      GROUP BY e.id, u.username
      `,
      [eventId, userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Événement introuvable" });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Impossible de charger l'événement" });
  }
}

async function registerToEvent(req, res) {
  const eventId = Number(req.params.id);
  const userId = req.user.id;

  if (!Number.isInteger(eventId)) {
    return res.status(400).json({ error: "ID invalide" });
  }

  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    // Lock l'event pour éviter les courses (2 personnes qui s'inscrivent en même temps)
    const evRes = await client.query(
      "SELECT capacity FROM events WHERE id = $1 FOR UPDATE",
      [eventId]
    );
    if (evRes.rows.length === 0) {
      await client.query("ROLLBACK");
      return res.status(404).json({ error: "Événement introuvable" });
    }

    const capacity = evRes.rows[0].capacity;

    const countRes = await client.query(
      "SELECT COUNT(*)::int AS count FROM registrations WHERE event_id = $1",
      [eventId]
    );
    const current = countRes.rows[0].count;

    if (current >= capacity) {
      await client.query("ROLLBACK");
      return res.status(400).json({ error: "Événement complet" });
    }

    // Inscription (PK(event_id,user_id) empêche les doublons)
    await client.query(
      "INSERT INTO registrations (event_id, user_id) VALUES ($1, $2)",
      [eventId, userId]
    );

    await client.query("COMMIT");
    return res.status(201).json({ ok: true });
  } catch (err) {
    await client.query("ROLLBACK");

    // 23505 = violation unique => déjà inscrit
    if (err.code === "23505") {
      return res.status(400).json({ error: "Déjà inscrit" });
    }

    console.error(err);
    return res.status(500).json({ error: "Inscription impossible" });
  } finally {
    client.release();
  }
}

async function unregisterFromEvent(req, res) {
  const eventId = Number(req.params.id);
  const userId = req.user.id;

  if (!Number.isInteger(eventId)) {
    return res.status(400).json({ error: "ID invalide" });
  }

  try {
    await pool.query(
      "DELETE FROM registrations WHERE event_id = $1 AND user_id = $2",
      [eventId, userId]
    );
    res.json({ ok: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Désinscription impossible" });
  }
}

async function deleteEvent(req, res) {
  const eventId = Number(req.params.id);
  const userId = req.user.id;

  if (!Number.isInteger(eventId)) {
    return res.status(400).json({ error: "ID invalide" });
  }

  try {
    const check = await pool.query(
      "SELECT organizer_id FROM events WHERE id = $1",
      [eventId]
    );
    if (check.rows.length === 0) {
      return res.status(404).json({ error: "Événement introuvable" });
    }

    if (check.rows[0].organizer_id !== userId) {
      return res.status(403).json({ error: "Interdit" });
    }

    await pool.query("DELETE FROM events WHERE id = $1", [eventId]);
    // registrations supprimées automatiquement (ON DELETE CASCADE)
    res.json({ ok: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Suppression impossible" });
  }
}

async function updateEvent(req, res) {
  const eventId = Number(req.params.id);
  const userId = req.user.id;
  const { title, description, event_date, capacity } = req.body;

  if (!Number.isInteger(eventId)) {
    return res.status(400).json({ error: "ID invalide" });
  }

  if (!title || !description || !event_date || !capacity) {
    return res.status(400).json({ error: "Champs manquants" });
  }

  const cap = Number(capacity);
  if (!Number.isInteger(cap) || cap <= 0) {
    return res.status(400).json({ error: "Capacité invalide" });
  }

  try {
    // Vérifier que l'utilisateur est l'organisateur
    const check = await pool.query(
      "SELECT organizer_id FROM events WHERE id = $1",
      [eventId]
    );

    if (check.rows.length === 0) {
      return res.status(404).json({ error: "Événement introuvable" });
    }

    if (check.rows[0].organizer_id !== userId) {
      return res.status(403).json({ error: "Interdit" });
    }

    await pool.query(
      `
      UPDATE events
      SET title = $1,
          description = $2,
          event_date = $3,
          capacity = $4
      WHERE id = $5
      `,
      [title, description, event_date, cap, eventId]
    );

    res.json({ ok: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Modification impossible" });
  }
}

async function listParticipants(req, res) {
  const eventId = Number(req.params.id);

  if (!Number.isInteger(eventId)) {
    return res.status(400).json({ error: "ID invalide" });
  }

  try {
    const result = await pool.query(
      `
      SELECT u.id, u.username
      FROM registrations r
      JOIN users u ON u.id = r.user_id
      WHERE r.event_id = $1
      ORDER BY u.username ASC
      `,
      [eventId]
    );

    res.json(result.rows); // [{id, username}, ...]
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Impossible de charger les participants" });
  }
}

module.exports = {listEvents,createEvent,getEventDetails,registerToEvent,unregisterFromEvent,deleteEvent,updateEvent,listParticipants,};
