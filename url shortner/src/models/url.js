const mongoose = require('mongoose');

const UrlSchema = new mongoose.Schema({
    short_url: { type: String, unique: true },
    long_url: { type: String, required: true },
    created_at: { type: Date, default: Date.now },
    expiration_date: { type: Date },
});

module.exports = mongoose.model('Url', UrlSchema);
