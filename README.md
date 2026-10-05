
# 🎖️ Buildspace 



This project is a gamified learning platform designed for developers, offering interactive courses, progress tracking, and community features. **Although this project is still in progress, I've decided to updated the Readme file in order to keep the organized.**

## 🌟 Project Overview

Buildspace is a Next.js application that aims to revolutionize online learning by incorporating gamification elements. It allows users to enroll in courses, track their progress through lessons, earn experience points (XP), maintain learning streaks, and unlock achievements. The platform leverages modern web technologies and integrates with Clerk for authentication and Google APIs for fetching YouTube content.

## 🚀 Features

- **Gamified Learning Experience:** Earn XP, level up, and maintain learning streaks to stay motivated.
- **Interactive Courses:** Access a variety of courses with hands-on projects.
- **Progress Tracking:** Monitor your progress through lessons and courses.
- **Achievements System:** Unlock badges and achievements as you learn and grow.
- **Leaderboard:** Compete with other learners on a global leaderboard.
- **YouTube Content Integration:** Courses are populated dynamically from YouTube playlists.
- **User Authentication:** Secure user management with Clerk.
- **Responsive Design:** A modern and user-friendly interface built with React and Tailwind CSS.

## 🛠️ Tech Stack

- **Frontend:** React, Next.js, TypeScript, Tailwind CSS, Shadcn UI, Base UI, Framer Motion
- **Backend:** Node.js,Next
- **Database:** PostgreSQL with Drizzle ORM
- **Authentication:** Clerk
- **APIs:** Googleapis (YouTube API)
- **DevOps:** Drizzle Kit, ESLint, Prettier

## 🚀 Installation

Follow these steps to set up the project locally:

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/ARJ99/buildspace.git
    cd buildspace
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    # or
    yarn install
    # or
    pnpm install
    ```

3.  **Environment Variables:**
    Create a `.env.local` file in the root directory and add the following:

    ```env
    DATABASE_URL='postgresql://user:password@host:port/database'
    YOUTUBE_API_KEY='YOUR_YOUTUBE_API_KEY'
    YOUTUBE_CHANNEL_ID='YOUR_YOUTUBE_CHANNEL_ID'
    NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY='YOUR_CLERK_PUBLISHABLE_KEY'
    CLERK_SECRET_KEY='YOUR_CLERK_SECRET_KEY'
    ```
    Replace the placeholder values with your actual credentials.

4.  **Database Setup:**
    Initialize and push your database schema using Drizzle Kit:
    ```bash
    npm run db:generate
    npm run db:push
    ```
    To access the Drizzle Studio, run:
    ```bash
    npm run db:studio
    ```

5.  **Run the development server:**
    ```bash
    npm run dev
    ```

Open `http://localhost:3000` in your browser to view the application.

## 📚 Usage

This project serves as a learning platform where users can:

- **Browse Courses:** Explore available courses, each corresponding to a YouTube playlist.
- **Enroll in Courses:** Sign up for courses to start learning.
- **Complete Lessons:** Watch videos and mark lessons as completed.
- **Track Progress:** Monitor your learning journey through progress indicators and statistics.
- **Earn Rewards:** Gain experience points (XP), level up, and earn achievements for your accomplishments.
- **Compete:** See how you rank against other users on the leaderboard.

### Fetching YouTube Content

The `app/db/fetch-youtube-content.ts` script can be used to populate the database with courses and lessons from a specified YouTube channel. Run it using:

```bash
npm run fetch:youtube
```

## 🏠 Project Structure

The project follows a typical Next.js structure with modifications for Drizzle ORM and component organization:

```
buildspace/
├── app/
│   ├── (auth)/
│   │   ├── layout.tsx
│   │   ├── sign-in/
│   │   │   └── [[...sign-in]]/page.tsx
│   │   └── sign-up/
│   │       └── [[...sign-up]]/page.tsx
│   ├── api/
│   │   ├── achievements/route.ts
│   │   ├── courses/
│   │   │   ├── [courseId]/
│   │   │   │   ├── enroll/route.ts
│   │   │   │   └── route.ts
│   │   │   └── route.ts
│   │   ├── leaderboard/route.ts
│   │   ├── progress/route.ts
│   │   ├── streak/route.ts
│   │   ├── user/
│   │   │   ├── stats/route.ts
│   │   │   └── sync/route.ts
│   │   └── db/
│   │       ├── fetch-youtube-content.ts
│   │       ├── index.ts
│   │       ├── schema/
│   │       │   ├── achievements.ts
│   │       │   ├── courses.ts
│   │       │   ├── enrollments.ts
│   │       │   ├── lessons.ts
│   │       │   ├── progress.ts
│   │       │   ├── relations.ts
│   │       │   └── users.ts
│   │       └── schema.ts (implied by drizzle.config.ts)
│   ├── data/
│   │   └── index.ts
│   ├── providers/
│   │   └── query-provider.tsx
│   ├── page.tsx
│   └── layout.tsx
├── components/
│   ├── ui/
│   │   ├── alert.tsx
│   │   ├── avatar.tsx
│   │   ├── badge.tsx
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── dropdown-menu.tsx
│   │   ├── input.tsx
│   │   ├── progress.tsx
│   │   ├── select.tsx
│   │   ├── skeleton.tsx
│   │   ├── table.tsx
│   │   ├── tabs.tsx
│   │   └── ... (other shadcn UI components)
│   └── providers/
│       └── query-provider.tsx
├── drizzle/
│   ├── 20260829154208_init/
│   │   ├── migration.sql
│   │   └── snapshot.json
│   └── 20260903150521_add_course_difficulty/
│       ├── migration.sql
│       └── snapshot.json
├── lib/
│   └── utils.ts
├── public/
├── .env.local (example)
├── components.json
├── drizzle.config.ts
├── eslint.config.mjs
├── next.config.ts
├── package.json
├── postcss.config.mjs
├── proxy.ts
├── README.md
└── tsconfig.json
```

## 📊 API Reference

This project exposes several API endpoints for managing courses, user progress, and achievements:

- **`GET /api/achievements`**: Fetches all achievements with their earned status for the current user.
- **`POST /api/courses/[courseId]/enroll`**: Enrolls the current user in a specific course.
- **`DELETE /api/courses/[courseId]/enroll`**: Unenrolls the current user from a specific course.
- **`GET /api/courses/[courseId]`**: Fetches details of a specific course, including its lessons and user progress.
- **`GET /api/courses`**: Fetches a list of all available courses with enrollment status.
- **`GET /api/leaderboard`**: Fetches leaderboard data, including ranked users and the current user's position.
- **`POST /api/progress`**: Updates the completion status of a lesson, awarding points and checking for achievements.
- **`GET /api/streak`**: Retrieves the current and longest learning streaks for the user.
- **`GET /api/user/stats`**: Fetches comprehensive user statistics, including XP, level, streaks, and recent activity.
- **`POST /api/user/sync`**: Synchronizes user data from Clerk to the application's database.

## 🤝 Contributing

Contributions are welcome! Please follow these guidelines:

1.  Fork the repository.
2.  Create a new branch for your feature (`git checkout -b feature/AmazingFeature`).
3.  Commit your changes (`git commit -m 'Add some AmazingFeature'`).
4.  Push to the branch (`git push origin feature/AmazingFeature`).
5.  Open a Pull Request.

Please ensure your code adheres to the project's coding standards and includes appropriate tests where applicable.


## 🔗 Important Links

- **Repository:** [https://github.com/ARJ99/buildspace](https://github.com/ARJ99/buildspace)

## 📄 Footer

© 2026 **Buildspace**. Coded with ❤️ by Luis Alejandro Rios Jaque. 

 [Back to Top](#readme-top)
 
---
