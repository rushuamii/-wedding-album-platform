import connectDB from '@/lib/db/mongodb';
import Photo from '@/lib/db/models/photo';
import { verifyToken } from '@/lib/auth/jwt';
import { NextRequest } from 'next/server';

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> | { id: string } }
) {
  try {
    let photoId: string;
    if (params instanceof Promise) {
      const resolvedParams = await params;
      photoId = resolvedParams.id;
    } else {
      photoId = (params as { id: string }).id;
    }

    console.log('Deleting photo ID:', photoId);

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

    // Find and delete photo
    const photo = await Photo.findByIdAndDelete(photoId);
    
    if (!photo) {
      return Response.json(
        { success: false, error: 'Photo not found' },
        { status: 404 }
      );
    }

    console.log('Photo deleted successfully');

    return Response.json({
      success: true,
      message: 'Photo deleted successfully'
    });
  } catch (error) {
    console.error('DELETE /api/photos/[id] Error:', error);
    return Response.json(
      { success: false, error: 'Server error', message: String(error) },
      { status: 500 }
    );
  }
}
