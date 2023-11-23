import express from 'express'
import EventRoutes from "./routes/api/Events/routes.js";
import cors from "cors";


const app = express();
app.use(cors());
app.use(express.json()); //Should be before the route
EventRoutes(app);
app.get('/', (req, res) => {
    res.send('Welcome to the EventHive API!');
  });
app.listen(4000);
