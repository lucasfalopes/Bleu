import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth/next";

const prisma = new PrismaClient();

export async function GET(req: Request) {
  try {
    const session = await getServerSession();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if (!session || !session.user || !(session.user as any).id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const userId = (session.user as any).id;

    // In a real app, this would fetch the user's friends and themselves
    // For now, let's just fetch top users globally and the current user to mock a leaderboard
    const topUsers = await prisma.user.findMany({
      take: 10,
      orderBy: { xpTotal: 'desc' },
      select: {
        id: true,
        name: true,
        xpTotal: true,
        streakCount: true,
      }
    });

    const leaderboard = topUsers.map(u => ({
      ...u,
      me: u.id === userId,
    }));

    return NextResponse.json({ success: true, leaderboard }, { status: 200 });
  } catch (error) {
    console.error("Leaderboard API Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
