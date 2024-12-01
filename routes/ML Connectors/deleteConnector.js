// routes/connectorRoutes.js
const express = require('express');
const router = express.Router();
const MLConnector = require('../../models/mlconnector');

// DELETE route to delete a specific connector by its ID
router.delete('/api/ml/delete/connector/:id', async (req, res) => {
  try {
    const connectorId = req.params.id;
    const deletedConnector = await MLConnector.findByIdAndDelete(connectorId);

    if (!deletedConnector) {
      return res.status(404).json({
        message: `Connector with ID ${connectorId} not found`,
      });
    }

    res.status(200).json({
      message: 'Connector deleted successfully',
      deletedConnector,
    });
  } catch (error) {
    res.status(500).json({
      message: 'Error deleting connector',
      error: error.message,
    });
  }
});

module.exports = router;
