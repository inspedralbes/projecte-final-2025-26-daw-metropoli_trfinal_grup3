import mongoose from 'mongoose';

const connectMongo = async () => {
    try {
        const mongoURI = process.env.MONGO_URI || 'mongodb://mongo:27017/metropoli';
        await mongoose.connect(mongoURI);
        console.log('MongoDB connected successfully');
    } catch (error) {
        console.error('MongoDB connection error:', error);
        process.exit(1);
    }
};

export default connectMongo;
