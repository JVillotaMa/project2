import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function POST(request: NextRequest) {
  try {
    // Get the updated data and access code from the request
    const { data, accessCode } = await request.json();
    
    // Verify access code again as a security measure
    const validAccessCode = process.env.OBSERVATORIO_ACCESS_CODE;
    
    if (!validAccessCode || accessCode !== validAccessCode) {
      return NextResponse.json(
        { error: 'Acceso no autorizado' },
        { status: 401 }
      );
    }
    
    // Verify that data is valid
    if (!data || typeof data !== 'object') {
      return NextResponse.json(
        { error: 'Datos no válidos' },
        { status: 400 }
      );
    }
    
    // Get the file path
    const filePath = path.join(process.cwd(), 'src', 'app', 'api', 'transportes', 'data', 'dataCovimad.csv');
    
    // Convert data to CSV format
    const csvData = convertDataToCsv(data);
    
    // Write to file
    fs.writeFileSync(filePath, csvData, 'utf8');
    
    return NextResponse.json({
      success: true,
      message: 'Datos actualizados correctamente'
    });
  } catch (error) {
    console.error('Error updating transport data:', error);
    return NextResponse.json(
      { error: 'Error al actualizar los datos', details: error instanceof Error ? error.message : 'Error desconocido' },
      { status: 500 }
    );
  }
}

// Function to convert the data object back to CSV
function convertDataToCsv(data: any) {
  if (!data || Object.keys(data).length === 0) {
    throw new Error('No data to convert');
  }
  
  // Get field names and bus types
  const fieldNames = Object.keys(data);
  const firstField = fieldNames[0];
  const busTypes = Object.keys(data[firstField]);
  
  // Create header row
  const header = [',' + busTypes.join(',')];
  
  // Create rows for each field
  const rows = fieldNames.map(fieldName => {
    const rowValues = busTypes.map(busType => {
      const value = data[fieldName][busType];
      // Handle null, undefined, or special characters
      return value !== null && value !== undefined ? String(value).replace(/,/g, '') : '';
    });
    return `${fieldName},${rowValues.join(',')}`;
  });
  
  // Combine header and rows
  return header.concat(rows).join('\n');
}
