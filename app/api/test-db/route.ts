import connectDB from '@/lib/db/mongodb';

export async function GET() {
  try {
    await connectDB();
    return Response.json(
      { message: '✅ MongoDB connected successfully!' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Database connection error:', error);
    return Response.json(
      { message: '❌ Database connection failed', error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
