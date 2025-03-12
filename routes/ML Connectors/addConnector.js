const express = require('express');
const multer = require('multer');
const xlsx = require('xlsx');
const MLConnector = require('../../models/mlconnector');

const router = express.Router();

// Multer storage (store in memory)
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Route to upload and process Excel file
router.post('/api/ml/connectors', upload.single('file'), async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ message: "No file uploaded" });
    }

    try {
        // Read uploaded file as workbook with merged cells option
        const workbook = xlsx.read(req.file.buffer, { type: 'buffer' });

        // Get the "ConnectorList" sheet
        const sheetName = "ConnectorList";
        if (!workbook.Sheets[sheetName]) {
            return res.status(400).json({ message: "ConnectorList sheet not found" });
        }

        // Convert sheet data to JSON with raw values
        const sheetData = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName], { 
            header: 1,
            raw: true,
            defval: ''  // Default empty string for undefined cells
        });

        // Get merged cell ranges to handle them properly
        const merges = workbook.Sheets[sheetName]['!merges'] || [];
        
        // Function to get value from potentially merged cell
        const getMergedCellValue = (rowIndex, colIndex) => {
            // First check if the regular cell has a value
            if (sheetData[rowIndex] && sheetData[rowIndex][colIndex] !== undefined && sheetData[rowIndex][colIndex] !== '') {
                return sheetData[rowIndex][colIndex];
            }
            
            // Check if this cell is part of a merged region
            for (const merge of merges) {
                if (rowIndex >= merge.s.r && rowIndex <= merge.e.r && 
                    colIndex >= merge.s.c && colIndex <= merge.e.c) {
                    // Get value from the top-left cell of the merged region
                    return sheetData[merge.s.r][merge.s.c];
                }
            }
            
            return '';
        };

        let connectors = [];
        let currentConnector = null;
        let i = 6; // Data starts from row 7 (index 6)

        while (i < sheetData.length) {
            // Check if this row might be a connector name row
            // A connector name row typically has content in first columns and is followed by specific pattern
            
            const currentRowA = getMergedCellValue(i, 0);
            const locationValue = getMergedCellValue(i, 2); // Column C (index 2)
            
            // Check if this is a new connector row
            // New connector rows have values in column A but are not headers, cavity rows, or FIT PART rows
            if (currentRowA && 
                !String(currentRowA).includes('FIT PART') && 
                !String(currentRowA).includes('Connector Part No.') &&
                !String(currentRowA).includes('Cavity') &&
                !/^\d+$/.test(String(currentRowA)) && // Not a number (cavity)
                currentRowA !== 'Wire No.' &&
                currentRowA !== 'Ident Tag') {
                
                // Initialize new connector object
                currentConnector = {
                    connectorName: currentRowA,  // From column A
                    location: locationValue.includes('ZONE') ? locationValue : '', // From column C if it contains "ZONE"
                    connectorID: '',
                    connectorPartNumber: '',
                    supplier: '',
                    connectorDescription: '',
                    supplierPartNumber: '',
                    legend: [],
                    fitPart: []
                };
                
                // DEBUG
                console.log(`Found new connector: ${currentConnector.connectorName} at row ${i+1}`);
                console.log(`Location: ${currentConnector.location}`);
                
                // Get connector ID from next row
                if (i+1 < sheetData.length) {
                    currentConnector.connectorID = getMergedCellValue(i+1, 0);
                }
                
                // Get connector part number and supplier from row after ID
                if (i+2 < sheetData.length) {
                    currentConnector.connectorPartNumber = getMergedCellValue(i+2, 1); // Column B
                    currentConnector.supplier = getMergedCellValue(i+2, 3); // Column D
                }
                
                // Get connector description and supplier part number from next row
                if (i+3 < sheetData.length) {
                    currentConnector.connectorDescription = getMergedCellValue(i+3, 1); // Column B
                    currentConnector.supplierPartNumber = getMergedCellValue(i+3, 3); // Column D
                }
                
                // Add this connector to our array
                connectors.push(currentConnector);
                
                // Move to the row after the basic connector info
                i += 4;
            } else {0
                // Check if this is a FIT PART row
                const fitPartText = getMergedCellValue(i, 0);
                
                if (fitPartText && String(fitPartText).includes('FIT PART') && currentConnector) {
                    // Extract component name and description from columns
                    const compName = getMergedCellValue(i, 1); // Column B
                    const compDesc = getMergedCellValue(i, 2); // Column C
                    
                    // Only add if we have actual, meaningful data (not just placeholders)
                    const isValidFitPart = compName && 
                        compName.trim() !== 'FIT PART : -' && 
                        compName.trim() !== '' &&
                        compDesc && 
                        compDesc.trim() !== 'FIT PART : -' && 
                        compDesc.trim() !== '';
                    
                    if (isValidFitPart) {
                        currentConnector.fitPart.push({
                            compName: compName,
                            compDesc: compDesc
                        });
                        console.log(`  Added FIT PART: ${compName} - ${compDesc}`);
                    }
                    
                    i++;
                }
                // Check if this is the start of the legend table (Cavity header row)
                else if (getMergedCellValue(i, 0) === 'Cavity' && currentConnector) {
                    // Skip the header row
                    i++;
                    
                    // Start collecting legend rows
                    while (i < sheetData.length) {
                        const cavity = getMergedCellValue(i, 0);
                        
                        // Break if we've reached an empty row or a new section
                        if (!cavity || 
                            String(cavity).includes('FIT PART') || 
                            cavity === 'Connector Part No.' ||
                            (isNaN(Number(cavity)) && cavity !== '' && !/^\d+$/.test(String(cavity)))) {
                            break;
                        }
                        
                        // Add legend row
                        currentConnector.legend.push({
                            cavity: getMergedCellValue(i, 0)?.toString() || '',
                            wireNumber: getMergedCellValue(i, 1)?.toString() || '',
                            identTag: getMergedCellValue(i, 2)?.toString() || '',
                            fromTag: getMergedCellValue(i, 3)?.toString() || '',
                            toTag: getMergedCellValue(i, 4)?.toString() || '',
                            wirePN: getMergedCellValue(i, 5)?.toString() || '',
                            colour: getMergedCellValue(i, 6)?.toString() || '',
                            size: getMergedCellValue(i, 7)?.toString() || '',
                            material: getMergedCellValue(i, 8)?.toString() || '',
                            to: getMergedCellValue(i, 9)?.toString() || '',
                            pin: getMergedCellValue(i, 10)?.toString() || '',
                            location: getMergedCellValue(i, 11)?.toString() || '',
                            terminal: getMergedCellValue(i, 12)?.toString() || '',
                            seal: getMergedCellValue(i, 13)?.toString() || '',
                            mcID: getMergedCellValue(i, 14)?.toString() || '',
                            stripLength: getMergedCellValue(i, 15)?.toString() || '',
                            fromLabel: getMergedCellValue(i, 16)?.toString() || '',
                            fromLabelMaterial: getMergedCellValue(i, 17)?.toString() || '',
                            toLabel: getMergedCellValue(i, 18)?.toString() || '',
                            toLabelMaterial: getMergedCellValue(i, 19)?.toString() || '',
                            nextOp: getMergedCellValue(i, 20)?.toString() || '',
                            variant: getMergedCellValue(i, 21)?.toString() || '',
                            options: getMergedCellValue(i, 22)?.toString() || '',
                        });
                        
                        i++;
                    }
                    
                    console.log(`  Added ${currentConnector.legend.length} legend rows`);
                } else {
                    // Move to next row
                    i++;
                }
            }
        }

        // Filter out any incomplete connectors - only keep connectors that have legend data
        const validConnectors = connectors.filter(conn => conn.legend && conn.legend.length > 0);
        console.log(`Total connectors found: ${connectors.length}, Valid connectors: ${validConnectors.length}`);

        // Save each valid connector to MongoDB
        let savedConnectors = [];
        for (const connector of validConnectors) {
            console.log(`Saving connector: ${connector.connectorName} (${connector.location})`);
            console.log(`  Legend rows: ${connector.legend.length}, FIT PART items: ${connector.fitPart.length}`);
            
            const newConnector = new MLConnector({
                connectorName: connector.connectorName,
                location: connector.location,
                connectorID: connector.connectorID,
                connectorPartNumber: connector.connectorPartNumber,
                supplierPartNumber: connector.supplierPartNumber,
                connectorDescription: connector.connectorDescription,
                supplier: connector.supplier,
                legend: connector.legend,
                fitPart: connector.fitPart // This will now only contain meaningful entries
            });
            
            const savedConnector = await newConnector.save();
            savedConnectors.push(savedConnector);
        }

        res.json({ 
            message: "Connectors saved successfully", 
            count: savedConnectors.length,
            connectors: savedConnectors.map(c => c._id)
        });

    } catch (error) {
        console.error("Error processing file:", error);
        res.status(500).json({ message: "Error processing file", error: error.message });
    }
});

router.post('/api/ml/addconnectors', upload.single('image'), async (req, res) => {
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





//http://localhost:3000/circuit-page?brand=Chartsign&model=CS2024&year=2024