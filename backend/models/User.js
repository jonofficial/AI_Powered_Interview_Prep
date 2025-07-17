const mongoose = require('mongoose');

const useSchema = new mongoose.Schema(
    {
        name: { type: String, required: true },
        email: { type: String, required: true, unique: true },
        password: { type: String, required: true },
        profileImageURL: { type: String, default: null },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model('User', useSchema);
