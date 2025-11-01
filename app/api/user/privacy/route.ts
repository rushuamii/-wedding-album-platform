import connectDB from '@/lib/db/mongodb';
import User from '@/lib/db/models/user';
import { verifyToken } from '@/lib/auth/jwt';
import { NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const token = request.headers.get('authorization')?.replace('Bearer ', '');

    if (!token) {
      console.log('❌ No token provided');
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const payload = verifyToken(token);
    if (!payload) {
      console.log('❌ Invalid token');
      return Response.json({ error: 'Invalid token' }, { status: 401 });
    }

    await connectDB();

    const user = await User.findById(payload.userId).lean();
    
    if (!user) {
      console.log('❌ User not found');
      return Response.json({ error: 'User not found' }, { status: 404 });
    }

    const privacySettings = {
      showOnPublicGallery: user?.privacySettings?.showOnPublicGallery ?? false,
      albumsPrivateByDefault: user?.privacySettings?.albumsPrivateByDefault ?? true,
    };

    console.log('✅ GET Privacy:', privacySettings);

    return Response.json({
      success: true,
      privacySettings
    });
  } catch (error) {
    console.error('❌ GET Privacy Error:', error);
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
      console.log('❌ No token in PUT');
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const payload = verifyToken(token);
    if (!payload) {
      console.log('❌ Invalid token in PUT');
      return Response.json({ error: 'Invalid token' }, { status: 401 });
    }

    const body = await request.json();
    console.log('📝 Request body:', body);
    
    const { showOnPublicGallery, albumsPrivateByDefault } = body;

    if (typeof showOnPublicGallery !== 'boolean' || typeof albumsPrivateByDefault !== 'boolean') {
      console.log('❌ Invalid data types');
      return Response.json(
        { error: 'Invalid privacy settings data' },
        { status: 400 }
      );
    }

    await connectDB();

    console.log('🔄 Updating user:', payload.userId);

    const user = await User.findByIdAndUpdate(
      payload.userId,
      {
        privacySettings: {
          showOnPublicGallery,
          albumsPrivateByDefault,
        }
      },
      { new: true, runValidators: false }
    ).lean();

    if (!user) {
      console.log('❌ User not found in PUT');
      return Response.json({ error: 'User not found' }, { status: 404 });
    }

    const privacySettings = {
      showOnPublicGallery: user.privacySettings?.showOnPublicGallery ?? false,
      albumsPrivateByDefault: user.privacySettings?.albumsPrivateByDefault ?? true,
    };

    console.log('✅ PUT Privacy saved:', privacySettings);

    return Response.json({
      success: true,
      privacySettings
    });
  } catch (error) {
    console.error('❌ PUT Privacy Error:', error);
    return Response.json(
      { error: 'Server error', message: String(error) },
      { status: 500 }
    );
  }
}
