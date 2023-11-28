import mongoose from "mongoose";

const profileSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },

    email: {
        type: String,
        required: true,
        unique: true
    },

    description:{
        type: String,
        required: false
    },
    
    phone:{
        type: String,
        required: false
    },

    address1:{
        type: String,
        required: false
    },

    address2:{
        type: String,
        required: false
    },

    followers: [{
        name: {
            type: String,
            required: false,
        },
        email: {
            type: String,
            required: false,
        },
    }],

    following: [{
        name: {
            type: String,
            required: false,
        },
        email: {
            type: String,
            required: false,
        },
    }],
    },
    {collection: 'profile'}
    
);

const ProfileModel = mongoose.model('profile', profileSchema);
export default ProfileModel;