import { pgTable, text, integer, timestamp } from "drizzle-orm/pg-core";
import { defineRelations, sql } from "drizzle-orm";
import { lessons } from "./lessons";
import { enrollments } from "./enrollments";

// Defines the "courses" table, storing course details like title,
// description, thumbnail, duration, points, and timestamps.
export const courses = pgTable("courses", {
    id: text("id")
        .primaryKey()
        .default(sql`gen_random_uuid()`),
    title: text("title").notNull(),
    description: text("description").notNull(),
    thumbnail: text("thumbnail"),
    duration: integer("duration").notNull(),
    points: integer("points").default(100).notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Sets up the relations: a course has many lessons and many enrollments.

export const coursesRelations = defineRelations(
    { courses, lessons, enrollments },
    (helpers) => ({
        courses: {
            lessons: helpers.many.lessons({
                from: helpers.courses.id,
                to: helpers.lessons.courseId,
            }),
            enrollments: helpers.many.enrollments({
                from: helpers.courses.id,
                to: helpers.enrollments.courseId,
            }),
        },
    })
);