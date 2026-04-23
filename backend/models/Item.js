const mongoose = require('mongoose');

const itemSchema = mongoose.Schema(
    {
        itemName: {
            type: String,
            required: [true, 'Please add the item name'],
        },
        description: {
            type: String,
        },
        type: {
            type: String,
            required: [true, 'Please select type (Lost or Found)'],
            enum: ['Lost', 'Found'],
        },
        location: {
            type: String,
        },
        date: {
            type: Date,
            default: Date.now,
        },
        contactInfo: {
            type: String,
            required: [true, 'Please add contact info'],
        },
        imageUrl: {
            type: String,
        },
        user: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'User',
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model('Item', itemSchema);
