import connectDB from '@/lib/db/mongodb';
import Photo from '@/lib/db/models/photo';
import { verifyToken } from '@/lib/auth/jwt';
import { NextRequest } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> | { id: string } }
) {
  try {
    // Handle both Promise and direct params
    let albumId: string;
    if (params instanceof Promise) {
      const resolvedParams = await params;
      albumId = resolvedParams.id;
    } else {
      albumId = (params as { id: string }).id;
    }

    console.log('📸 Fetching photos for album:', albumId);

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

    // Try to find photos by albumId
    const photos = await Photo.find({ albumId: albumId })
      .select('imageUrl thumbnailUrl caption likes createdAt')
      .sort({ createdAt: -1 })
      .lean();

    console.log(`✅ Found ${photos.length} photos for album ${albumId}`);

    return Response.json({
      success: true,
      photos: photos || [],
      debug: { albumId, photoCount: photos.length }
    });
  } catch (error) {
    console.error('❌ Error fetching photos:', error);
    return Response.json(
      { error: 'Server error', message: String(error) },
      { status: 500 }
    );
  }
}
