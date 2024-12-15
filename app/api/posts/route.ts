import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { v4 as uuidv4 } from 'uuid';
import { IncomingForm, Fields, Files } from 'formidable';
import fs from 'fs';
import path from 'path';

const prisma = new PrismaClient();

export const config = {
  api: {
    bodyParser: false,
  },
};

export async function POST(request: Request) {
  try {
    const form = new IncomingForm();
    const data: any = await new Promise((resolve, reject) => {
      form.parse(request, (err: any, fields: Fields, files: Files) => {
        if (err) reject(err);
        resolve({ fields, files });
      });
    });

    const { description, userId, tags } = data?.fields;
    const { image } = data?.files;

    if (!description || !userId || !image) {
      return NextResponse.json({ success: false, message: 'Missing required fields' }, { status: 400 });
    }

    const user = await prisma.user.findFirst({
      where: { id: parseInt(userId, 10) },
    });

    if (!user) {
      return NextResponse.json({ success: false, message: 'User not found' }, { status: 404 });
    }

    const imagePath = path.join(process.cwd(), 'public/uploads', `${uuidv4()}-${image?.originalFilename}`);
    fs.copyFileSync(image?.filepath, imagePath);

    const post = await prisma.post.create({
      data: {
        description: String(description),
        imageUrl: `/uploads/${path.basename(imagePath)}`,
        tags: tags ? String(tags).split(',') : [],
        userId: user.id,
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Post created successfully',
      data: post,
    }, { status: 201 });

  } catch (error: any) {
    console.error('Error creating post:', error);
    return NextResponse.json({ success: false, message: 'Internal server error', data: error }, { status: 500 });
  }
}