import { count, gt } from "drizzle-orm";
import { db } from "@/app/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { users } from "../../db/schema/users";

export async function GET() {
    try {
        const { userId } = await auth();
        if (!userId) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const currentUser = await db.query.users.findFirst({
            where: {
                clerkId: userId,
            }
        })

        //Get 100 users by points
        const leaderboardEntries = await db.query.users.findMany({
            columns: {
                id: true,
                name: true,
                username: true,
                avatarUrl: true,
                points: true,
                level: true,
                currentStreak: true,
            },
            orderBy: (users, { desc, asc }) => [
                desc(users.points),
                asc(users.username),
            ],
            limit: 100,
        })

        const entriesWithRank = (leaderboardEntries).map((entry, index) => ({
            ...entry,
            rank: index + 1
        }));

        let userRank: number | null = null;
        let userPoints = 0;
        let userLevel = 0;
        let userStreak = 0;

        if (currentUser) {
            const leaderboardIndex = entriesWithRank.findIndex(
                (e) => e.id === currentUser.id,
            );

            if (leaderboardIndex !== -1) {
                // User is on the visible leaderboard page.
                userRank = leaderboardIndex + 1;
            } else {
                // User is ranked below the top 100, so compute their true rank
                // by counting how many users have strictly more points.
                const [{ value: usersAhead }] = await db
                    .select({ value: count() })
                    .from(users)
                    .where(gt(users.points, currentUser.points));

                userRank = usersAhead + 1;
            }

            userPoints = currentUser.points;
            userLevel = currentUser.level;
            userStreak = currentUser.currentStreak;
        }

        // Real total number of users, independent of the top-100 page size.
        const [{ value: totalUsers }] = await db
            .select({ value: count() })
            .from(users);

        return NextResponse.json({
            entries: entriesWithRank,
            userRank,
            userPoints,
            userLevel,
            userStreak,
            totalUsers,
        })

    } catch (error) {
        console.log("LEADERBOARD_GET", error);
        return NextResponse.json({
            entries: [],
            userRank: null,
            userPoints: 0,
            userLevel: 1,
            userStreak: 0,
        })
    }
}