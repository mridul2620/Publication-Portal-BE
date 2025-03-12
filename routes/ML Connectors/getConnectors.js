// // routes/Connectors/connectors.js
// const express = require('express');
// const MLConnector = require('../../models/mlconnector');
// const router = express.Router();

// router.get('/api/ml/connectors', async (req, res) => {
//   try {
//     const connectors = await MLConnector.find();

//     const connectorList = connectors.map(connector => ({
//       _id: connector._id,
//       connectorName: connector.connectorName,
//       description: connector.description,
//       numberOfPins: connector.numberOfPins,
//       color: connector.color,
//       partNumber: connector.partNumber,
//       location:connector.location,
//       powerSupply:connector.powerSupply,
//       imageUrl: `/connectors/${connector._id}/image`, 
//     }));

//     res.status(200).json({ connectors: connectorList });
//   } catch (error) {
//     console.error("Error fetching connectors:", error);
//     res.status(500).json({ message: 'Error fetching connectors', error });
//   }
// });

// module.exports = router;

// routes/Connectors/connectors.js
const express = require('express');
const MLConnector = require('../../models/mlconnector'); 
const router = express.Router();

router.get('/api/ml/connectors', async (req, res) => {
  try {
    // Fetch all connectors from the database
    const connectors = await MLConnector.find().lean();
    console.log("Sample connector raw:", JSON.stringify(connectors[0], null, 2));

    // Map the connectors to the format you want to send in the response
    const connectorList = connectors.map(connector => {
      // Create base connector object with all fields
      const connectorData = {
        _id: connector._id,
        connectorName: connector.connectorName || '', 
        location: connector.location || '',
        connectorID: connector.connectorID || '',
        connectorPartNumber: connector.connectorPartNumber || '',
        supplierPartNumber: connector.supplierPartNumber || '',
        connectorDescription: connector.connectorDescription || '',
        supplier: connector.supplier || '',
        fitPart: connector.fitPart || [], // Now returning the array of fit parts
        legend: connector.legend || [],
        description: connector.description,
        numberOfPins: connector.numberOfPins,
        color: connector.color,
        partNumber: connector.partNumber,
        location:connector.location,
        powerSupply:connector.powerSupply,     // Already an array
      };

      // Add image URL only if the connector has an image
      if (connector.image && connector.image.length > 0) {
        connectorData.imageUrl = `/api/ml/connectors/${connector._id}/image`;
      }

      return connectorData;
    });

    // Send response with connectors list
    res.status(200).json({ 
      success: true,
      count: connectorList.length,
      connectors: connectorList 
    });
  } catch (error) {
    console.error("Error fetching connectors:", error);
    res.status(500).json({ 
      success: false,
      message: 'Error fetching connectors', 
      error: error.message 
    });
  }
});

// Add endpoint to fetch a single connector by ID
router.get('/api/ml/connectors/:id', async (req, res) => {
  try {
    const connector = await MLConnector.findById(req.params.id);
    
    if (!connector) {
      return res.status(404).json({ 
        success: false,
        message: 'Connector not found'
      });
    }

    // Create response object with all connector data
    const connectorData = {
      _id: connector._id,
      connectorName: connector.connectorName || '', 
      location: connector.location || '',
      connectorID: connector.connectorID || '',
      connectorPartNumber: connector.connectorPartNumber || '',
      supplierPartNumber: connector.supplierPartNumber || '',
      connectorDescription: connector.connectorDescription || '',
      supplier: connector.supplier || '',
      fitPart: connector.fitPart || [], // Now returning the array of fit parts
      legend: connector.legend || [],     // Already an array
    };

    // Add image URL only if the connector has an image
    if (connector.image && connector.image.length > 0) {
      connectorData.imageUrl = `/api/ml/connectors/${connector._id}/image`;
    }

    res.status(200).json({ 
      success: true,
      connector: connectorData 
    });
  } catch (error) {
    console.error("Error fetching connector:", error);
    res.status(500).json({ 
      success: false,
      message: 'Error fetching connector',
      error: error.message 
    });
  }
});

// Add endpoint to serve connector images
router.get('/api/ml/connectors/:id/image', async (req, res) => {
  try {
    const connector = await MLConnector.findById(req.params.id);
    
    if (!connector || !connector.image || !connector.imageType) {
      return res.status(404).send('Image not found');
    }

    // Set the content type and send the image buffer
    res.set('Content-Type', connector.imageType);
    res.send(connector.image);
  } catch (error) {
    console.error("Error fetching image:", error);
    res.status(500).send('Error fetching image');
  }
});

module.exports = router;