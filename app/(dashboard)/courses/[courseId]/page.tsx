
"use client"

import EnrollButton from "@/components/common/enroll-button";
import { Badge } from "@/components/ui/badge";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Award, Clock } from "lucide-react";
import { useParams } from "next/navigation";
import { useState } from "react";

export default function CourseDetailsPage() {

    const { courseId } = useParams();

    const queryClient = useQueryClient();
    const [selectedLesson, setSelectedLesson] = useState(null);

    const { data: course, isLoading, refetch } = useQuery({
        queryKey: ["course", courseId],
        queryFn: async () => {
            const resp = await fetch(`/api/courses/${courseId}`);
            if (!resp.ok) throw new Error("Failed to fetch course.");
            const data = await resp.json();
            return { ...data.course, lessons: data.lessons};
        }
    });

    const completeLessonMutation = useMutation({
        mutationFn: async (lessonId: string) => {
            const resp = await fetch("/api/progress", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ lessonId, completed: true }),
            });
            if (!resp.ok) throw new Error("Failed to update progress");
            return resp.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["course", courseId] });
            queryClient.invalidateQueries({ queryKey: ["stats"] });
        }
    });

    const handleEnrollChange = (enrolled: boolean) => {
        // refetch();
        // queryClient.invalidateQueries({ queryKey: ["stats"] });
        if (enrolled) {
            refetch();                     // celebrate enrollment
            queryClient.invalidateQueries({ queryKey: ["stats"] });
        } else {
            console.log('You left the course');     // different reaction to unenroll
            queryClient.invalidateQueries({ queryKey: ["stats"] });
        }
    };

    const getYouTubeId = (url: string) => {
        if (!url) return null;
        const regExp =
            /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
        const match = url.match(regExp);
        return match && match[2].length === 11 ? match[2] : null;
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600" />
            </div>
        );
    }

    const completedLessons =
        course?.lessons?.filter((l: any) => l.completed).length || 0;
    const totalLessons = course?.lessons?.length || 0;
    const progress =
        totalLessons > 0 ? (completedLessons / totalLessons) * 100 : 0;

    return (
        <div className="space-y-6">
            {/* Course Header */}
            <div className="relative h-64 rounded-xl overflow-hidden">
                <div className="absolute inset-0 bg-linear-to-r from-purple-600 to-indigo-600">
                    <div className="absolute inset-0 bg-black/50" />
                </div>
                <div className="absolute inset-0 flex items-center p-8">
                    <div className="max-w-3xl flex-1">
                        <div className="flex items-center gap-2 mb-4">
                            <Badge
                                variant="outline"
                                className="bg-white/20 text-white border-white/30"
                            >
                                <Clock className="h-3 w-3 mr-1" />
                                {course?.duration} min
                            </Badge>
                            <Badge
                                variant="outline"
                                className="bg-white/20 text-white border-white/30"
                            >
                                <Award className="h-3 w-3 mr-1" />
                                {course?.points} XP
                            </Badge>
                        </div>
                        <h1 className="text-4xl font-bold text-white mb-2">
                            {course?.title}
                        </h1>
                        <p className="text-white/80 text-lg">{course?.description}</p>
                    </div>

                    <div className="ml-4">
                        <EnrollButton
                            courseId={courseId as string}
                            isEnrolled={course?.enrolled || false}
                            onEnrollChange={handleEnrollChange}
                            size="lg"
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}