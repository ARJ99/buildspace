
"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useUser } from "@clerk/nextjs";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Award, Badge, BookOpen, Calendar, Flame, Trophy } from "lucide-react";
import { useEffect } from "react";


export default function DashboardPage() {

    const { user, isLoaded: isUserLoaded } = useUser();

    //Sync User
    const syncUserMutation = useMutation({
        mutationFn: async () => {
            console.log('Syncing user data with backend...');
            const response = await fetch('/api/user/sync', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                }
            });
            if (!response.ok) {
                throw new Error('Failed to sync user data');
            }
            const data = await response.json();
            console.log('✅ User data synced successfully:', data);
            return data;
        }
    });

    //Sync User'data stats
    const { data: stats, isLoading, refetch } = useQuery({
        queryKey: ["stats", user?.id],
        queryFn: async () => {
            const res = await fetch("/api/user/stats");
            if (!res.ok) throw new Error("Failed to fetch stats");
            const data = await res.json();
            console.log("Fetched user stats:", data);
            return data;
        },
        enabled: isUserLoaded && !!user, //If user is not logged in, don't fetch stats

    });

    // Sync user when component mounts or user changes
    useEffect(() => {
        if (isUserLoaded && user) {
            //First sync user to db
            syncUserMutation.mutate(undefined, {
                onSuccess: () => {
                    refetch();
                }
            })
        }
    }, [isUserLoaded, user?.id]);


    const displayName =
        stats?.username || user?.username || user?.firstName || "Learner";
    return (
        <div className="space-y-6">
            <div className="bg-linear-to-r from-purple-600 to-indigo-600 rounded-xl p-6 text-white">
                <h1 className="text-3xl font-bold">Welcome back, {displayName}! 👋</h1>
                <p className="text-purple-100 mt-1">
                    Level {stats?.level || 1} · {stats?.totalXP?.toLocaleString() || 0} XP
                </p>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-500">Total XP</p>
                                <p className="text-3xl font-bold text-purple-600">
                                    {stats?.totalXP?.toLocaleString() || 0}
                                </p>
                            </div>
                            <div className="p-3 bg-purple-100 dark:bg-purple-900/20 rounded-full">
                                <Trophy className="h-6 w-6 text-purple-600" />
                            </div>
                        </div>
                        <Badge className="mt-2">
                            Level {stats?.level || 1}
                        </Badge>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-500">Courses</p>
                                <p className="text-3xl font-bold">
                                    {stats?.coursesInProgress || 0}
                                </p>
                                <p className="text-xs text-gray-500">In Progress</p>
                            </div>
                            <div className="p-3 bg-blue-100 dark:bg-blue-900/20 rounded-full">
                                <BookOpen className="h-6 w-6 text-blue-600" />
                            </div>
                        </div>
                        {stats?.completedCourses > 0 && (
                            <p className="text-xs text-green-600 mt-2">
                                {stats.completedCourses} completed
                            </p>
                        )}
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-500">Current Streak</p>
                                <p className="text-3xl font-bold text-orange-600">
                                    {stats?.currentStreak || 0}
                                </p>
                                <p className="text-xs text-gray-500">days</p>
                            </div>
                            <div className="p-3 bg-orange-100 dark:bg-orange-900/20 rounded-full">
                                <Flame className="h-6 w-6 text-orange-600" />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-500">Today's Goal</p>
                                <p className="text-3xl font-bold text-green-600">
                                    {stats?.todayCompleted || 0}/3
                                </p>
                                <p className="text-xs text-gray-500">lessons</p>
                            </div>
                            <div className="p-3 bg-green-100 dark:bg-green-900/20 rounded-full">
                                <Calendar className="h-6 w-6 text-green-600" />
                            </div>
                        </div>
                        <Progress value={stats?.todayProgress || 0} className="h-1 mt-2" />
                    </CardContent>
                </Card>
            </div>

            {/* Recent Activity */}
            
        </div>
    )
}
