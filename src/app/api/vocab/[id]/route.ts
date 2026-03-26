import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth/next";

const prisma = new PrismaClient();

export async function PUT(req: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const session = await getServerSession();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if (!session || !session.user || !(session.user as any).id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const userId = (session.user as any).id;
    const params = await context.params;
    const vocabId = params.id;

    const { masteryDelta } = await req.json();

    const vocab = await prisma.vocab.findUnique({
      where: { id: vocabId },
    });

    if (!vocab || vocab.userId !== userId) {
      return NextResponse.json({ error: "Not found or unauthorized" }, { status: 404 });
    }

    const newLevel = Math.max(0, Math.min(3, vocab.masteryLevel + masteryDelta));

    // Calculate next review date based on spaced repetition logic
    const nextReview = new Date();
    if (newLevel === 0) nextReview.setHours(nextReview.getHours() + 1);
    else if (newLevel === 1) nextReview.setDate(nextReview.getDate() + 1);
    else if (newLevel === 2) nextReview.setDate(nextReview.getDate() + 3);
    else if (newLevel === 3) nextReview.setDate(nextReview.getDate() + 7);

    const updatedVocab = await prisma.vocab.update({
      where: { id: vocabId },
      data: {
        masteryLevel: newLevel,
        nextReviewDate: nextReview,
      },
    });

    return NextResponse.json({ success: true, vocab: updatedVocab }, { status: 200 });
  } catch (error) {
    console.error("Vocab Update API Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
