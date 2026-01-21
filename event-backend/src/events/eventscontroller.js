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

module.exports = { listEvents };

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

module.exports = { listEvents, createEvent };
