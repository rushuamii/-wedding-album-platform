import connectDB from '@/lib/db/mongodb';
import User from '@/lib/db/models/user';
import { verifyToken } from '@/lib/auth/jwt';
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

    const formData = await request.formData();
    const name = formData.get('name') as string;
    const bio = formData.get('bio') as string;
    const location = formData.get('location') as string;
    const instagram = formData.get('instagram') as string;
    const facebook = formData.get('facebook') as string;
    const website = formData.get('website') as string;
    const avatar = formData.get('avatar') as File;

    await connectDB();

    const updateData: any = {
      name,
      bio,
      location,
      socialLinks: {
        instagram,
        facebook,
        website,
      }
    };

    // Handle avatar upload
    if (avatar) {
      const bytes = await avatar.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const base64 = buffer.toString('base64');
      updateData.avatar = `data:${avatar.type};base64,${base64}`;
    }

    const user = await User.findByIdAndUpdate(
      payload.userId,
      updateData,
      { new: true }
    ).select('-password').lean();

    return Response.json({
      success: true,
      user
    });
  } catch (error) {
    console.error('Error:', error);
    return Response.json({ error: 'Server error' }, { status: 500 });
  }
}
