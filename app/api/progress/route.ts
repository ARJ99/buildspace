import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { db } from "@/app/db";
import { enrollments } from "@/app/db/schema/enrollments";
import { progress } from "@/app/db/schema/progress";
import { and, eq, sql } from "drizzle-orm";
import { users } from "@/app/db/schema/users";

export async function POST(req: Request) {
    try {
        const { userId } = await auth();
        if (!userId) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const body = await req.json();

        const { lessonId, completed } = body;

        //Get user from Database
        let user = await db.query.users.findFirst({
            where: {
                clerkId: userId,
            }
        })

        if (!user) {
            return new NextResponse("User not found", { status: 401 });
        }

        const lesson = await db.query.lessons.findFirst({
            where: {
                id: lessonId,
            }
        });

        if (!lesson) {
            return new NextResponse("Lesson not found", { status: 401 });
        }

        const existingEnrollments = await db.query.enrollments.findFirst({
            where: {
                userId: user.id,
                courseId: lesson.courseId,
            }
        });

        if (!existingEnrollments) {
            await db.insert(enrollments).values({
                userId: user.id,
                courseId: lesson.courseId,
                enrolledAt: new Date(),
                completed: false,
            })
        }


        //Update or create Progress
        const existingProgress = await db.query.progress.findFirst({
            where: {
                userId: user.id,
                lessonId: lesson.id,
            }
        })

        if (existingProgress) {
            await db.update(progress).set({
                completed: completed,
                completedAt: completed ? new Date() : null,
            }).where(
                and(eq(progress.userId, user.id), eq(progress.lessonId, lessonId))
            );
        } else {
            await db.insert(progress).values({
                userId: user.id,
                lessonId: lessonId,
                completed: completed,
                completedAt: completed ? new Date() : null
            });
        }

        //If lesson completed, award points, update streak, and check achievements
        if (!completed) {
            //award points
            const courseWithLessons = await db.query.courses.findFirst({
                where: {
                    id: lesson.courseId
                }, with: {
                    lessons: true,
                }
            });
            if (courseWithLessons) {
                const pointsPerLesson = Math.floor(
                    courseWithLessons.points / courseWithLessons.lessons.length,
                );

                await db.update(users).set({
                    points: sql`${users.points} + ${pointsPerLesson}`,
                }).where(eq(users.id, user.id));

                console.log(`Awarded ${pointsPerLesson} XP for completing Lesson`);
            }

            //Update Streak
            await updateUserStreak(user.id);

            //Check Achivements
            await checkAndAwardAchievements(user.id);

            return NextResponse.json({ success: true })
        }
    } catch (error) {
        console.log("[PROGRESS_POST]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}


async function updateUserStreak(userId: string) {
    const completedLessons = await db.query.progress.findMany({
        where: and(eq(progress.userId, userId), eq(progress.completed, true)),
        orderBy: (progress, { desc }) => [desc(progress.completedAt)],
    });

    if (completedLessons.length === 0) return;

    // Get unique completion dates
    const uniqueDates = new Set<string>();
    completedLessons.forEach((lesson) => {
        if (lesson.completedAt) {
            const date = new Date(lesson.completedAt);
            date.setHours(0, 0, 0, 0);
            uniqueDates.add(date.toISOString());
        }
    });

    const sortedDates = Array.from(uniqueDates).sort().reverse();

    // Calculate streak
    let streak = 0;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    const lastActivityDate = new Date(sortedDates[0]);
    lastActivityDate.setHours(0, 0, 0, 0);

    if (lastActivityDate >= yesterday) {
        streak = 1;
        for (let i = 1; i < sortedDates.length; i++) {
            const prevDate = new Date(sortedDates[i - 1]);
            const currDate = new Date(sortedDates[i]);
            prevDate.setHours(0, 0, 0, 0);
            currDate.setHours(0, 0, 0, 0);

            const diffDays =
                (prevDate.getTime() - currDate.getTime()) / (1000 * 60 * 60 * 24);
            if (diffDays === 1) {
                streak++;
            } else {
                break;
            }
        }
    }

    await db
        .update(users)
        .set({
            currentStreak: streak,
            longestStreak: sql`GREATEST(${users.longestStreak}, ${streak})`,
            lastActive: new Date(),
        })
        .where(eq(users.id, userId));

    console.log(`🔥 Streak updated to ${streak} days`);
}
async function checkAndAwardAchievements(userid: string) {

}