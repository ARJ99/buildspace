import { db } from "@/app/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function GET(
    req: Request,
    { params }: { params: Promise<{ courseId: string }> }) {

    try {

        const { userId } = await auth();
        if (!userId) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const { courseId } = await params;

        const user = await db.query.users.findFirst({
            where: {
                clerkId: userId
            }
        })

        if (!user) {
            return new NextResponse("User not found", { status: 404 });
        }

        //Get course with lesson
        const course = await db.query.courses.findFirst({
            where: {
                id: courseId
            },
            with: {
                lessons: {
                    orderBy: (lessons, { asc }) => [asc(lessons.order)]
                }
            }
        });

        if (!course) {
            return new NextResponse("Course not found", { status: 404 });
        }

        const enrollment = await db.query.enrollments.findFirst({
            where: {
                userId: user.id,
                courseId: courseId,
            }
        });

        // Get progress for each lesson if the user is enrolled
        let lessonWithProgress = course.lessons.map((lesson) => ({
            ...lesson,
            completed: false,
        }));

        if (enrollment) {
            // Only fetch progress rows that belong to the lessons of THIS course.

            const lessonIds = course.lessons.map((lesson) => lesson.id);

            const userProgress =
                lessonIds.length === 0
                    ? []
                    : await db.query.progress.findMany({
                        where: {
                            userId: user.id,
                            lessonId: { in: lessonIds },
                        },
                    });

            lessonWithProgress = course.lessons.map((lesson) => ({
                ...lesson,
                completed: userProgress.some(
                    (p) => p.lessonId === lesson.id && p.completed,
                ),
            }));
        }

        return NextResponse.json({ course, lessons: lessonWithProgress });

    } catch (error) {
        console.log(error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}