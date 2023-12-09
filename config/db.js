import mongoose from 'mongoose';
import config from 'config';

const db = config.get('mongoURI');

const connectDB = async () => {
    try {
        await mongoose.connect(db, {});
        console.log(`connected: "${config.get('mongoURI')}"`);
    } catch (err) {
        console.log('Connect Fail');
        console.error(err.message);
        process.exit(1);
    }
}

export default connectDB;
