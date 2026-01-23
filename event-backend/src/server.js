

const express = require("express");
const cors = require("cors");
const app = express();
app.use(express.json());
app.use(cors());

const { login, register } = require("./auth/authcontroller");
const { requireAuth } = require("./auth/authmiddleware");
const {
  listEvents,
  createEvent,
  getEventDetails,
  registerToEvent,
  unregisterFromEvent,
  deleteEvent,
} = require("./events/eventsController");

app.post("/api/login",login)
app.post("/api/validate", requireAuth, (req, res) => {
  res.json({ ok: true, user: req.user });
});
app.post("/api/register", register);
app.get("/api/events", listEvents);
app.post("/api/events", requireAuth, createEvent);
app.get("/api/events/:id", requireAuth, getEventDetails);

app.post("/api/events/:id/register", requireAuth, registerToEvent);
app.delete("/api/events/:id/register", requireAuth, unregisterFromEvent);
app.delete("/api/events/:id", requireAuth, deleteEvent);



const PORT=5000;
app.listen(PORT,()=>{console.log(`Server running on port ${PORT}`);})


