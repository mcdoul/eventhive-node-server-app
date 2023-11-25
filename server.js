import express, { json } from 'express';
// import connectDB from '../config/db';
import connectDB from './config/db.js';
import usersRoutes from './routes/api/users.js';
import authRoutes from './routes/api/auth.js';
// import profileRoutes from './routes/api/profile.js';
// import postsRoutes from './routes/api/posts.js';
import cors from 'cors';

const app = express();

connectDB();
app.use(cors());

app.use(json({ extended: false }));

app.get('/', (req, res) => res.send('API Running'));

// app.use('/api/users', require('./routes/api/users').default);
// app.use('/api/auth', require('./routes/api/auth').default);
// app.use('/api/profile', require('./routes/api/profile').default);
// app.use('/api/posts', require('./routes/api/posts').default);

app.use('/api/users', usersRoutes);
app.use('/api/auth', authRoutes);
// app.use('/api/profile', profileRoutes);
// app.use('/api/posts', postsRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
