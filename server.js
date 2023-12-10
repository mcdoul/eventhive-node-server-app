import express from 'express';
import cors from 'cors';
import connectDB from './config/db.js';
import usersRoutes from './routes/api/users.js';
import profileRoutes from './routes/api/profile.js';
import postsRoutes from './routes/api/posts.js';
import EventRoutes from './routes/api/event.js';
import "dotenv/config";


const app = express();

connectDB();
app.use(cors({
    credentials: true,
    origin: process.env.FRONTEND_URL,}
    ));
app.use(express.json({ extended: false }));

app.use('/api/users', usersRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/posts', postsRoutes);

EventRoutes(app);

app.get('/', (req, res) => res.send('Welcome to EventHive, API is running!'));

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => console.log(`Server started successfully on port ${PORT}`));
