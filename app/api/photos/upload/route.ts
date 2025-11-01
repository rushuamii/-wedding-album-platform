import connectDB from '@/lib/db/mongodb';
import Photo from '@/lib/db/models/photo';
import Album from '@/lib/db/models/album';
import { verifyToken } from '@/lib/auth/jwt';
import { NextRequest } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const albumId = formData.get('albumId') as string;
    const caption = formData.get('caption') as string;
    const folder = formData.get('folder') as string || 'other';
    const location = formData.get('location') as string || '';

    const token = request.headers.get('authorization')?.replace('Bearer ', '');

    if (!token) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const payload = verifyToken(token);
    if (!payload) {
      return Response.json({ error: 'Invalid token' }, { status: 401 });
    }

    if (!file || !albumId) {
      return Response.json(
        { error: 'Missing file or albumId' },
        { status: 400 }
      );
    }

    await connectDB();

    // Verify album exists
    const album = await Album.findById(albumId);
    if (!album) {
      return Response.json(
        { error: 'Album not found' },
        { status: 404 }
      );
    }

    // For now, store as base64 in MongoDB (works for MVP)
    // Later you can upgrade to Cloudinary for large-scale
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const base64 = buffer.toString('base64');
    const imageUrl = `data:${file.type};base64,${base64}`;

    // Create photo record
    const photo = new Photo({
      albumId: albumId,
      userId: payload.userId,
      fileName: file.name,
      fileSize: file.size,
      mediaType: 'image',
      imageUrl: imageUrl,
      thumbnailUrl: imageUrl,
      caption: caption || '',
      folder: folder,
      location: location,
      uploadedDate: new Date(),
    });

    await photo.save();

    // Update album photos count
    await Album.findByIdAndUpdate(albumId, {
      $inc: { photosCount: 1 }
    });

    console.log('✅ Photo saved to MongoDB:', photo._id);

    return Response.json(
      {
        success: true,
        photo: {
          _id: photo._id,
          imageUrl: photo.imageUrl,
          caption: photo.caption,
          folder: photo.folder,
        }
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('❌ Upload error:', error);
    return Response.json(
      { error: 'Upload failed', message: String(error) },
      { status: 500 }
    );
  }
}
