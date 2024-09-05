// models/Connector.js
const mongoose = require('mongoose');

const connectorSchema = new mongoose.Schema({
  connectorName: { type: String, required: true },
  description: { type: String, required: true },
  numberOfPins: { type: String, required: true },
  color: { type: String, required: true },
  partNumber: { type: String, required: true },
  image: { type: Buffer}, // Store the image data as a Buffer
  imageType: { type: String} // Store the image MIME type (e.g., 'image/jpeg')
});

const Connector = mongoose.model('Connector', connectorSchema);

module.exports = Connector;
