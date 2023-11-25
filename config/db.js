// const mongoose = require('mongoose');
// const config = require('config');
// const db = config.get('mongoURI')

// const connectDB = async () => {
//     try {
//         await mongoose.connect(db, {
//         });
//         console.log('MongoDB Connected....');
//     } catch (err) {
//         console.log('Error!!!!....');
//         console.error(err.message);
//         process.exit(1);
//     }
// }

// module.exports = connectDB;

// import mongoose from 'mongoose';
// import config from 'config';

// const db = config.get('mongoURI');

// const connectDB = async () => {
// 	try {
// 		await mongoose.connect(db, {
// 			// Add your connection options here if needed
// 		});
// 		console.log('MongoDB Connected....');
// 	} catch (err) {
// 		console.log('Error!!!!....');
// 		console.error(err.message);
// 		process.exit(1);
// 	}
// };

// export default connectDB;

import mongoose from 'mongoose';
import config from 'config';

const db = config.get('mongoURI');

const connectDB = async () => {
	try {
		await mongoose.connect(db, {});
		console.log('MongoDB Connected....');
	} catch (err) {
		console.log('Error!!!!....');
		console.error(err.message);
		process.exit(1);
	}
};

export default connectDB;
