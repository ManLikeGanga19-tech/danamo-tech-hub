import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';  // Or 'bcrypt'

export async function POST(req: Request) {
  const { email, password } = await req.json();

  if (!email || !password) {
    return NextResponse.json({ message: 'Email and password are required' }, { status: 400 });
  }

  // Example: check if user exists (replace with real DB call)
  const userExists = false; // await db.users.findUnique({ where: { email } });
  if (userExists) {
    return NextResponse.json({ message: 'User already exists' }, { status: 409 });
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(password, 10);

  // Save user (replace with real DB call)
  // await db.users.create({ data: { email, password: hashedPassword } });
  console.log('Pretend to save user:', { email, hashedPassword });

  return NextResponse.json({ message: 'User created successfully' }, { status: 201 });
}
