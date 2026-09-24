# Project Overview

Armada Habit Tracker is a full stack web application designed to help users build, maintain, and track positive daily habits. The application features a responsive React Single Page Application frontend powered by Vite and a robust RESTful API backend built with Laravel and PHP.

The system includes a light pastel UI design system, authentication using JSON Web Tokens, habit creation and management, daily completion logging, and progress statistics.

## Features

1. User Registration: Create a new user account with full name, email address, password, and password confirmation.
2. User Login: Authenticate existing users securely using email and password to receive a JWT session token.
3. Create Habit: Add new habits with a required title and an optional detailed description.
4. View Habits: Access a list of all personal habits associated with the authenticated user.
5. Update Habit: Modify habit details including title, description, and active or inactive status.
6. Delete Habit: Permanently remove habits using an interactive confirmation dialog.
7. Mark Habit Complete: Log a habit as completed for any target date.
8. Mark Habit Incomplete: Revert a completed habit log back to pending status.
9. Filter Habits: Filter the habit view by Active status, Inactive status, or All habits.
10. Daily Progress Overview: View overall completion percentages, active habits count, and streak momentum.
11. User Logout: Terminate the current session by clearing the JWT token from client storage.

## Tech Stack

1. Backend Framework: Laravel PHP Framework version 13 running on PHP 8.3 - I chose Laravel with PHP because I have prior experience working with this stack, which allows me to develop faster and more confidently. Laravel also provides a clean structure for REST APIs, authentication, validation and database management.
2. Database: MySQL Relational Database
3. Object Relational Mapper: Laravel Eloquent ORM
4. Frontend Framework: React version 19 with Vite build tool
5. UI Design: Custom Vanilla CSS design system with light pastel color tokens
6. Authentication Package: PHP Open Source Saver JWT Auth package

## Authentication

1. The application uses stateless JWT based authentication.
2. Users receive a JWT token after successful registration or login.
3. The React frontend stores the authentication token in browser localStorage.
4. Axios sends the JWT token with protected API requests using the Authorization Bearer header.
5. Protected Laravel API routes use JWT authentication middleware, ensuring users can access only their own habits and data.

## Database Structure

1. users table: Stores user account details including id, name, email, email_verified_at, password, remember_token, created_at, and updated_at.
2. habits table: Stores user habits with foreign key user_id referencing users table, title, description, is_active status flag, created_at, and updated_at.
3. habit_logs table: Stores daily completion logs with foreign key habit_id referencing habits table, date, completed status flag, created_at, and updated_at. A unique constraint ensures one log entry per habit per date.
4. password_reset_tokens table: Stores password reset verification tokens linked by email.
5. sessions table: Stores session records for framework operations.

## Requirements

1. PHP version 8.3 or compatible version.
2. Composer package manager for PHP.
3. Node.js version 18 or higher.
4. npm package manager.
5. MySQL Database Server running locally or accessible via port 3306.

## Backend Setup

1. Open terminal and navigate into the backend folder:
   cd backend

2. Install PHP composer dependencies:
   composer install

3. Copy the environment template file:
   cp .env.example .env

4. Generate the Laravel application key:
   php artisan key:generate

5. Generate the JWT secret key:
   php artisan jwt:secret

6. Configure database connection parameters in the .env file.

7. Run database migrations:
   php artisan migrate

8. Run database seeders to populate initial data:
   php artisan db:seed

## Frontend Setup

1. Open a new terminal window and navigate into the frontend folder:
   cd frontend

2. Install Node.js dependencies:
   npm install

3. Verify frontend configuration points to http://127.0.0.1:8000/api

## Environment Configuration

Configure the backend .env file with appropriate database credentials. Sample configuration format:

APP_NAME=ArmadaHabitTracker
APP_ENV=local
APP_KEY=
APP_DEBUG=true
APP_URL=http://127.0.0.1:8000

DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=habit_tracker
DB_USERNAME=root
DB_PASSWORD=

JWT_SECRET=

## Database Setup

1. Create a MySQL database named habit_tracker using your database client or SQL command:
   CREATE DATABASE habit_tracker;

2. Execute Laravel migrations to create required tables:
   php artisan migrate

3. Execute database seeder to populate demo records:
   php artisan db:seed

The project includes HabitSeeder.php which creates a demo user account demo@example.com with password password, along with sample habits including Drink Water, Exercise, and Read.

## Running the Application

1. Start the Laravel backend server from the backend directory:
   cd backend
   php artisan serve

   The backend API runs on:
   http://127.0.0.1:8000

2. Start the React frontend development server from the frontend directory:
   cd frontend
   npm run dev

   The frontend web application runs on:
   http://localhost:5173

## How to Test the Main Features

Follow these steps to test the full workflow:

1. Register: Open http://localhost:5173, click Sign Up, enter name, email, password, and password confirmation, then click Register.
2. Login: Log in using your registered email and password. Upon success, you will be redirected to the Dashboard.
3. Create a Habit: Click the Add Habit button in the top header or dashboard. Enter habit title such as Morning Meditation, add an optional description, and click Create Habit.
4. View Habits: Click Habits in the left navigation sidebar to view your list of created habits.
5. Filter Habits: Click the status filter buttons Active, Inactive, and All on the Habits page to filter the display list.
6. Edit a Habit: Click on a habit card to view its details page, click the Edit button, change the title or active status, and save changes.
7. Mark Habit Complete: Click the Mark Complete button on any habit card. Notice the completion badge updates to green and daily progress increases.
8. Mark Habit Incomplete: Click the Mark Incomplete button on a completed habit card. The status reverts to pending.
9. Delete a Habit: Click the Delete button on a habit card, confirm the deletion in the modal dialog, and verify the habit is removed.
10. Logout: Click the Logout button in the sidebar or profile section to end session and return to the login screen.

