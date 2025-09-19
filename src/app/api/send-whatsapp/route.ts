import { NextRequest, NextResponse } from 'next/server'
import twilio from 'twilio'

export async function POST(request: NextRequest) {
  const body = await request.json()
  const { activity } = body
  
  // SMS message content
  const message = `🌟 New Activity: ${activity.title}
📅 ${activity.date}
⭐ ${activity.rating}/10
${activity.address ? `📍 ${activity.address}` : ''}

Moments App ✨`

  // Twilio configuration
  const accountSid = process.env.TWILIO_ACCOUNT_SID
  const authToken = process.env.TWILIO_AUTH_TOKEN
  const fromNumber = process.env.TWILIO_PHONE_NUMBER
  const recipients = ['+15149988996', '+14385062821'] // Both phone numbers
  
  if (!accountSid || !authToken || !fromNumber) {
    console.log('SMS credentials not configured, message:', message)
    return NextResponse.json({ 
      success: false,
      message: 'SMS credentials missing'
    })
  }

  try {
    // Initialize Twilio client
    const client = twilio(accountSid, authToken)
    
    // Send SMS to all recipients
    const promises = recipients.map(toNumber => 
      client.messages.create({
        body: message,
        from: fromNumber,
        to: toNumber
      })
    )
    
    const results = await Promise.all(promises)
    
    return NextResponse.json({ 
      success: true,
      message: `SMS sent to ${recipients.length} recipients`,
      messageIds: results.map(r => r.sid)
    })
  } catch (error) {
    console.error('SMS send error:', error)
    return NextResponse.json({ 
      success: false,
      message: 'SMS API error'
    })
  }
}