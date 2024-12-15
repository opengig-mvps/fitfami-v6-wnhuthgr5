import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(
  request: Request,
  { params }: { params: { userId: string } }
) {
  try {
    const userId = parseInt(params.userId, 10);
    if (isNaN(userId)) {
      return NextResponse.json({ success: false, message: 'Invalid user ID' }, { status: 400 });
    }

    const body = await request.json();
    const { unfollowUserId } = body;

    const unfollowUserIdInt = parseInt(unfollowUserId, 10);
    if (isNaN(unfollowUserIdInt)) {
      return NextResponse.json({ success: false, message: 'Invalid unfollow user ID' }, { status: 400 });
    }

    const followRecord = await prisma.follow.findFirst({
      where: {
        followerId: userId,
        followingId: unfollowUserIdInt,
      },
    });

    if (!followRecord) {
      return NextResponse.json({ success: false, message: 'Follow relationship not found' }, { status: 404 });
    }

    await prisma.follow.delete({
      where: {
        id: followRecord.id,
      },
    });

    await prisma.user.update({
      where: { id: userId },
      data: { followingCount: { decrement: 1 } },
    });

    await prisma.user.update({
      where: { id: unfollowUserIdInt },
      data: { followerCount: { decrement: 1 } },
    });

    return NextResponse.json({
      success: true,
      message: 'Unfollowed successfully',
      data: {},
    }, { status: 200 });

  } catch (error: any) {
    console.error('Error unfollowing user:', error);
    return NextResponse.json({ success: false, message: 'Internal server error', data: error }, { status: 500 });
  }
}