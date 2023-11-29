import mongoose from 'mongoose';

const eventSchema = new mongoose.Schema({
  _id: {
    type: String,
    default: () => new mongoose.Types.ObjectId().toString()
  },
  imageUrl: {
    type: String,
    required: false 
  },
  name: {
    type: String,
    required: true
  },
  location: {
    type: String,
    required: true
  },
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date,
    required: true
  },
  organizer_id: {
    type: String, 
    required: true
  },
  attendance_id: [
    {
      type: String,
    }
  ],
  price: {
    type: String,
  },
  description: {
    type: String,
    required: true
  },
  comments: [
    {
      userEmail: {
        type: String, 
        required: true
      },
      content: {
        type: String,
        required: true
      }
    }
  ]
});

const Event = mongoose.model('Event', eventSchema);

export default Event;
