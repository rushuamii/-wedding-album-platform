import connectDB from '@/lib/db/mongodb';
import User from '@/lib/db/models/user';
import { verifyToken } from '@/lib/auth/jwt';
import { NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const token = request.headers.get('authorization')?.replace('Bearer ', '');

    if (!token) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const payload = verifyToken(token);
    if (!payload) {
      return Response.json({ error: 'Invalid token' }, { status: 401 });
    }

    await connectDB();

    const user = await User.findById(payload.userId).lean();

    const preferences = {
      theme: user?.preferences?.theme || 'light',
      notifications: user?.preferences?.notifications ?? true,
      publicProfile: user?.preferences?.publicProfile ?? false,
    };

    return Response.json({
      success: true,
      preferences
    });
  } catch (error) {
    console.error('GET Preferences Error:', error);
    return Response.json(
      { error: 'Server error', message: String(error) },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
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
    const { theme, notifications, publicProfile } = body;

    if (!theme || typeof notifications !== 'boolean' || typeof publicProfile !== 'boolean') {
      return Response.json(
        { error: 'Invalid preferences data' },
        { status: 400 }
      );
    }

    await connectDB();

    const user = await User.findByIdAndUpdate(
      payload.userId,
      {
        $set: {
          'preferences.theme': theme,
          'preferences.notifications': notifications,
          'preferences.publicProfile': publicProfile,
        }
      },
      { new: true, runValidators: true }
    ).lean();

    if (!user) {
      return Response.json({ error: 'User not found' }, { status: 404 });
    }

    const preferences = {
      theme: user.preferences?.theme || 'light',
      notifications: user.preferences?.notifications ?? true,
      publicProfile: user.preferences?.publicProfile ?? false,
    };

    console.log('✅ Preferences saved:', preferences);

    return Response.json({
      success: true,
      preferences
    });
  } catch (error) {
    console.error('❌ PUT Preferences Error:', error);
    return Response.json(
      { error: 'Server error', message: String(error) },
      { status: 500 }
    );
  }
}
