import {
    pgTable,
    text,
    timestamp,
    boolean,
    uniqueIndex,
} from "drizzle-orm/pg-core";
import { defineRelations, sql } from "drizzle-orm";
import { users } from "./users";
import { lessons } from "./lessons";

// Defines the "progress" table, tracking user completion
// status for each lesson, with timestamps.
export const progress = pgTable(
    "progress",
    {
        id: text("id")
            .primaryKey()
            .default(sql`gen_random_uuid()`),
        userId: text("user_id")
            .notNull()
            .references(() => users.id, { onDelete: "cascade" }),
        lessonId: text("lesson_id")
            .notNull()
            .references(() => lessons.id, { onDelete: "cascade" }),
        completed: boolean("completed").default(false).notNull(),
        completedAt: timestamp("completed_at"),
    },
    (table) => {
        return {
            uniqueProgress: uniqueIndex("unique_progress_idx").on(
                table.userId,
                table.lessonId,
            ),
        };
    },
);

// Sets up the relations: a progress record links to one user and one lesson.

export const progressRelations = defineRelations(
    { progress, users, lessons },
    (helpers) => ({
        progress: {
            users: helpers.one.users({
                from: helpers.progress.userId,
                to: helpers.users.id,
            }),
            lessons: helpers.one.lessons({
                from: helpers.progress.lessonId,
                to: helpers.lessons.id,
            })
        }
    })
)