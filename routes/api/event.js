import Event from '../../models/Event.js'; 
import ProfileModel from '../../models/Profile.js';

function EventRoutes(app) {
  app.get("/api/events", async (req, res) => {
    try {
      const events = await Event.find();
      res.json(events);
    } catch (err) {
      res.status(500).send(err.message);
    }
  });

  app.get("/api/events/:eid", async (req, res) => {
    try {
      const event = await Event.findById(req.params.eid);
      if (!event) {
        return res.status(404).send("Event not found");
      }
      res.json(event);
    } catch (err) {
      res.status(500).send(err.message);
    }
  });

  app.put("/api/events/edit/:eid", async (req, res) => {
    try {
      const event = await Event.findByIdAndUpdate(req.params.eid, req.body, { new: true });
      if (!event) {
        return res.status(404).send("Event not found");
      }
      res.json(event);
    } catch (err) {
      res.status(500).send(err.message);
    }
  });

  app.delete("/api/events/:eid", async (req, res) => {
    try {
      await Event.findByIdAndDelete(req.params.eid);
      res.status(200).send("Event deleted");
    } catch (err) {
      console.log(err.message);
      res.status(500).send(err.message);
    }
  });

  app.post("/api/events", async (req, res) => {
    try {
      const { _id, ...eventDataWithoutId } = req.body;
      const newEvent = new Event(eventDataWithoutId);
      const savedEvent = await newEvent.save();
      res.status(201).json(savedEvent);
    } catch (err) {
      console.error('Error creating event:', err);
      res.status(500).send(err.message);
    }
  });

  app.post('/api/events/:eid/register', async (req, res) => {
    try {
      const event = await Event.findById(req.params.eid);
      const profile = await ProfileModel.findOne({ email: req.body.userEmail });
      if (!event) {
        return res.status(404).send('Event not found');
      }
      if (!event.attendance_id.includes(req.body.userEmail)) {
        event.attendance_id.push(req.body.userEmail);
        await event.save();
      }
      // deal with profile
      const isRegistered = profile.registeredEvent.includes(req.params.eid);
      if (!isRegistered) {
        const registeredResult = await ProfileModel.findOneAndUpdate(
          { email: req.body.userEmail },
          { $addToSet: { registeredEvent: { eventId: req.params.eid, eventTitle: req.body.eventTitle } } },
        );
        await profile.save();
      }

      res.status(200).send('User registered successfully');
    } catch (err) {
      res.status(500).send(err.message);
    }
  });

  app.post('/api/events/:eid/comments', async (req, res) => {
    try {
      const event = await Event.findById(req.params.eid);
      if (!event) {
        return res.status(404).send('Event not found');
      }
      event.comments.push(req.body); 
      await event.save();
      res.status(200).json({ message: 'Comment added successfully' });
    } catch (err) {
      console.log(err.message);
      res.status(500).send(err.message);
    }
  });
}
export default EventRoutes;

