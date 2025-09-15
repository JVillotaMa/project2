import { NextRequest, NextResponse } from 'next/server';
import { parseTransportCsvFile } from '@/utils/transportCsvParser';
import fs from 'fs';
import path from 'path';

export async function GET(request: NextRequest) {
  try {
    console.log('Transport API Route: Retrieving data');
    
    // Check if the CSV file exists
    const filePath = path.join(process.cwd(), 'src', 'app', 'api', 'transportes', 'data', 'dataCovimad.csv');
    if (!fs.existsSync(filePath)) {
      console.error(`CSV file not found at: ${filePath}`);
      return NextResponse.json(
        { error: 'CSV file not found' },
        { status: 404 }
      );
    }
    
    // Parse the CSV file and return all data
    const data = parseTransportCsvFile();
    
    console.log('Transport API Route: Data retrieved successfully');
    
    return NextResponse.json({
      success: true,
      data: data
    });
  } catch (error) {
    console.error('Error in Transport API Route:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve transport data', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
