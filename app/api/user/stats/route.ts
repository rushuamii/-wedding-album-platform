import connectDB from '@/lib/db/mongodb';
import Album from '@/lib/db/models/album';
import Photo from '@/lib/db/models/photo';
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

    // Get all albums for user
    const albums = await Album.find({ userId: payload.userId }).lean();
    const albumIds = albums.map(a => a._id);

    // Get all photos for user's albums
    const photos = await Photo.find({ albumId: { $in: albumIds } }).lean();

    // Calculate storage used (rough estimate: 150KB per photo average)
    const estimatedStoragePerPhoto = 150; // KB
    const totalStorageKB = photos.length * estimatedStoragePerPhoto;
    const totalStorageMB = (totalStorageKB / 1024).toFixed(2);

    // Get total photos count
    const totalPhotos = photos.length;

    // Get shared albums count (public albums)
    const sharedAlbums = albums.filter(a => a.isPublic).length;

    return Response.json({
      success: true,
      stats: {
        albumsCount: albums.length,
        photosCount: totalPhotos,
        storageUsedMB: totalStorageMB,
        sharedAlbumsCount: sharedAlbums,
      }
    });
  } catch (error) {
    console.error('Stats API Error:', error);
    return Response.json(
      { error: 'Server error', message: String(error) },
      { status: 500 }
    );
  }
}
