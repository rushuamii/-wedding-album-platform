import connectDB from '@/lib/db/mongodb';
import Album from '@/lib/db/models/album';
import { verifyToken } from '@/lib/auth/jwt';
import { NextRequest } from 'next/server';

// GET all albums for user
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

    // Fetch all albums for this user
    const albums = await Album.find({ userId: payload.userId })
      .select('_id title description coverImage coupleNames weddingDate location isPublic photosCount createdAt')
      .sort({ createdAt: -1 })
      .lean();

    console.log('Fetched albums:', albums.length);

    return Response.json({
      success: true,
      albums: albums || []
    });
  } catch (error) {
    console.error('GET /api/albums Error:', error);
    return Response.json(
      { error: 'Server error', message: String(error) },
      { status: 500 }
    );
  }
}

// POST create new album
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
    const { title, description } = body;

    if (!title) {
      return Response.json(
        { error: 'Title is required' },
        { status: 400 }
      );
    }

    await connectDB();

    const album = new Album({
      userId: payload.userId,
      title,
      description: description || '',
      photosCount: 0,
    });

    await album.save();

    console.log('Album created:', album._id);

    return Response.json({
      success: true,
      album: {
        _id: album._id,
        title: album.title,
        description: album.description,
        coverImage: album.coverImage,
        photosCount: 0,
        createdAt: album.createdAt,
      }
    }, { status: 201 });
  } catch (error) {
    console.error('POST /api/albums Error:', error);
    return Response.json(
      { error: 'Server error', message: String(error) },
      { status: 500 }
    );
  }
}
