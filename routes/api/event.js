import Database from "../../Database/index.js";

function EventRoutes(app) {
    app.get("/api/events", (req, res) => {
      const events = Database.events;
      res.send(events);
    });

    app.get("/api/events/:eid", (req, res) => {
        const { eid } = req.params;
        const event = Database.events
          .find((e) => e._id === eid);
        if (!event) {
          res.status(404).send("event not found");
          return;
        }
        res.send(event);
    });  

    app.put("/api/events/:eid", (req, res) => {
      const { eid } = req.params;
      const event = db.events.find((e) => e._id === eid);
    
      if (event) {
        event.name = req.body.name;
        event.location = req.body.location;
        event.startDate = req.body.startDate;
        event.endDate = req.body.endDate;
        event.organizer_id = req.body.organizer_id;
        event.attendance_id = req.body.attendance_id;
        event.price = req.body.price;
        event.description = req.body.description;
        event.comments = req.body.comments;
        event.registered = req.body.registered;
    
        res.sendStatus(200);
      } else {
        res.sendStatus(404); 
      }
    });

    app.delete("/api/events/:eid", (req, res) => {
        const { eid } = req.params;
        Database.events = Database.events
          .filter((e) => e._id !== eid);
        res.sendStatus(200);
        res.send(db.events);
    });    

    app.post("/api/events", (req, res) => {
      const event = { 
        ...req.body,
        _id: new Date().getTime().toString() 
      };
      Database.events.push(event);
      res.send(event);
    });

    app.post('/api/events/:eventId/comments', (req, res) => {
      const { eventId } = req.params;
      const newComment = { 
        ...req.body,
        _id: new Date().getTime().toString() 
      };
      const event = Database.events.find(event => event._id === eventId);
      if (!event) {
        return res.status(404).send('Event not found');
      }
      event.comments.push(newComment);
      res.send(newComment);
    });

    
}
export default EventRoutes;
