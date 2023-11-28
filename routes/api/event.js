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

    app.put("/api/events/edit/:eid", (req, res) => {
      const { eid } = req.params;
      const event =  Database.events.find((e) => e._id === eid);
      
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
        _id: new Date().getTime().toString(), 
      };
      Database.events.push(event);
      res.send(event);
    });

    app.post('/api/events/:eid/register', (req, res) => {
      const { eid } = req.params;
      const userEmail = req.body.userEmail;
    
      const event = Database.events.find(event => event._id === eid);
      if (event) {
        if (!event.attendance_id.includes(userEmail)) {
          event.attendance_id.push(userEmail);
        }
        res.status(200).send('User registered successfully');
      } else {
        res.status(404).send('Event not found');
      }
    });
    
    app.post('/api/events/:eid/comments', (req, res) => {
      const { eid } = req.params;
      const { userEmail, content } = req.body; 
    
      const event = Database.events.find(event => event._id === eid);
      if (event) {
        event.comments.push({ userEmail, content }); 
        res.status(200).send('Comment added successfully');
      } else {
        res.status(404).send('Event not found');
      }
    });

    
}
export default EventRoutes;
