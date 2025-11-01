import connectDB from '@/lib/db/mongodb';
import User from '@/lib/db/models/user';
import { verifyToken } from '@/lib/auth/jwt';
import bcrypt from 'bcryptjs';
import { NextRequest } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const token = request.headers.get('authorization')?.replace('Bearer ', '');

    if (!token) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const payload = verifyToken(token);
    if (!payload) {
      return Response.json({ error: 'Invalid token' }, { status: 401 });
    }

    const body = await request.json();
    const { currentPassword, newPassword } = body;

    if (!currentPassword || !newPassword) {
      return Response.json(
        { error: 'Current and new password are required' },
        { status: 400 }
      );
    }

    await connectDB();

    const user = await User.findById(payload.userId);
    if (!user) {
      return Response.json({ error: 'User not found' }, { status: 404 });
    }

    // Verify current password
    const isValidPassword = await bcrypt.compare(currentPassword, user.password);
    if (!isValidPassword) {
      return Response.json(
        { error: 'Current password is incorrect' },
        { status: 401 }
      );
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update password
    await User.findByIdAndUpdate(payload.userId, {
      password: hashedPassword
    });

    return Response.json({
      success: true,
      message: 'Password changed successfully'
    });
  } catch (error) {
    console.error('Error:', error);
    return Response.json({ error: 'Server error' }, { status: 500 });
  }
}
