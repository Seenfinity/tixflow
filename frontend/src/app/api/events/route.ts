import { NextRequest, NextResponse } from 'next/server';

const KYD_LPR_URL = 'https://kydlabs.com/p/lpr/bio';

export async function GET() {
  try {
    const response = await fetch(KYD_LPR_URL, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; TixFlow/1.0)'
      }
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch events');
    }
    
    const html = await response.text();
    
    // Parse events - more robust regex
    const events: any[] = [];
    
    // Match: [EventName\nDate\nVenue\nGet Tickets](link)
    // The format is: [EventName\nDate\nVenue\nGet Tickets](URL)
    const lines = html.split('\n');
    
    let currentEvent: any = null;
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      
      // Check if this line is a link to an event
      if (line.includes('lpr.kydlabs.com/e/')) {
        const match = line.match(/\[([^\]]+)\]\(([^)]+)\)/);
        if (match) {
          const text = match[1];
          const url = match[2];
          
          // Parse event info from text (format: Name\nDate\nVenue)
          const parts = text.split('\n').map(p => p.trim()).filter(p => p);
          
          if (parts.length >= 2) {
            const name = parts[0];
            const date = parts[1] || '';
            const venue = parts[2] || 'Le Poisson Rouge, New York';
            
            // Skip sold out
            if (!name.toLowerCase().includes('sold out') && !name.toLowerCase().includes('soldout')) {
              events.push({
                id: url.split('/').pop(),
                name,
                date,
                venue,
                price: "Check site",
                image: "https://images.unsplash.com/photo-1415201364774-f6f0bb35f28f?w=400&q=80",
                category: "Live Music",
                url
              });
            }
          }
        }
      }
    }
    
    // If no events found, return fallback
    if (events.length === 0) {
      return NextResponse.json(getFallbackEvents());
    }
    
    return NextResponse.json({ events });
    
  } catch (error) {
    console.error('Error fetching events:', error);
    return NextResponse.json(getFallbackEvents());
  }
}

function getFallbackEvents() {
  return {
    events: [
      { id: "1", name: "Gary Bartz", date: "Thu Feb 26 7:00PM", venue: "Le Poisson Rouge, New York", price: "Check site", image: "https://images.unsplash.com/photo-1415201364774-f6f0bb35f28f?w=400&q=80", category: "Jazz" },
      { id: "2", name: "Stephen Kellogg (Low Tickets)", date: "Fri Feb 27 6:00PM", venue: "Le Poisson Rouge, New York", price: "Check site", image: "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=400&q=80", category: "Folk" },
      { id: "3", name: "Emo Night Brooklyn", date: "Fri Feb 27 11:00PM", venue: "Le Poisson Rouge, New York", price: "Check site", image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&q=80", category: "Rock" },
      { id: "4", name: "Y2K Party", date: "Sat Feb 28 11:00PM", venue: "Le Poisson Rouge, New York", price: "Check site", image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&q=80", category: "Dance" },
      { id: "5", name: "Herbert Holler's Annual Ladies Night", date: "Fri Mar 6 6:00PM", venue: "Le Poisson Rouge, New York", price: "Check site", image: "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?w=400&q=80", category: "Music" },
    ]
  };
}
