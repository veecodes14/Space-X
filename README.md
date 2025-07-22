# Space-X
Ride hailing application

# Space-X
Ride Hailing System Backend core built in Nodejs and TypeScript
SpaceX is a mission scheduling service with features such as: authentication, ride request management, and role-based access (admin, user). Built using TypeScript, Node.js, Express, and MongoDB.

## Tech Stack
- TypeScript
- Node.js + Express.js
- MongoDB + Mongoose
- JWT for Auth
- bcrypt for password hashing
- Helmet, cors, dotenv, morgan

## General Features
- Two roles: Admin and User. Users can schedule and abort missions, and admins can manage rockets.
- User registration/login (admin, user roles)
- Schedule missions
- User views pending rides
- Schedule/complete/abort mission
- View mission history

## Attribute Features:
- Authentication: 
User signup/login (role: user, admin)
JWT token issuance
Role-based access control

- Mission Flow
User schedules a mission request
Admin sees a list of pending missions
Admin marks ride as completed

- Trip History
Admin: List of past missions

