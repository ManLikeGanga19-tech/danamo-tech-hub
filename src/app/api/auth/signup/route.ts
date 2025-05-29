import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const { email, password } = await req.json();

  if (!email || !password) {
    return NextResponse.json({ message: 'Email and password are required' }, { status: 400 });
  }

  // You can add logic here: check if user exists, hash password, save user, etc.
  console.log('Pretend to save user:', { email, password });

  return NextResponse.json({ message: 'User created successfully' }, { status: 201 });
}
