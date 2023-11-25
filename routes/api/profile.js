import { Router } from 'express';
const router = Router();

router.get('/', (req, res) => res.send('Profile route'));

export default router;
