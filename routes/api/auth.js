// import { Router } from 'express';
// const router = Router();
// import compare from 'bcryptjs';
// import verify from 'jsonwebtoken';
// import sign from 'jsonwebtoken';
// import get from 'config';
// import { check, validationResult } from 'express-validator';
// import User from '../../models/User.js';

import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import config from 'config';
import { check, validationResult } from 'express-validator';
import User from '../../models/User.js';
const router = express.Router();

// input: token
// return: user Object (if success)
router.get('/', async (req, res) => {
	const token = req.header('x-auth-token');

	if (!token) {
		return res
			.status(401)
			.json({ msg: 'Please use token to get the user information' });
	}

	try {
		// console.log('token = ' + token);
		const decoded = jwt.verify(token, config.get('jwtSecret'));
		req.user = decoded.user;
		try {
			const user = await User.findById(req.user.id).select('-password');
			res.json(user);
		} catch (err) {
			console.error(err.message);
			res.status(500).send('Server Error');
		}
	} catch (err) {
		res.status(401).json({ msg: 'Token wrongs' });
	}
});

// login
// input: user email + password
// output: token (if success)
router.post(
	'/',
	[
		check('email', 'please include a valid email').isEmail(),
		check('password', 'Password is required').exists(),
	],

	async (req, res) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.status(400).json({ errors: errors.array() });
		}

		const { email, password } = req.body;
		try {
			let user = await User.findOne({ email });

			if (!user) {
				return res.status(400).json({ errors: [{ msg: 'User not exists' }] });
			}

			const isMatch = await bcrypt.compare(password, user.password);

			if (!isMatch) {
				return res.status(400).json({ errors: [{ msg: 'Password wrongs' }] });
			}

			const payload = {
				user: {
					id: user.id,
				},
			};

			jwt.sign(
				payload,
				config.get('jwtSecret'),
				{ expiresIn: 360000 },
				(err, token) => {
					if (err) throw err;
					res.json({ token });
				}
			);
		} catch (err) {
			console.error(err.message);
			res.status(500).send('Server error');
		}
	}
);

export default router;
