import { and, eq } from "drizzle-orm";
import { db } from "@/app/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { enrollments } from '../../../../db/schema/enrollments';


export async function POST(
    req: Request,
    { params }: { params: Promise<{ courseId: string }> }
) {
    try {

        const { userId } = await auth();
        if (!userId) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const { courseId } = await params;
        const user = await db.query.users.findFirst({
            where: {
                clerkId: userId,
            }
        });

        if (!user) return new NextResponse("user not found", { status: 404 });

        const course = await db.query.courses.findFirst({
            where: {
                id: courseId,
            }
        })

        if (!course) {
            return new NextResponse("Course not found", { status: 404 });
        }


        const existingEnrollment = await db.query.enrollments.findFirst({
            where: {
                userId: user.id,
                courseId: courseId,
            }
        });

        if (existingEnrollment) {
            return NextResponse.json({
                message: 'Already enrolled',
                enrolled: true,
            });
        }


        const enrollment = await db.insert(enrollments).values({
            userId: user.id,
            courseId: courseId,
            enrolledAt: new Date(),
            completed: false,
        }).returning();

        return NextResponse.json({
            success: true,
            enrollment: enrollment[0],
            message: 'Successfully enrolled in course.',
        });

    } catch (error) {
        console.log("[ENROLL_POST", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}



export async function DELETE(
    req: Request,
    { params }: { params: Promise<{ courseId: string }> }
) {
    try {
        const { userId } = await auth();
        if (!userId) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const { courseId } = await params;
        const user = await db.query.users.findFirst({
            where: {
                clerkId: userId,
            }
        });

        if (!user) return new NextResponse("user not found", { status: 404 });

        const deleted = await db.delete(enrollments).where(
            and(
                eq(enrollments.userId, user.id),
                eq(enrollments.courseId, courseId),
            ),
        ).returning();

        if (deleted.length === 0) {
            return new NextResponse("Not enrolled", { status: 404 });
        }
        return NextResponse.json({
            success: true,
            message: "Successfully unenrolled from course. "
        })


    } catch (error) {
        console.log("[ENROLL_DELETE]", error);
        return new NextResponse("Internal Error", { status: 500 })
    }
}