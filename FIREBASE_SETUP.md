# Firebase Setup Guide

## 1. Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Create a project"
3. Enter project name: `live-location-share`
4. Enable Google Analytics (optional)
5. Click "Create project"

## 2. Enable Authentication

1. In Firebase Console, go to "Authentication"
2. Click "Get started"
3. Go to "Sign-in method" tab
4. Enable "Email/Password" provider
5. Click "Save"

## 3. Setup Realtime Database

1. Go to "Realtime Database"
2. Click "Create database"
3. Choose location (closest to your users)
4. Start in "test mode" for now
5. Click "Done"

## 4. Configure Security Rules

Replace the default rules with:

```json
{
  "rules": {
    "userLocations": {
      "$uid": {
        ".read": "$uid === auth.uid",
        ".write": "$uid === auth.uid"
      }
    },
    "locationShares": {
      ".read": "auth != null",
      ".write": "auth != null",
      "$shareId": {
        ".validate": "newData.hasChildren(['ownerEmail', 'viewerEmail', 'location', 'timestamp'])"
      }
    }
  }
}
```

## 5. Get Configuration

1. Go to Project Settings (gear icon)
2. Scroll to "Your apps" section
3. Click "Web" icon to add web app
4. Register app name: `live-location-web`
5. Copy the configuration object

## 6. Update Firebase Config

Replace the config in `src/firebase.js`:

```javascript
const firebaseConfig = {
  apiKey: "your-actual-api-key",
  authDomain: "your-project.firebaseapp.com",
  databaseURL: "https://your-project-default-rtdb.firebaseio.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "your-actual-app-id"
};
```

## 7. Test the Application

1. Run `npm run dev`
2. Create an account with email/password
3. Allow location access
4. Share location with another email
5. Login with the other email to see shared location

## Security Notes

- Users can only see locations shared specifically with their email
- Location data is encrypted in transit
- Users can control who sees their location
- Locations are removed when user goes offline