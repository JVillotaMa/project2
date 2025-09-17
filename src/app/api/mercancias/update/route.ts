import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function POST(request: NextRequest) {
  try {
    // Get the updated data, vehicle type, and access code from the request
    const { data, vehicleType, accessCode } = await request.json();
    
    // Verify access code as a security measure
    const validAccessCode = process.env.OBSERVATORIO_ACCESS_CODE;
    
    if (!validAccessCode || accessCode !== validAccessCode) {
      return NextResponse.json(
        { error: 'Acceso no autorizado' },
        { status: 401 }
      );
    }
    
    // Verify that data is valid
    if (!data || typeof data !== 'object' || !vehicleType) {
      return NextResponse.json(
        { error: 'Datos no válidos o tipo de vehículo no especificado' },
        { status: 400 }
      );
    }
    
    // Get the file path
    const filePath = path.join(process.cwd(), 'src', 'app', 'api', 'mercancias', 'data', `${vehicleType}.csv`);
    
    // Check if file exists
    if (!fs.existsSync(filePath)) {
      return NextResponse.json(
        { error: 'El archivo de datos para este tipo de vehículo no existe' },
        { status: 404 }
      );
    }
    
    // Convert data to CSV format
    const csvData = convertDataToCsv(data);
    
    // Write to file
    fs.writeFileSync(filePath, csvData, 'utf8');
    
    return NextResponse.json({
      success: true,
      message: 'Datos actualizados correctamente'
    });
  } catch (error) {
    console.error('Error updating vehicle data:', error);
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
  
  // Create rows from the data
  const rows: string[] = [];
  
  // Process each key-value pair
  for (const [key, value] of Object.entries(data)) {
    // Handle null/undefined values
    const csvValue = value !== null && value !== undefined ? String(value).replace(/,/g, '') : '';
    rows.push(`${key},${csvValue}`);
  }
  
  // Join rows with newlines
  return rows.join('\n');
}
