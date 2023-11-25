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
});

const User = model('user', UserSchema);
export default User;

// export default User = model('user', UserSchema);
