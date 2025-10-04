import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { parseVehicleCsvFile } from '@/utils/csvParser';

// Get all vehicle types and their data
export async function GET() {
  try {
    // Get all CSV files in the data directory
    const dataDir = path.join(process.cwd(), 'src', 'app', 'api', 'mercancias', 'data');
    
    const files = fs.readdirSync(dataDir).filter(file => file.endsWith('.csv'));
    
    if (!files.length) {
      return NextResponse.json(
        { error: 'No vehicle data files found' },
        { status: 404 }
      );
    }
    
    const allVehicleData: Record<string, any> = {};
    
    // Parse each file and add to the result
    for (const file of files) {
      try {
        const vehicleData = parseVehicleCsvFile(file);
        // Use the filename without extension as the vehicle type key
        const vehicleType = path.basename(file, '.csv');
        allVehicleData[vehicleType] = vehicleData;
      } catch (err) {
        console.error(`Error parsing file ${file}:`, err);
        // Continue with other files even if one fails
      }
    }
    
    return NextResponse.json({
      success: true,
      data: allVehicleData
    });
  } catch (error) {
    console.error('Error fetching all vehicle data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch vehicle data', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
