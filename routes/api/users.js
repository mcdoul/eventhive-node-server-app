import express from 'express';
import argon2 from 'argon2';
import config from 'config';
import { check, validationResult } from 'express-validator';
import nodemailer from 'nodemailer';
import User from '../../models/User.js'; 
import ProfileModel from '../../models/Profile.js';
import uuid from 'uuid';
import { registerSchema, loginSchema, forgotPasswordSchema, resetPasswordSchema } from '../../models/validationSchemas.js';

const router = express.Router();

router.post(
	'/register',
	async (req, res) => {
		try {

		await registerSchema.validateAsync(req.body, { abortEarly: false });

		const { name, email, password } = req.body;
		const isAdministrator = false;
		
			let user = await User.findOne({ email });

			if (user) {
				return res
					.status(400)
					.json({ errors: [{ msg: 'User already exists' }] });
			}

			user = new User({
				name,
				email,
				password,
				isAdministrator,
			});
			//Create profile for new user

			const profiles = new ProfileModel({
				name,
				email,
			});

			const hashedPassword = await argon2.hash(password);
			user.password = hashedPassword;


			const apiKey = uuid.v4();
			user.apiKey = apiKey;

			await profiles.save();
			await user.save();

			res.json({ 'apiKey': user.apiKey });

		} catch (error) {

			if (error.isJoi) {
				const errors = error.details.map((detail) => ({
					msg: detail.message,
				  }));
			
				  return res.status(400).json({ errors });
			  }


			console.error(error.message);
			res.status(500).send('Server error');
		}
	}
);

router.post(
	'/login',
	async (req, res) => {
		try {
		await loginSchema.validateAsync(req.body, { abortEarly: false });

		const { email, password, isAdministrator } = req.body;
			let user = await User.findOne({ email });

			if (!user) {
				return res.status(400).json({ errors: [{ msg: 'User not exists' }] });
			}

			if (isAdministrator && !user.isAdministrator) {
				return res
					.status(400)
					.json({ errors: [{ msg: 'You are not an Administrator' }] });
			}

			const isCorrect = await argon2.verify(user.password, password);


			if (!isCorrect) {
				return res.status(400).json({ errors: [{ msg: 'Password wrongs' }] });
			}

			res.json({ 'apiKey': user.apiKey });

		} catch (error) {

			if (error.isJoi) {
				const errors = error.details.map((detail) => ({
					msg: detail.message,
				}));
			
				  return res.status(400).json({ errors });
			  }
			console.error(error.message);
			res.status(500).send('Server error');
		}
	}
);

router.get('/load', async (req, res) => {
	const apiKey = req.header('x-api-key');

	if (!apiKey) {
		return res
			.status(401)
			.json({ msg: 'Please use apiKey to get the user information' });
	}

	try {
		try {
			const user = await User.findOne({ apiKey }).select('-password -apiKey');
			res.json(user);
		} catch (err) {
			console.error(err.message);
			res.status(500).send('Server Error');
		}
	} catch (err) {
		res.status(401).json({ msg: 'apiKey wrongs' });
	}
});

router.post(
	'/forgot-password',
	async (req, res) => {
		try {
		await forgotPasswordSchema.validateAsync(req.body, { abortEarly: false });
		const { email } = req.body;
			const user = await User.findOne({ email });

			if (!user) {
				return res.status(400).json({ errors: [{ msg: 'User not found, Please go to Registration Page' }] });
			}

            const validationCode = Math.floor(100000 + Math.random() * 900000);
            user.validationCode = validationCode;
            user.validationCodeExpires = Date.now() + 900000; 


			await user.save();

			const transporter = nodemailer.createTransport({
				service: 'gmail',
				auth: {
					user: config.get('email'),
					pass: config.get('password'),
				},
			});

			const mailOptions = {
				from: config.get('email'),
				to: user.email,
				subject: 'EventHive Account Password Reset Request',
				text: 
                `Dear ${user.name},\n\n

                We're reaching out to inform you that a password reset for your account has been requested, either by you or someone else.\n
                Your verification code is ${validationCode}. This code will expire in 15 minutes.\n
                If you received this email by mistake, just ignore it.\n\n
                
                Best,
                EventHive Team
                `,
			};

			await transporter.sendMail(mailOptions);

			res.json({ msg: 'Password reset email sent' });
		} catch (error) {
			if (error.isJoi) {
				const errors = error.details.map((detail) => ({
					msg: detail.message,
				}));
			
				  return res.status(400).json({ errors });
			  }

			console.error(error.message);
			res.status(500).send('Server error');
		}
	}
);

router.post(
	'/reset-password',
	async (req, res) => {
		try {
			await resetPasswordSchema.validateAsync(req.body, { abortEarly: false });
		const {email,  validationCode, password } = req.body;

		
			const user = await User.findOne({
                email,
				validationCode: validationCode,
				validationCodeExpires: { $gt: Date.now() },
			});

			if (!user) {
				return res
					.status(400)
					.json({ errors: [{ msg: 'Invalid or expired Validation Code' }] });
			}
			const hashedPassword = await argon2.hash(password);
			user.password = hashedPassword;


			user.password = hashedPassword;
			user.validationCode = undefined;
			user.validationCodeExpires = undefined;

			await user.save();

			res.json({ msg: 'Password reset successfully, Please go to Login Page' });
		} catch (error) {
			if (error.isJoi) {
				const errors = error.details.map((detail) => ({
					msg: detail.message,
				}));
			
				  return res.status(400).json({ errors });
			  }
			console.error(error.message);
			res.status(500).send('Server error');
		}
	}
);

export default router;
