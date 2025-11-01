import connectDB from '@/lib/db/mongodb';
import Album from '@/lib/db/models/album';
import Photo from '@/lib/db/models/photo';
import User from '@/lib/db/models/user';
import { NextRequest } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ token: string }> }
) {
  try {
    const { token } = await params;

    await connectDB();

    // Find album by public token
    const album = await Album.findOne({ publicToken: token }).lean();

    if (!album || !album.isPublic) {
      return Response.json(
        { error: 'Album not found' },
        { status: 404 }
      );
    }

    // Get user info
    const user = await User.findById(album.userId).select('name avatar bio').lean();

    // Get all photos
    const photos = await Photo.find({ albumId: album._id })
      .select('_id imageUrl caption folder createdAt')
      .sort({ createdAt: -1 })
      .lean();

    return Response.json({
      success: true,
      album: {
        _id: album._id,
        title: album.title,
        description: album.description,
        coupleNames: album.coupleNames,
        weddingDate: album.weddingDate,
        location: album.location,
        user: {
          name: user?.name,
          avatar: user?.avatar,
          bio: user?.bio,
        },
        photos: photos,
      }
    });
  } catch (error) {
    console.error('Gallery Album Error:', error);
    return Response.json(
      { error: 'Server error' },
      { status: 500 }
    );
  }
}
