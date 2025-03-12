// models/Connector.js
const mongoose = require('mongoose');

const legendSchema = new mongoose.Schema({
  cavity: { type: String, required: false  },
  wireNumber: { type: String, required: false  },
  identTag: { type: String, required: false  },
  fromTag: { type: String , required: false },
  toTag: { type: String , required: false },
  wirePN: { type: String, required: false  },
  colour: { type: String, required: false  },
  size: { type: String, required: false  },
  material: { type: String, required: false  },
  to: { type: String, required: false  },
  pin: { type: String, required: false  },
  terminal: { type: String, required: false  },
  seal: { type: String, required: false  },
  mcID: { type: String, required: false  },
  stripLength: { type: String, required: false  },
  fromLabel: { type: String, required: false  },
  fromLabelMaterial: { type: String, required: false  },
  toLabel: { type: String, required: false  },
  toLabelMaterial: { type: String, required: false  },
  nextOp: { type: String , required: false },
  variant: { type: String , required: false },
  options: { type: String , required: false  }
});

const fitPartSchema = new mongoose.Schema({
  compName: { type: String, required:false}, // Component name/number like "1928 405 978"
  compDesc: { type: String, required:false}  // Component description like "HOLDING PLATE_52WY"
});

const mlconnectorSchema = new mongoose.Schema({
  connectorName: { type: String, required: false },
  location: { type: String, required: false },
  connectorID: { type: String, required: false },
  connectorPartNumber: { type: String, required: false },
  supplierPartNumber: { type: String, required: false },
  connectorDescription: { type: String, required: false },
  supplier: { type: String, required: false },
  legend: [legendSchema], // Renamed from fitPart
  fitPart: [fitPartSchema], // New simplified structure
  image: { type: Buffer }, // Kept from previous model
  imageType: { type: String },
  description: { type: String, required: true },
  numberOfPins: { type: String, required: true },
  color: { type: String, required: true },
  partNumber: { type: String, required: true },
  powerSupply: { type: String, required: true },
});

const MLConnector = mongoose.model('MLConnector', mlconnectorSchema);

module.exports = MLConnector;