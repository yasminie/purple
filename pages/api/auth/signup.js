// pages/api/auth/signup.js
import dbConnect from '../../../lib/mongodb';
import User from '../../../models/User';
import bcrypt from 'bcryptjs';
import { serialize } from 'cookie';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    await dbConnect();
    const { firstName, lastName, email, password } = req.body;

    try {
      // Check if the user already exists
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ message: 'User already exists' });
      }

      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Create a new user
      const newUser = new User({
        firstName,
        lastName,
        email,
        password: hashedPassword,
      });

      await newUser.save();

      // Create a session cookie
      const cookie = serialize('session', String(newUser._id), {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24, // 1 day
        path: '/',
      });

      res.setHeader('Set-Cookie', cookie);
      res.status(201).json({ message: 'Signed up and logged in successfully' });
    } catch (error) {
      console.error('Signup Error:', error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}
