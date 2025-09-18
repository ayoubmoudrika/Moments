import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET() {
  const activities = await prisma.activity.findMany({
    orderBy: { createdAt: 'desc' }
  })
  
  return NextResponse.json(activities.map(activity => ({
    ...activity,
    labels: activity.labels ? JSON.parse(activity.labels) : []
  })))
}

export async function POST(request: NextRequest) {
  const body = await request.json()
  
  const activity = await prisma.activity.create({
    data: {
      title: body.title,
      description: body.description,
      address: body.address,
      labels: JSON.stringify(body.labels),
      picture: body.picture,
      rating: body.rating,
      date: body.date
    }
  })
  
  return NextResponse.json({
    ...activity,
    labels: activity.labels ? JSON.parse(activity.labels) : []
  })
}

export async function PUT(request: NextRequest) {
  const body = await request.json()
  
  const activity = await prisma.activity.update({
    where: { id: body.id },
    data: {
      title: body.title,
      description: body.description,
      address: body.address,
      labels: JSON.stringify(body.labels),
      picture: body.picture,
      rating: body.rating,
      date: body.date
    }
  })
  
  return NextResponse.json({
    ...activity,
    labels: activity.labels ? JSON.parse(activity.labels) : []
  })
}

export async function DELETE(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const id = searchParams.get('id')
  
  await prisma.activity.delete({
    where: { id: Number(id) }
  })
  
  return NextResponse.json({ success: true })
}