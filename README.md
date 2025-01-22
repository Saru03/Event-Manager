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
- git clone 
- cd "Event Manager"
- npm run build
- npm install
- npm run dev
### Environment Variables
Create a `.env` file in the root directory with the following keys:
- `GOOGLE_CLIENT_ID`: Your Google OAuth Client ID
- `GOOGLE_CLIENT_SECRET`: Your Google OAuth Client Secret
- `GOOGLE_CALLBACK_URL`: Callback URL (e.g., `http://localhost:3000/auth/google/callback`)

**Note**: Since the app is not verified by Google, you will see a warning screen during the Google login process. Click on "Advanced" and then "Proceed to [your app name]" to continue.

