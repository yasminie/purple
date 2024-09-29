// pages/api/auth/validate-session.js
import dbConnect from '../../../lib/mongodb';
import User from '../../../models/User';

export default async function handler(req, res) {
  await dbConnect();

  // Extract session ID from cookies
  const sessionCookie = req.headers.cookie
    ?.split('; ')
    .find((row) => row.startsWith('session='));

  if (!sessionCookie) {
    return res.status(401).json({ message: 'Not authenticated' });
  }

  const sessionId = sessionCookie.split('=')[1];
  const user = await User.findById(sessionId);

  if (!user) {
    return res.status(401).json({ message: 'Invalid session' });
  }

  res.status(200).json({ message: 'Authenticated', firstName: user.firstName });
}
