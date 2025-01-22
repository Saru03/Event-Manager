## Project Overview
This is a web application that allows users to log in via Google SSO, view their Google Calendar events, and filter events by date. The app is built with Node.js, Express, React, and Google Calendar API. It demonstrates backend, frontend, API integration, and UI/UX design skills.
## Tech Stack
- **Frontend**: React (for building a responsive and dynamic user interface)
- **Backend**: Node.js and Express (for handling authentication and API integration)
- **Database**: Not required for this project since data is fetched directly from Google Calendar API
- **Authentication**: Google OAuth 2.0 (for secure SSO login)
- **Styling**: Material-UI (for clean and professional UI design)
- **Deployment**: Vercel (frontend) and Google Cloud (backend)
## Features
- Google SSO Login
- Display Google Calendar events in a table
- Filter events by date
- Deployed app with a cloud-hosted backend and frontend
## Features
- Implemented a delete button which deletes events in the application as well as google calender


## Setup instructions
### 1. The website is deployed on this URL :- https://event-manager-oicx.onrender.com
- Since google requires verified app to access google services, the project on google cloud console is in testing phase
- Test users can be added
### 2.To set up locally run the following command in vs code terminal/git bash/command prompt
- git clone https://github.com/Saru03/Event-Manager.git
- cd "Event Manager"
- npm install
- cd frontend / npm install / npm run build
#### Environment Variables
Create a `.env` file in the root directory with the following keys:
- `GOOGLE_CLIENT_ID`: Your Google OAuth Client ID
- `GOOGLE_CLIENT_SECRET`: Your Google OAuth Client Secret
- `GOOGLE_CALLBACK_URL`: Callback URL (`http://localhost:3000/auth/google/callback`)
#### To start server run "npm run dev"


**Note**: Since the app is not verified by Google, you will see a warning screen during the Google login process. Click on "Advanced" and then "Proceed to [your app name]" to continue.

