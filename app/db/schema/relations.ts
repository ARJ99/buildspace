import { defineRelations } from "drizzle-orm";

import { users } from "./users";
import { courses } from "./courses";
import { lessons } from "./lessons";
import { enrollments } from "./enrollments";
import { progress } from "./progress";
import { achievements, userAchievements } from "./achievements";

/**
 * Central place where every relation between the tables is declared using the
 * drizzle v1 `defineRelations` API.
 *
 * Defining all relations in a single leaf module (this file is only imported
 * by `app/db/index.ts`, never by the table files) avoids the circular-import
 * crash that happened when `defineRelations` was spread across per-entity files
 * that imported each other at module-evaluation time.
 */
export const relations = defineRelations(
	{
		users,
		courses,
		lessons,
		enrollments,
		progress,
		achievements,
		userAchievements,
	},
	(helpers) => ({
		users: {
			enrollments: helpers.many.enrollments({
				from: helpers.users.id,
				to: helpers.enrollments.userId,
			}),
			userAchievements: helpers.many.userAchievements({
				from: helpers.users.id,
				to: helpers.userAchievements.userId,
			}),
			progress: helpers.many.progress({
				from: helpers.users.id,
				to: helpers.progress.userId,
			}),
		},
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
		lessons: {
			course: helpers.one.courses({
				from: helpers.lessons.courseId,
				to: helpers.courses.id,
			}),
			progress: helpers.many.progress({
				from: helpers.lessons.id,
				to: helpers.progress.lessonId,
			}),
		},
		enrollments: {
			user: helpers.one.users({
				from: helpers.enrollments.userId,
				to: helpers.users.id,
			}),
			course: helpers.one.courses({
				from: helpers.enrollments.courseId,
				to: helpers.courses.id,
			}),
		},
		progress: {
			user: helpers.one.users({
				from: helpers.progress.userId,
				to: helpers.users.id,
			}),
			lesson: helpers.one.lessons({
				from: helpers.progress.lessonId,
				to: helpers.lessons.id,
			}),
		},
		achievements: {
			userAchievements: helpers.many.userAchievements({
				from: helpers.achievements.id,
				to: helpers.userAchievements.achievementId,
			}),
		},
		userAchievements: {
			user: helpers.one.users({
				from: helpers.userAchievements.userId,
				to: helpers.users.id,
			}),
			achievement: helpers.one.achievements({
				from: helpers.userAchievements.achievementId,
				to: helpers.achievements.id,
			}),
		},
	}),
);
