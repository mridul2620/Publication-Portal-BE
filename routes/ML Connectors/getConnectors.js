// routes/Connectors/connectors.js
const express = require('express');
const MLConnector = require('../../models/mlconnector');
const router = express.Router();

router.get('/api/ml/connectors', async (req, res) => {
  try {
    const connectors = await MLConnector.find();

    const connectorList = connectors.map(connector => ({
      _id: connector._id,
      connectorName: connector.connectorName,
      description: connector.description,
      numberOfPins: connector.numberOfPins,
      color: connector.color,
      partNumber: connector.partNumber,
      location:connector.location,
      powerSupply:connector.powerSupply,
      imageUrl: `/connectors/${connector._id}/image`, 
    }));

    res.status(200).json({ connectors: connectorList });
  } catch (error) {
    console.error("Error fetching connectors:", error);
    res.status(500).json({ message: 'Error fetching connectors', error });
  }
});

module.exports = router;
