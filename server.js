import express from 'express';
import cors from 'cors';
import connectDB from './config/db.js';
import usersRoutes from './routes/api/users.js';
import authRoutes from './routes/api/auth.js';
import profileRoutes from './routes/api/profile.js';
import postsRoutes from './routes/api/posts.js';
import EventRoutes from './routes/api/event.js';

const app = express();

connectDB();

app.use(cors());
app.use(express.json({ extended: false }));

app.use('/api/users', usersRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/posts', postsRoutes);
EventRoutes(app); 

app.get('/', (req, res) => res.send('Welcome to EventHive, API is running!'));

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
