// routes/connectorRoutes.js
const express = require('express');
const router = express.Router();
const MLConnector = require('../../models/mlconnector');

// PUT route to update a specific field of a specific connector by its ID
router.put('/api/ml/updateConnector/:id', async (req, res) => {
  try {
    const connectorId = req.params.id;
    const updateData = req.body; // Data to be updated is sent in the request body

    const updatedConnector = await MLConnector.findByIdAndUpdate(
      connectorId,
      { $set: updateData }, // Only update the fields provided in the request
      { new: true, runValidators: true } // Return the updated document and apply schema validation
    );

    if (!updatedConnector) {
      return res.status(404).json({
        message: `Connector with ID ${connectorId} not found`,
      });
    }

    res.status(200).json({
      message: 'Connector updated successfully',
      updatedConnector,
    });
  } catch (error) {
    res.status(500).json({
      message: 'Error updating connector',
      error: error.message,
    });
  }
});

module.exports = router;
