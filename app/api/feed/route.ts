import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request: Request) {
  try {
    const userId = 1; // Replace with actual user ID from authentication context

    const followedUsers = await prisma.follow.findMany({
      where: { followerId: userId },
      select: { followingId: true },
    });

    const followedUserIds = followedUsers.map(follow => follow.followingId);

    if (followedUserIds.length === 0) {
      return NextResponse.json({
        success: true,
        message: "No posts found",
        data: [],
      }, { status: 200 });
    }

    const posts = await prisma.post.findMany({
      where: {
        userId: { in: followedUserIds },
      },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            profilePicture: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    const feedData = posts.map(post => ({
      postId: post.id,
      description: post.description,
      imageUrl: post.imageUrl,
      tags: post.tags,
      createdAt: post.createdAt.toISOString(),
      user: {
        userId: post.user.id,
        username: post.user.username,
        profilePicture: post.user.profilePicture,
      },
    }));

    return NextResponse.json({
      success: true,
      message: "Feed fetched successfully",
      data: feedData,
    }, { status: 200 });

  } catch (error) {
    console.error('Error fetching feed:', error);
    return NextResponse.json({
      success: false,
      message: "Internal server error",
    }, { status: 500 });
  }
}