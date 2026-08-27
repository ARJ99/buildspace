import { defineRelations, sql } from "drizzle-orm";

import { integer, text, timestamp } from "drizzle-orm/pg-core/columns";
import { uniqueIndex } from "drizzle-orm/pg-core/indexes";
import { pgTable } from "drizzle-orm/pg-core/table";
import { enrollments } from "./enrollments";
import { userAchievements } from "./achievements";
import { progress } from "./progress";


export const users = pgTable("users", {
    id: text("id").primaryKey().default(sql`gen_random_uuid()`),
    clerkId: text("clerk_id").notNull().unique(),
    email: text("email").notNull().unique(),
    name: text("name"),
    username: text("username").unique(),
    avatarUrl: text("avatarUrl"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),

    //Gamification
    points: integer("points").default(0).notNull(),
    level: integer("level").default(1).notNull(),
    currentStreak: integer("currentStreak").default(0).notNull(),
    longestStreak: integer("longestStreak").default(0).notNull(),
    lastActive: timestamp("lastActive"),
}, (table) => {
    return {
        clerkIdIdx: uniqueIndex("clerk_id_idx").on(table.clerkId),
        emailIdx: uniqueIndex("email_idx").on(table.email),
        usernameIdx: uniqueIndex("username_idx").on(table.username),
    }
})

// Sets up the relations: a user can have many
// enrollments, achievements, and progress records.
//
// NOTE: this installed drizzle-orm does not export `relations()`.
// The relation API is `defineRelations(schema, helpers)` — you pass the set
// of tables once and build each table's relations with helpers.one/many,
// referencing columns as helpers.<table>.<column>.

// export const usersRelations = defineRelations(
//     { users, enrollments, userAchievements, progress },
//     (helpers) => ({
//         users: {
//             enrollments: helpers.many.enrollments({
//                 from: helpers.users.id,
//                 to: helpers.enrollments.userId,
//             }),
//             userAchievements: helpers.many.userAchievements({
//                 from: helpers.users.id,
//                 to: helpers.userAchievements.userId,
//             }),
//             progress: helpers.many.progress({
//                 from: helpers.users.id,
//                 to: helpers.progress.userId,
//             }),
//         },
//     }),
// );
