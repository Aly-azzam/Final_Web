const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const solarPanelSchema = new Schema({
    title: {
        type: String,
        required: true,
        trim: true,
    },
    description: {
        type: String,
        required: true,
        trim: true,
    },
    price: {
        type: Number,
        required: true,
    },
    location: {
        type: String,
        required: true,
        trim: true,
    },
    image: {
        type: String, // Assuming you store the image URL or file path
    },
    datePosted: {
        type: Date,
        default: Date.now,
    },
    // status: {
    //     type: String,
    //     enum: ['active', 'sold', 'expired'],
    //     default: 'active',
    // },
    // user: {
    //     type: Schema.Types.ObjectId,
    //     ref: 'User',
    //     required: true,
    // },
    user: {
        _id: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        email: {
            type: String,
            trim: true,
        },
        phoneNumber: {
            type: String,
            trim: true,
        },
        firstName: {
            type: String,
            trim: true,
        },
        lastName: {
            type: String,
            trim: true,
        }
    }
});

const SolarPanel = mongoose.model('SolarPanel', solarPanelSchema);

module.exports = SolarPanel;
