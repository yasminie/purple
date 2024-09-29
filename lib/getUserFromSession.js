// lib/getUserFromSession.js

import User from '../models/User';

export async function getUserFromSession(req) {
  // Extract session ID from cookies
  const sessionCookie = req.headers.cookie
    ?.split('; ')
    .find((row) => row.startsWith('session='));

  if (!sessionCookie) {
    return null;
  }

  const sessionId = sessionCookie.split('=')[1];
  const user = await User.findById(sessionId);

  if (!user) {
    return null;
  }

  return user;
}
