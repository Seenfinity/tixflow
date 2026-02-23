import { NextRequest, NextResponse } from 'next/server';

const GOOGLE_MAPS_API_KEY = 'AIzaSyAEeTpIRdSlLWaueoqUZ7t-5n1l6dtEZJ0';

export async function POST(request: NextRequest) {
  try {
    const { origin, destination, mode = 'DRIVE' } = await request.json();
    
    if (!origin || !destination) {
      return NextResponse.json({ error: 'Origin and destination required' }, { status: 400 });
    }

    const url = `https://routes.googleapis.com/directions/v2:computeRoutes`;
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Goog-Api-Key': GOOGLE_MAPS_API_KEY,
        'X-Goog-FieldMask': 'routes.duration,routes.distanceMeters,routes.legs'
      },
      body: JSON.stringify({
        origin: { address: origin },
        destination: { address: destination },
        travelMode: mode
      })
    });
    
    const data = await response.json();
    
    if (data.error) {
      return NextResponse.json({ error: data.error.message || 'API error' }, { status: 400 });
    }
    
    if (data.routes && data.routes.length > 0) {
      const route = data.routes[0];
      
      // Estimate price (rough calculation)
      const distanceKm = route.distanceMeters / 1000;
      const pricePerKm = mode === 'DRIVE' ? 1.5 : 0.5;
      const estimatedPrice = (distanceKm * pricePerKm).toFixed(2);
      
      // Duration in minutes
      const durationSeconds = parseInt(route.duration.replace('s', ''));
      const durationMinutes = Math.round(durationSeconds / 60);
      
      return NextResponse.json({
        success: true,
        route: {
          distance: `${(distanceKm).toFixed(1)} km`,
          duration: `${durationMinutes} min`,
          price: `$${estimatedPrice}`,
          origin: origin,
          destination: destination
        }
      });
    } else {
      return NextResponse.json({ error: 'No route found' }, { status: 400 });
    }

  } catch (error) {
    console.error('Directions API error:', error);
    return NextResponse.json({ error: 'Failed to get directions' }, { status: 500 });
  }
}
