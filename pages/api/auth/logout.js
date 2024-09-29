// pages/api/auth/logout.js
import { serialize } from 'cookie';

export default function handler(req, res) {
  if (req.method === 'POST') {
    // Set the session cookie with maxAge of -1 to expire it immediately
    const cookie = serialize('session', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: -1, // Expire the cookie immediately
      path: '/',
    });

    res.setHeader('Set-Cookie', cookie);
    res.status(200).json({ message: 'Logged out successfully' });
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}
