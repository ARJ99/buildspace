"use client"

import { useQuery } from "@tanstack/react-query";
import { useState } from "react"

type Courses = {
    id: string;
    title: string;
    description: string;
    thumbnail: string | null;
    duration: number;
    points: number;
    totalLessons: number;
    enrolled: boolean;
    progress: number;
}
export default function CoursesPage() {
    const [search, setSearch] = useState("");

    const { data: courses, isLoading, error } = useQuery({
        queryKey: ["courses"],
        queryFn: async () => {
            const res = await fetch("/api/courses");
            if (!res.ok) throw new Error("Failed to fetch courses");
            const data = await res.json();
            return data;
        }
    })

    const filteredCourses = courses.filter((course: Courses) => {
        const matchesSearch = course.title.toLowerCase().includes(search) || course.description.toLowerCase().includes(search.toLocaleLowerCase());
    });

    return (
        <div>courses</div>
    )
}