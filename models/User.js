import { Schema, model } from 'mongoose';

const UserSchema = new Schema({
	name: {
		type: String,
		required: true,
	},

	email: {
		type: String,
		required: true,
		unique: true,
	},

	password: {
		type: String,
		required: true,
	},

	isAdministrator: {
		type: Boolean,
		required: true,
		default: false,
	},

	validationCode: {
		type: String,
		required: false,
	},

	validationCodeExpires: {
		type: String,
		required: false,
	},

    apiKey: {
        type: String,
        unique: true,
      },
});

const User = model('user', UserSchema);
export default User;