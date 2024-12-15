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
    const { followingId } = body;
    const followingUserId = parseInt(followingId, 10);
    if (isNaN(followingUserId)) {
      return NextResponse.json({ success: false, message: 'Invalid following user ID' }, { status: 400 });
    }

    const follower = await prisma.user.findFirst({
      where: { id: userId },
    });

    if (!follower) {
      return NextResponse.json({ success: false, message: 'Follower user not found' }, { status: 404 });
    }

    const following = await prisma.user.findFirst({
      where: { id: followingUserId },
    });

    if (!following) {
      return NextResponse.json({ success: false, message: 'Following user not found' }, { status: 404 });
    }

    const follow = await prisma.follow.create({
      data: {
        followerId: userId,
        followingId: followingUserId,
      },
    });

    await prisma.user.update({
      where: { id: userId },
      data: { followingCount: { increment: 1 } },
    });

    await prisma.user.update({
      where: { id: followingUserId },
      data: { followerCount: { increment: 1 } },
    });

    return NextResponse.json({
      success: true,
      message: 'Follow relationship created successfully',
      data: follow,
    }, { status: 201 });

  } catch (error: any) {
    console.error('Error creating follow relationship:', error);
    return NextResponse.json({ success: false, message: 'Internal server error', data: error }, { status: 500 });
  }
}