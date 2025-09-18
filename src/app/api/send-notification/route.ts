import { NextRequest, NextResponse } from 'next/server'
import nodemailer from 'nodemailer'

export async function POST(request: NextRequest) {
  const { activity } = await request.json()
  
  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    })

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: `${process.env.FRIEND_EMAIL}, ${process.env.EMAIL_USER}`,
      subject: `New Activity Added: ${activity.title}`,
      html: `
        <h2>🌟 New Activity Added!</h2>
        <h3>${activity.title}</h3>
        ${activity.description ? `<p><strong>Description:</strong> ${activity.description}</p>` : ''}
        ${activity.address ? `<p><strong>Location:</strong> 📍 ${activity.address}</p>` : ''}
        ${activity.labels?.length ? `<p><strong>Labels:</strong> 🏷️ ${activity.labels.join(', ')}</p>` : ''}
        <p><strong>Rating:</strong> ⭐ ${activity.rating}/10</p>
        <p>Check out the full details in the Moments app!</p>
      `
    })
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Email error:', error)
    return NextResponse.json({ error: 'Failed to send email' }, { status: 500 })
  }
}