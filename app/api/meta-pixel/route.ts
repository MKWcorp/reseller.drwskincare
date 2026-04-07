import { NextRequest, NextResponse } from 'next/server';

const PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID || '1077062414508009';
const ACCESS_TOKEN = process.env.META_CAPI_ACCESS_TOKEN || 'EAAVtLxF7MxQBRFJEqZBsedMizYo63OCLqtk7TLIayATAZAtXj8PGApEclgq2uko3xx5p0LzF12hyBp0fmxCVNTB1SKrRwre4kBJEf5bLCrsZB5JhSHNAZBXL57uz9gwac7oN9lbT5eMZAKr6JO4st3H3HnbOUBfydQvLuav359akKUlfn9xmbf81eg6b01edCeAZDZD';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { event_name, event_data } = body;

    if (!event_name) {
      return NextResponse.json(
        { error: 'event_name is required' },
        { status: 400 }
      );
    }

    // Get user data from request
    const userAgent = request.headers.get('user-agent') || '';
    const clientIp = request.headers.get('x-forwarded-for')?.split(',')[0] || 
                     request.headers.get('x-real-ip') || 
                     'unknown';

    // Prepare event data for Conversions API
    const eventData = {
      data: [
        {
          event_name: event_name,
          event_time: Math.floor(Date.now() / 1000),
          action_source: 'website',
          event_source_url: event_data?.event_source_url || request.headers.get('referer') || '',
          user_data: {
            client_ip_address: clientIp,
            client_user_agent: userAgent,
            ...(event_data?.user_data || {}),
          },
          custom_data: event_data?.custom_data || {},
        },
      ],
    };

    // Send to Meta Conversions API
    const response = await fetch(
      `https://graph.facebook.com/v18.0/${PIXEL_ID}/events?access_token=${ACCESS_TOKEN}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(eventData),
      }
    );

    const result = await response.json();

    if (!response.ok) {
      console.error('Meta CAPI Error:', result);
      return NextResponse.json(
        { error: 'Failed to send event to Meta', details: result },
        { status: response.status }
      );
    }

    return NextResponse.json({ success: true, result });
  } catch (error) {
    console.error('Error in Meta Pixel API:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: String(error) },
      { status: 500 }
    );
  }
}
