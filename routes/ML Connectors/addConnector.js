const express = require('express');
const multer = require('multer');
const MLConnector = require('../../models/mlconnector');
const router = express.Router();

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.post('/api/ml/connectors', upload.single('image'), async (req, res) => {
  const { connectorName, description, numberOfPins, color, partNumber, powerSupply, location } = req.body;

  const newConnectorData = {
    connectorName,
    description,
    numberOfPins,
    color,
    partNumber,
    powerSupply,
    location
  };

  if (req.file) {
    newConnectorData.image = req.file.buffer;
    newConnectorData.imageType = req.file.mimetype;
  }

  const newConnector = new MLConnector(newConnectorData);

  try {
    await newConnector.save();
    res.redirect('/add-connector'); 
  } catch (error) {
    console.error("Error saving connector:", error);
    res.status(500).send({ message: 'Error saving connector', error });
  }
});

module.exports = router;
