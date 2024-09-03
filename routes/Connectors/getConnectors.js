// routes/Connectors/connectors.js
const express = require('express');
const Connector = require('../../models/connector');
const router = express.Router();

router.get('/connectors', async (req, res) => {
  try {
    const connectors = await Connector.find();

    const connectorList = connectors.map(connector => ({
      _id: connector._id,
      connectorName: connector.connectorName,
      description: connector.description,
      numberOfPins: connector.numberOfPins,
      modelName: connector.modelName,
      partNumber: connector.partNumber,
      imageUrl: `/connectors/${connector._id}/image`, // URL to retrieve the image
    }));

    res.status(200).json({ connectors: connectorList });
  } catch (error) {
    console.error("Error fetching connectors:", error);
    res.status(500).json({ message: 'Error fetching connectors', error });
  }
});

module.exports = router;
