import { db } from "@/app/db";
import { users } from "@/app/db/schema/users";
import { auth } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";


export async function GET() {
    try {
        const { userId } = await auth();
        if (!userId) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const user = await db.query.users.findFirst({
            where: {
                clerkId: userId
            }
        });

        if (!user) {
            return NextResponse.json({
                currentStreak: 0,
                longestStreak: 0
            })
        }

        //Calculate today's progress

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        //Get all completed lessons
        const completedLessons = await db.query.progress.findMany({
            where: {
                userId: user.id,
                completed: true,
            }
        });

        const completedDates = new Set<string>();

        completedLessons.forEach((lesson) => {
            if (lesson.completedAt) {
                const date = new Date(lesson.completedAt);
                date.setHours(0, 0, 0, 0);
                completedDates.add(date.toISOString());
            }
        });

        //Calculate current Streak
        let currentStreak = 0;
        let checkDate = new Date(today);

        while (true) {
            const dateStreak = checkDate.toISOString();
            if (completedDates.has(dateStreak)) {
                currentStreak++;
                checkDate.setDate(checkDate.getDate() - 1);
            } else {
                break
            }
        }

        //Update user's streak in DB

        if (currentStreak !== user.currentStreak) {
            await db.update(users).set({
                currentStreak: currentStreak,
                longestStreak: Math.max(currentStreak, user.longestStreak)
            }).where(eq(users.id, user.id))
        }

        return NextResponse.json({
            currentStreak,
            longestStreak: Math.max(currentStreak, user.longestStreak)
        });
    } catch (error) {
        console.log("[STREAK_GET]", error);
        return NextResponse.json({ currentStreak: 0, longestStreak: 0 });
    }
}