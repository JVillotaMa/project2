import fs from 'fs';
import path from 'path';
import { parse } from 'csv-parse/sync';

// Define types for transport data
export interface TransportData {
  [key: string]: {
    [busType: string]: number | string | null;
  };
}

export function parseTransportCsvFile(): TransportData {
  try {
    // Read the CSV file
    const filePath = path.join(process.cwd(), 'src', 'app', 'api', 'transportes', 'data', 'dataCovimad.csv');
    console.log('Reading transport CSV file from:', filePath);
    
    const fileContent = fs.readFileSync(filePath, 'utf8');
    
    // Parse the CSV data (using semicolon as delimiter)
    const records = parse(fileContent, {
      delimiter: ',',  // Using comma as delimiter
      skip_empty_lines: true,
      trim: true
    });
    
    // First row contains the bus type headers
    const headers = records[0];
    
    // Create the result object
    const result: TransportData = {};
    
    // Process each row (starting from index 1 to skip the header row)
    for (let i = 1; i < records.length; i++) {
      const row = records[i];
      if (row.length >= 1 && row[0] !== '') {
        const fieldName = row[0].trim();
        result[fieldName] = {};
        
        // Process each column (bus type) for this field
        for (let j = 1; j < headers.length; j++) {
          if (headers[j]) {
            const busType = headers[j].trim();
            let value: string | number | null = row[j]?.trim() || null;
            
            // Convert numeric strings to numbers
            if (value !== null && !isNaN(Number(value))) {
              value = Number(value);
            }
            
            result[fieldName][busType] = value;
          }
        }
      }
    }
    
    console.log('Transport data parsed successfully');
    return result;
  } catch (error) {
    console.error('Error parsing transport CSV file:', error);
    return {};
  }
}
