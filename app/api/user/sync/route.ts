import { auth, currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { users } from '../../../db/schema/users';
import { db } from "@/app/db";
import { eq } from "drizzle-orm";

export async function POST() {
    try {
        const { userId } = await auth();
        const clerkUser = await currentUser();

        if (!userId || !clerkUser) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const email = clerkUser.emailAddresses[0]?.emailAddress;

        if (!email) {
            return new NextResponse("User email not found", { status: 400 });
        }

        const username = clerkUser.username || email.split("@")[0] || "learner";
        const name = clerkUser.firstName
            ? `${clerkUser.firstName} ${clerkUser.lastName ?? ""}`.trim()
            : clerkUser.username || email.split("@")[0] || "Learner";


        // Check if the user exists in our DB.
        // Drizzle v1 relational query builder (`db.query.*`) uses a plain-object
        // `where` filter. A bare value is the equality shorthand, so
        // `{ clerkId: userId }` compiles to `WHERE "clerk_id" = $1`.
        const existingUser = await db.query.users.findFirst({
            where: {
                clerkId: userId,
            },
        });

        if (!existingUser) {
            const [newUser] = await db.insert(users)
                .values({
                    clerkId: userId,
                    email,
                    name,
                    username,
                    avatarUrl: clerkUser.imageUrl,
                    points: 0,
                    level: 1,
                    currentStreak: 0,
                    longestStreak: 0,
                    lastActive: new Date(),
                })
                .returning();

            return NextResponse.json({
                success: true,
                user: newUser,
                message: "User created successfully",
            });
        }

        // User already exists → update their profile.

        // NOTE: `db.update()` is the SQL builder API, which is DIFFERENT from
        // the relational builder above. Its `.where()` takes a SQL expression
        // (`eq(users.clerkId, userId)`), NOT the object filter used by
        // `db.query.*`. 
        const [updatedUser] = await db.update(users)
            .set({
                name,
                email,
                username,
                avatarUrl: clerkUser.imageUrl,
                updatedAt: new Date(),
            })
            .where(eq(users.clerkId, userId))
            .returning();

        return NextResponse.json({
            success: true,
            user: updatedUser,
            message: "User synced successfully",
        });
    } catch (error) {
        console.error("user/sync error:", error);
        return NextResponse.json(
            {
                error: "Failed to sync user",
                details: error
            },
            { status: 500 });
    }
}