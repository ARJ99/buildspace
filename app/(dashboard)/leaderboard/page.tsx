

import { LeaderboardSkeleton } from "@/lib/skeleton";
import { useUser } from "@clerk/nextjs";
import { useQuery } from "@tanstack/react-query";
import { Trophy, Medal } from "lucide-react";

interface LeaderboardResponse {
    entries: LeaderboardEntry[];
    userRank: number | null;
    userPoints: number;
    userLevel: number;
    userStreak: number;
    totalUsers: number;
}


interface LeaderboardEntry {
    id: string;
    name: string | null;
    username: string | null;
    avatarUrl: string | null;
    points: number;
    level: number;
    currentStreak: number;
    rank: number;
}

export default function LeaderboardPage() {
    const { user } = useUser();

    const { data: leaderboard, isLoading } = useQuery<LeaderboardResponse>({
        queryKey: ["leaderboard"],
        queryFn: async () => {
            const res = await fetch("/api/leaderboard");
            if (!res.ok) throw new Error("Failed to fetch leaderboard");
            return res.json();
        },
    });

    const getRankIcon = (rank: number) => {
        if (rank === 1) return <Trophy className="h-5 w-5 text-yellow-500" />;
        if (rank === 2) return <Medal className="h-5 w-5 text-gray-400" />;
        if (rank === 3) return <Medal className="h-5 w-5 text-orange-600" />;
        return <span className="text-sm text-gray-500">{rank}</span>;
    };

    if (isLoading) {
        return <LeaderboardSkeleton />;
    }

    return (
        <div>leaderboard</div>
    )
}