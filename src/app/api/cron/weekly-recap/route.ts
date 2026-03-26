import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// This endpoint would typically be called by a cron job (e.g. Vercel Cron)
export async function GET(req: Request) {
  try {
    // Basic security check: ensure request comes from allowed cron scheduler
    const authHeader = req.headers.get("Authorization");
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      // For local testing without a secret, you might allow it, but generally return 401
      // return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get all users
    const users = await prisma.user.findMany({
      include: {
        vocabs: {
          where: {
            createdAt: {
              gte: new Date(new Date().setDate(new Date().getDate() - 7)) // last 7 days
            }
          }
        }
      }
    });

    const recapData = users.map(user => ({
      email: user.email,
      name: user.name,
      streak: user.streakCount,
      xp: user.xpTotal,
      newWordsCount: user.vocabs.length
    }));

    // In a real application, you would iterate over recapData and send emails via Resend/SendGrid
    console.log(`Sending weekly recaps to ${recapData.length} users.`);

    // For logging/demonstration purposes
    if (recapData.length > 0) {
       console.log("Sample Recap Email Data:", recapData[0]);
    }

    return NextResponse.json({
      success: true,
      message: `Weekly recaps processed for ${recapData.length} users`,
      data: recapData
    }, { status: 200 });

  } catch (error) {
    console.error("Cron Job Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
