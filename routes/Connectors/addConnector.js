const express = require('express');
const multer = require('multer');
const Connector = require('../../models/connector');
const router = express.Router();

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.post('/connectors', upload.single('image'), async (req, res) => {
  const { connectorName, description, numberOfPins, modelName, partNumber } = req.body;

  const newConnectorData = {
    connectorName,
    description,
    numberOfPins,
    modelName,
    partNumber,
  };

  // Check if an image was uploaded
  if (req.file) {
    newConnectorData.image = req.file.buffer;
    newConnectorData.imageType = req.file.mimetype;
  }

  const newConnector = new Connector(newConnectorData);

  try {
    await newConnector.save();
    res.redirect('/add-connector'); 
  } catch (error) {
    console.error("Error saving connector:", error);
    res.status(500).send({ message: 'Error saving connector', error });
  }
});

module.exports = router;
