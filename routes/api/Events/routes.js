import Database from "../Database/index.js";
function EventRoutes(app) {
    app.get("/api/events/:id", (req, res) => {
        const { id } = req.params;
        const event = Database.events
          .find((c) => c._id === id);
        if (!event) {
          res.status(404).send("event not found");
          return;
        }
        res.send(event);
      });    
    app.put("/api/events/:id", (req, res) => {
      const { id } = req.params;
      const event = req.body;
      Database.events = Database.events.map((c) =>
        c._id === id ? { ...c, ...event } : c
      );
      res.sendStatus(204);
    });   
    app.delete("/api/events/:id", (req, res) => {
        const { id } = req.params;
        Database.events = Database.events
          .filter((c) => c._id !== id);
        res.sendStatus(204);
    });    
    app.post("/api/events", (req, res) => {
      const event = { ...req.body,
        _id: new Date().getTime().toString() };
      Database.events.push(event);
      console.log("check body: ", req);
      res.send(event);
    });
    app.get("/api/events", (req, res) => {
        const events = Database.events;
        res.send(events);
    });
}
export default EventRoutes;