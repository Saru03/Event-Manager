require('dotenv').config();

const express = require('express')
const app = express()
const passport = require('passport')
const session = require('express-session')
const GoogleStrategy = require('passport-google-oauth20').Strategy
const cors = require('cors')
const { google } = require('googleapis');
const port = process.env.PORT || 3000
const path = require('path')

const _dirname = path.resolve();

const FRONTEND_URL = process.env.NODE_ENV === 'production'
    ? 'https://event-manager-oicx.onrender.com'
    : 'http://localhost:5173';
const BACKEND_URL = process.env.NODE_ENV === 'production'
    ? 'https://event-manager-oicx.onrender.com'
    : `http://localhost:${port}`;

app.use(express.static(path.join(_dirname, "frontend/dist")));

app.use(cors({
    origin: FRONTEND_URL,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Cookie'],
    exposedHeaders: ['Set-Cookie']
}));

app.use(session({
    secret:"secret",
    resave:false,
    saveUninitialized:true,
    cookie: {
        secure: false, // Set to true if using HTTPS
        httpOnly: true,
        sameSite: 'lax',
        maxAge: 24 * 60 * 60 * 1000 // 24 hours
    } 
}))

app.use(passport.initialize())
app.use(passport.session())

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL:  `${BACKEND_URL}/auth/google/callback`
  },
  (accessToken, refreshToken, profile, done)=>{
    profile.accessToken = accessToken;
    profile.refreshToken = refreshToken;
    return done(null, profile);;
  }
));

passport.serializeUser((user,done)=>done(null,user))
passport.deserializeUser((user,done)=>done(null,user))

app.get("/auth/google",passport.authenticate('google',{scope:["profile","email","https://www.googleapis.com/auth/calendar.events"]}))

app.get("/auth/google/callback", passport.authenticate('google', { failureRedirect: `${FRONTEND_URL}/` }), (req, res) => {
    res.redirect(`${FRONTEND_URL}/events`);
});

app.get("/api/events",async (req,res)=>{
    if (!req.user || !req.user.accessToken) {
        return res.status(401).json({ 
            message: "Not authenticated",
            redirectUrl: `${BACKEND_URL}/auth/google`
        });
    }
    const auth = new google.auth.OAuth2();
    auth.setCredentials({
        access_token: req.user.accessToken,
        refresh_token: req.user.refreshToken
    });
    const calendar = google.calendar({version: 'v3', auth});
    try{
        const response = await calendar.events.list({
            calendarId: 'primary',
            timeMin: new Date().toISOString(),
            maxResults: 10,
            singleEvents: true,
            orderBy: 'startTime',
        });
        const events = response.data.items;
        if (!events || events.length === 0) {
            console.log('No upcoming events found.');
            return res.json({ message: 'No upcoming events found.' });
        }

        console.log('Upcoming 10 events:', events);
        return res.status(201).json({message:"Events extracted successfully",events});
      
    }
    catch(err){
        console.error('Error fetching events:', err.message);
        res.status(500).json({ error: 'Failed to fetch events' });
    }
})

app.delete("/api/events/:eventId", async (req, res) => {
    if (!req.user || !req.user.accessToken) {
        return res.status(401).json({
            message: "Not authenticated",
            redirectUrl: `${BACKEND_URL}/auth/google`
        })
    }

    const auth = new google.auth.OAuth2();
    auth.setCredentials({
        access_token: req.user.accessToken,
        refresh_token: req.user.refreshToken
    });

    const calendar = google.calendar({ version: 'v3', auth });
    
    try {
        await calendar.events.delete({
            calendarId: 'primary',
            eventId: req.params.eventId,
        });
        
        res.status(200).json({ message: "Event deleted successfully" });
    } catch (err) {
        console.error('Error deleting event:', err);
        res.status(500).json({ 
            message: 'Failed to delete event',
            error: err.message 
        })
    }
})


app.get("/logout",(req,res)=>{
    req.logOut();
    req.redirect("/auth/google");
})
app.get('*', (req, res) => {
    res.sendFile(path.resolve(_dirname, "frontend", "dist", "index.html"));
});

app.listen(port, () => {
    console.log(`Server running at ${BACKEND_URL}`);
});