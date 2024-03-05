# Description 
The developed music app is a feature-rich platform designed to play .mp3 files, implement caching using Redis, utilize APIs via Flask, implement role-based authentication, and handle backend jobs using Celery for scheduling tasks. The app encompasses three distinct roles: users, creators, and administrators. 
Technologies Used 
Flask for API 
VueJS for UI 
VueJS Advanced with CLI (if required) 
Jinja2 templates (if required) 
Bootstrap (if required, no other CSS framework allowed) 
SQLite for database 
Redis for caching 
Redis and Celery for batch jobs 
WSL for Windows OS compatibility 
Database Schema Design 
The database schema design has been modified to include an additional table and relationships. Here are the changes: 
# Tables 
1. User 
- Columns: 
- `id`: Integer, primary key 
- `username`: String, unique 
- `email`: String, unique 
- `password`: String 
- `active`: Boolean 
- `fs_uniquifier`: String, unique, not nullable 
- `roles`: Relationship with 'Role' table through 'RolesUsers' table 
- `songs`: Relationship with 'Song' table 
- `likes`: Relationship with 'Like' table 
- `flags`: Relationship with 'Flag' table 
- `followed`: Relationship with other 'User' entities through the 'followers' table 2. RolesUsers 
- Columns: 
- `id`: Integer, primary key 
- `user_id`: Integer, foreign key referencing 'User.id'
- `role_id`: Integer, foreign key referencing 'Role.id' 3. Role 
- Columns: 
- `id`: Integer, primary key 
- `name`: String, unique 
- `description`: String 
4. Song 
- Columns: 
- `id`: Integer, primary key 
- `name`: String, unique, not nullable 
- `lyrics`: Text, nullable 
- `genre`: String, nullable 
- `songUrl`: String 
- `duration`: String, not nullable 
- `poster`: String, not nullable, default 'default.png' 
- `creator_id`: Integer, foreign key referencing 'User.id' - `likes`: Relationship with 'Like' table 
- `flags`: Relationship with 'Flag' table 
- `date_created`: String, default current UTC time, not nullable 5. Like 
- Columns: 
- `id`: Integer, primary key 
- `user_id`: Integer, foreign key referencing 'User.id' - `song_id`: Integer, foreign key referencing 'Song.id' 6. Flag 
- Columns: 
- `id`: Integer, primary key 
- `user_id`: Integer, foreign key referencing 'User.id' - `song_id`: Integer, foreign key referencing 'Song.id'

# Architecture and Features 
The project directory is structured as follows: 
- ● application 
- ○ init.py 
- ○ controllers.py 
- ○ endpoints.py 
- ○ instances.py 
- ○ mail_service.py 
- ○ models.py 
- ○ security.py 
- ○ tasks.py 
- ○ worker.py 
- ● instance 
- ○ music.db
- ● static 
- ○ components 
- ■ Account.js 
- ■ AdminDashboard.js 
- ■ AdminLogin.js 
- ■ AllUsers.js 
- ■ CreatorHome.js 
- ■ Player.js 
- ■ Profile.js 
- ■ UserHome.js 
- ■ UserLogin.js 
- ■ UserRegistration.js 
- ■ Welcome.js 
- ○ posterfiles 
- ■ defaultPoster.png 
- ○ trackfiles 
- ○ index.js 
- ○ router.js 
- ● templates 
- ○ index.html 
- ○ monthly_report.html 
- ● celeryconfig.py 
- ● config.py 
- ● initial_changes.py 
- ● main.py 
- ● requirements.txt 
# Features 
The app allows users to play songs from anywhere within the app. Creators can upload songs, including song posters, and edit song lyrics as needed. The administrator can delete songs based on the number of flags it gets. Backend jobs like creating a .csv file of the songs and creating a monthly report of the songs and their usage, work fine. Users, creators and the administrator can search for songs in the search bar and play the song. 
# Video Link 
https://drive.google.com/file/d/1o8dvcjiMFM9ajO2HgijU-BWqXyDFcSHQ/view?usp=drive_link


