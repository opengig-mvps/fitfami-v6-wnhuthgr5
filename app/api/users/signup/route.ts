import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

type SignupRequestBody = {
  email: string
  password: string
  role?: string,
  fullName?: string
}

export async function POST(request: Request) {
  try {
    const body: SignupRequestBody = await request.json()
    const { email, password, role, fullName } = body

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required' }, { status: 400 })
    }

    // Check if user already exists
    const existingUser = await prisma.users.findUnique({ where: { email } })
    if (existingUser) {
      return NextResponse.json({ error: 'User with this email already exists' }, { status: 400 })
    }

    // Hash the password
    const saltRounds = 10
    const hashedPassword = await bcrypt.hash(password, saltRounds)

    // Create the new user
    const user = await prisma.users.create({
      data: {
        email,
        name: fullName || 'Albert',
        password: hashedPassword,
        role: role || 'user',
      },
    })

    // Generate a JWT token
    const token = jwt.sign(
        { id: user.id, email: user.email },
        process.env.JWT_SECRET || 'secret',
        { expiresIn: '1h' } // Token expires in 1 hour
      )

    return NextResponse.json({ token: token, user:  user}, { status: 201 })
  } catch (error) {
    console.error('Signup error:', error)
    return NextResponse.json({ error: 'An error occurred during signup' }, { status: 500 })
  }
}