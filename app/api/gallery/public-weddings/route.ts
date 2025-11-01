import connectDB from '@/lib/db/mongodb';
import User from '@/lib/db/models/user';
import Album from '@/lib/db/models/album';
import Photo from '@/lib/db/models/photo';
import { NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    await connectDB();

    // Get all users who have enabled public gallery
    const usersWithPublicGallery = await User.find({
      'privacySettings.showOnPublicGallery': true
    }).select('_id name avatar bio location').lean();

    if (!usersWithPublicGallery || usersWithPublicGallery.length === 0) {
      return Response.json({
        success: true,
        weddings: []
      });
    }

    const userIds = usersWithPublicGallery.map(u => u._id);

    // Get all public albums for these users
    const publicAlbums = await Album.find({
      userId: { $in: userIds },
      isPublic: true
    })
      .select('_id userId title coupleNames weddingDate location coverImage photosCount')
      .lean();

    // Enrich albums with user and cover photo data
    const enrichedAlbums = await Promise.all(
      publicAlbums.map(async (album) => {
        const user = usersWithPublicGallery.find(u => u._id.toString() === album.userId.toString());

        // Get first photo as cover if no cover image
        let coverImage = album.coverImage;
        if (!coverImage) {
          const firstPhoto = await Photo.findOne({
            albumId: album._id,
          }).select('imageUrl').lean();
          coverImage = firstPhoto?.imageUrl || null;
        }

        return {
          _id: album._id,
          title: album.title,
          coupleNames: album.coupleNames || 'Wedding Album',
          weddingDate: album.weddingDate,
          location: album.location,
          coverImage,
          photosCount: album.photosCount || 0,
          user: {
            _id: user?._id,
            name: user?.name,
            avatar: user?.avatar,
            bio: user?.bio,
            location: user?.location,
          },
          publicToken: album.publicToken,
        };
      })
    );

    // Sort by wedding date (newest first)
    enrichedAlbums.sort((a, b) => {
      if (!a.weddingDate) return 1;
      if (!b.weddingDate) return -1;
      return new Date(b.weddingDate).getTime() - new Date(a.weddingDate).getTime();
    });

    return Response.json({
      success: true,
      weddings: enrichedAlbums
    });
  } catch (error) {
    console.error('Gallery API Error:', error);
    return Response.json(
      { error: 'Server error', message: String(error) },
      { status: 500 }
    );
  }
}
