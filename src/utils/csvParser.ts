import fs from 'fs';
import path from 'path';
import { parse } from 'csv-parse/sync';

export interface CsvVehicleData {
  [key: string]: string | number | null;
}

export function parseVehicleCsvFile(fileName: string): CsvVehicleData {
  try {
    // Only use the App Router API folder path
    const filePath = path.join(process.cwd(), 'src', 'app', 'api', 'mercancias', 'data', fileName);
    
    let fileContent = '';
    
    try {
      console.log('Reading file from:', filePath);
      fileContent = fs.readFileSync(filePath, 'utf8');
      console.log('Successfully read file from:', filePath);
    } catch (err) {
      console.error('Could not read file from:', filePath, err);
      throw new Error(`Could not read the file: ${fileName} from: ${filePath}`);
    }
    
    // If we couldn't find the file in any location, throw an error
    if (!fileContent) {
      throw new Error(`Could not find the file: ${fileName} in any of the possible locations`);
    }
    
    // Parse CSV as array of arrays
    const records = parse(fileContent, {
      skip_empty_lines: true,
      trim: true
    });

    // Convert to object with key-value pairs
    const result: CsvVehicleData = {};
    
    // Flag to track when we found the header row for cabeza/semirremolque
    let foundColumnHeaderRow = false;
    
    // Fields that have separate values for cabeza tractora and semirremolque
    const splitFieldKeys = [
      'Precio venta sin IVA',
      'Dto. Medio sobre tarifa',
      'Valor residual %',
      'Periodo amortizacion'  // Removed accent on "ó"
    ];
    
    for (let i = 0; i < records.length; i++) {
      const row = records[i];
      
      // Check if this is the header row that defines the cabeza/semirremolque columns
      if (row.length >= 3 && 
          row[1]?.trim().includes('Cabeza tractora') && 
          (row[2]?.trim().includes('Semirremolque') || row[2]?.trim().includes('carrozado'))) {
        foundColumnHeaderRow = true;
        console.log('Found column header row at line:', i);
        continue; // Skip this row as it's just headers
      }
      
      if (row.length >= 2 && row[0] !== '') {
        const key = row[0].trim();
        const normalizedKey = normalizeString(key);
        
        // Check if this is a field that should have separate values
        const isSplitField = splitFieldKeys.includes(normalizedKey);
        
        // Simple case for rows before the column header row
        if (!foundColumnHeaderRow) {
          let value: string | number | null = row[1]?.trim() || null;
          
          // Convert numeric strings to numbers
          if (value !== null && !isNaN(Number(value))) {
            value = Number(value);
          }
          
          console.log(`CSV Key: "${key}" => Normalized: "${normalizedKey}" = ${value}`);
          result[normalizedKey] = value;
        } 
        // For rows after the column header that need split values
        else if (foundColumnHeaderRow && isSplitField && row.length >= 3) {
          // Store cabeza tractora value
          let cabezaValue: string | number | null = row[1]?.trim() || null;
          if (cabezaValue !== null && !isNaN(Number(cabezaValue))) {
            cabezaValue = Number(cabezaValue);
          }
          
          // Store semirremolque value
          let semirremolqueValue: string | number | null = row[2]?.trim() || null;
          if (semirremolqueValue !== null && !isNaN(Number(semirremolqueValue))) {
            semirremolqueValue = Number(semirremolqueValue);
          }
          
          // Store the original value (from cabeza tractora) for backward compatibility
          //result[normalizedKey] = cabezaValue;
          
          // Also store specific keys for cabeza and semirremolque
          result[`${normalizedKey} (Cabeza tractora)`] = cabezaValue;
          result[`${normalizedKey} (Semirremolque)`] = semirremolqueValue;
          
          console.log(`CSV Key: "${normalizedKey}" => Cabeza: "${cabezaValue}", Semirremolque: "${semirremolqueValue}"`);
        } 
        // For rows after the header that only need a single value
        else if (foundColumnHeaderRow && !isSplitField) {
          // Handle rows with just a key and one value
          let value: string | number | null = row[1]?.trim() || null;
          if (value !== null && !isNaN(Number(value))) {
            value = Number(value);
          }
          result[normalizedKey] = value;
          console.log(`CSV Key (single value): "${normalizedKey}" = ${value}`);
        }
        // For any other rows
        else {
          // Handle rows with just a key and one value
          let value: string | number | null = row[1]?.trim() || null;
          if (value !== null && !isNaN(Number(value))) {
            value = Number(value);
          }
          result[normalizedKey] = value;
        }
      }
    }

    return result;
  } catch (error) {
    console.error(`Error parsing CSV file ${fileName}:`, error);
    return {};
  }
}

// Helper function to normalize strings (simplified now that accents are removed from source files)
function normalizeString(str: string): string {
  // Just trim the string since accents have been removed from source files
  return str.trim();
}

export function getVehicleFilename(vehicleName: string): string | null {
  // Map from vehicle name to file name
  const vehicleFileMap: Record<string, string> = {
    "Vehículo Articulado de Carga General": "Carga general vehiculos art.csv",
    "Vehículo de Carga General de 3 Ejes": "Carga general 3 ejes.csv",
    "Vehículo de Carga General de 2 Ejes": "Carga general 2 ejes.csv",
    "Vehículo Frigorífico Articulado": "Vehículo Frigorífico Articulado.csv",
    "Vehículo Frigorífico de 3 Ejes": "Vehículo Frigorífico de 3 ejes.csv",
    "Vehículo Frigorífico de 2 Ejes": "Vehículo Frigorífico de 2 ejes.csv",
    "Portavehículos de 2 Ejes": "Portavehiculos 2 ejes.csv",
    "Vehículo Cisterna MMPP Articulado": "Vehículo Cisterna Articulados.csv",
    "Vehículo Cisterna de 3 Ejes": "Vehículo Cisterna  3 ejes.csv",
    "Vehículo Cisterna de 2 Ejes": "Vehículo Cisterna de 2 ejes.csv",
    "Hormigonera de 4 Ejes": "Hormigonera 4 ejes.csv",
    "Hormigonera de 3 Ejes": "Hormigonera 3 ejes.csv",
    "Volquete Articulado de Obra": "Volquete de obra Articulado.csv",
    "Volquete de Obra de 3 Ejes": "Volquete de obra 3 Ejes.csv",
    "Volquete de Obra de 2 Ejes": "Volquete de obra 2 Ejes.csv",
    "Contenedor de Obra de 3 Ejes": "Contenedor de obra 3 Ejes.csv",
    "Contenedor de Obra de 2 Ejes": "Contenedor de obra 2 Ejes.csv",
    "Vehículo de Distribución y Reparto de 3 Ejes": "Distribución y Reparto 3 Ejes.csv",
    "Vehículo de Distribución y Reparto de 2 Ejes": "Distribución y Reparto 2 Ejes.csv",
    "Furgoneta": "Furgonetas.csv",
    "Grúa Autocarga de 3 Ejes": "Grua Autocarga 3 Ejes.csv",
    "Grúa Autocarga de 2 Ejes": "Grua Autocarga 2 Ejes.csv",
    "Vehículo de Mudanzas de 2 Ejes": "Mudanzas 2 Ejes.csv",
    "Vehículo Articulado de Distribución y Reparto":"Distribución y Reparto Veh Arti.csv"
  };

  return vehicleFileMap[vehicleName] || null;
}