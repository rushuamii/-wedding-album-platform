import connectDB from '@/lib/db/mongodb';
import Album from '@/lib/db/models/album';
import Photo from '@/lib/db/models/photo';
import { verifyToken } from '@/lib/auth/jwt';
import { NextRequest } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> | { id: string } }
) {
  try {
    let albumId: string;
    if (params instanceof Promise) {
      const resolvedParams = await params;
      albumId = resolvedParams.id;
    } else {
      albumId = (params as { id: string }).id;
    }

    console.log('Fetching album ID:', albumId);

    const token = request.headers.get('authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const payload = verifyToken(token);
    if (!payload) {
      return Response.json({ error: 'Invalid token' }, { status: 401 });
    }

    await connectDB();

    const album = await Album.findById(albumId).lean();

    if (!album) {
      return Response.json(
        { error: 'Album not found', id: albumId },
        { status: 404 }
      );
    }

    return Response.json({
      success: true,
      album: {
        _id: album._id,
        title: album.title,
        description: album.description,
        coverImage: album.coverImage || '',
        createdAt: album.createdAt
      }
    });
  } catch (error) {
    console.error('GET /api/albums/[id] Error:', error);
    return Response.json(
      { error: 'Server error', message: String(error) },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> | { id: string } }
) {
  try {
    let albumId: string;
    if (params instanceof Promise) {
      const resolvedParams = await params;
      albumId = resolvedParams.id;
    } else {
      albumId = (params as { id: string }).id;
    }

    console.log('Deleting album ID:', albumId);

    const token = request.headers.get('authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return Response.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const payload = verifyToken(token);
    if (!payload) {
      return Response.json(
        { success: false, error: 'Invalid token' },
        { status: 401 }
      );
    }

    await connectDB();

    // Find album
    const album = await Album.findById(albumId);
    if (!album) {
      return Response.json(
        { success: false, error: 'Album not found' },
        { status: 404 }
      );
    }

    console.log('Album found, deleting photos...');
    
    // Delete all photos in this album
    await Photo.deleteMany({ albumId: albumId });

    console.log('Photos deleted, deleting album...');
    
    // Delete album
    await Album.findByIdAndDelete(albumId);

    console.log('Album deleted successfully');

    return Response.json({
      success: true,
      message: 'Album deleted successfully'
    });
  } catch (error) {
    console.error('DELETE /api/albums/[id] Error:', error);
    return Response.json(
      { success: false, error: 'Server error', message: String(error) },
      { status: 500 }
    );
  }
}
