const db = require('../notifierdb_connect');
const mongoose = require('mongoose');
const { NotifiesType } = require('../../config');

const ClientSchema = new mongoose.Schema({
    client_id: { type: Number, required: true, unique: true },
    type: { type: String, enum: [ 'user', 'group' ] },
    subscribedNotifies: { type: [ String ], enum: [ ...NotifiesType ], default: [] }
},
{
    toObject: { virtuals: true }, timestamps: true
});

ClientSchema.pre('save', function (next) {
    this.type = this.client_id > 0 ? 'user' : 'group';
    next();
});

module.exports = db.model('client', ClientSchema);
