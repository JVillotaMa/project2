import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    // Get the access code from environment variable
    const validAccessCode = process.env.OBSERVATORIO_ACCESS_CODE;
    
    if (!validAccessCode) {
      console.error('OBSERVATORIO_ACCESS_CODE not set in environment variables');
      return NextResponse.json(
        { message: 'Error de configuración del servidor' },
        { status: 500 }
      );
    }

    // Get the access code from the request
    const { accessCode } = await request.json();

    // Verify the access code
    // NOTE: This simple string comparison is vulnerable to timing attacks
    // In a production environment, consider using a more secure comparison method
    if (accessCode === validAccessCode) {
      return NextResponse.json({ authorized: true });
    } else {
      return NextResponse.json(
        { authorized: false, message: 'Código de acceso incorrecto' },
        { status: 401 }
      );
    }
  } catch (error) {
    console.error('Error verifying access code:', error);
    return NextResponse.json(
      { message: 'Error al procesar la solicitud' },
      { status: 500 }
    );
  }
}
