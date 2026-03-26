import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth/next";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const session = await getServerSession();
    if (!session || !session.user || !(session.user as any).id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const userId = (session.user as any).id;

    const { wordOriginal, translation, contextSentence } = await req.json();

    if (!wordOriginal || !translation) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const vocab = await prisma.vocab.create({
      data: {
        userId,
        wordOriginal,
        translation,
        contextSentence,
      },
    });

    return NextResponse.json({ success: true, vocab }, { status: 201 });
  } catch (error) {
    console.error("Vocab API Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function GET(req: Request) {
  try {
    const session = await getServerSession();
    if (!session || !session.user || !(session.user as any).id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const userId = (session.user as any).id;

    const vocabs = await prisma.vocab.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ success: true, vocabs }, { status: 200 });
  } catch (error) {
    console.error("Vocab API Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
