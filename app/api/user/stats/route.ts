import { db } from "@/app/db";
import { auth, currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const { userId } = await auth();
        if (!userId) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        // Get Clerk user for username
        const clerkUser = await currentUser();
        const username =
            clerkUser?.username ||
            clerkUser?.firstName ||
            clerkUser?.emailAddresses[0]?.emailAddress?.split("@")[0] ||
            "Learner";

        // Get DB user
        const dbUser = await db.query.users.findFirst({
            where: {
                clerkId: userId,
            },
        });

        if (!dbUser) {
            return NextResponse.json({
                username,
                level: 1,
                totalXP: 0,
                currentStreak: 0,
                longestStreak: 0,
                nextLevelPoints: 1000,
                coursesInProgress: 0,
                completedCourses: 0,
                totalLessonsCompleted: 0,
                todayProgress: 0,
                todayCompleted: 0,
                remainingToday: 3,
                recentActivity: [],
            });
        }

        //Get enrollments
        const allenrollments = await db.query.enrollments.findMany({
            where: {
                userId: dbUser.id,
            },
        });

        const completedCourses = allenrollments.filter((enrollment) => enrollment.completed).length;
        const coursesInProgress = allenrollments.filter((enrollment) => !enrollment.completed).length;

        // Get completed lessons, loading each lesson and its course so we can
        // return titles for "recent activity" without extra queries.
        //
        // `where`   : object filter → `WHERE user_id = $1 AND completed = TRUE`
        // `with`    : eager-loads relations — each progress row gets a nested
        //             `lesson` (a "one" relation) which itself carries its
        //             `course` (also a "one" relation).
        // `orderBy` : object form → `ORDER BY completed_at DESC`.
        const completedLessons = await db.query.progress.findMany({
            where: {
                userId: dbUser.id,
                completed: true,
            },
            with: {
                lesson: {
                    with: {
                        course: true,
                    },
                },
            },
            orderBy: {
                completedAt: "desc",
            },
        });

        return NextResponse.json({
            username,
            level: dbUser.level,
            totalXP: dbUser.points,
            currentStreak: dbUser.currentStreak,
            longestStreak: dbUser.longestStreak,
            nextLevelPoints: 1000,
            coursesInProgress,
            completedCourses,
            totalLessonsCompleted: completedLessons.length,
            todayProgress: 0,
            todayCompleted: 0,
            remainingToday: 3,
            recentActivity: completedLessons.slice(0, 5).map((p) => ({
                lessonId: p.lessonId,
                // `lesson`/`course` are "one" relations, which Drizzle v1 types
                // as optional → guard with `?.`.
                lessonTitle: p.lesson?.title ?? "Unknown lesson",
                courseTitle: p.lesson?.course?.title ?? "Unknown course",
                completedAt: p.completedAt,
            })),
        });

    } catch (error) {
        return NextResponse.json(
            {
                error: "Failed to fetch user stats",
                details: error
            },
            { status: 500 }
        );
    }
}