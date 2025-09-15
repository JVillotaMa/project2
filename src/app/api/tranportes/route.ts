import { NextRequest, NextResponse } from 'next/server';
import { parseVehicleCsvFile, getVehicleFilename } from '@/utils/csvParser';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const vehicleName = searchParams.get('vehicleName');

    console.log('API Route: Vehicle name requested:', vehicleName);

    if (!vehicleName) {
      console.error('API Route: Vehicle name is required');
      return NextResponse.json(
        { error: 'Vehicle name is required' },
        { status: 400 }
      );
    }

    const fileName = getVehicleFilename(vehicleName);
    
    if (!fileName) {
      console.error('API Route: Vehicle not found for name:', vehicleName);
      return NextResponse.json(
        { error: 'Vehicle not found' },
        { status: 404 }
      );
    }

    console.log('API Route: Loading data from file:', fileName);
    const vehicleData = parseVehicleCsvFile(fileName);
    
    // Log the data to console as requested
    console.log('Vehicle Data from CSV:', vehicleData);
    
    return NextResponse.json({ data: vehicleData });
  } catch (error) {
    console.error('API Route: Error fetching vehicle data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch vehicle data' },
      { status: 500 }
    );
  }
}