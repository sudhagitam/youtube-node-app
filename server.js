const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

// Google Cloud API and YouTube Playlist Configuration
const API_KEY = 'AIzaSyArFH14uJyyClW_RI5cV52BQweBAK_WTEw';
const PLAYLIST_ID = 'PLdb-URfes6G3mhnXvG-nB_mJ0RZE0CUXL';

// Serve static files from the 'public' folder
app.use(express.static(path.join(__dirname, 'public')));

// Explicit route for root URL to prevent 404 errors on Vercel
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Archive page route (if you have archive.html in public)
app.get('/archive', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'archive.html'));
});

// API Endpoint to fetch YouTube playlist items
app.get('/api/videos', async (req, res) => {
    try {
        const url = `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&maxResults=50&playlistId=${PLAYLIST_ID}&key=${API_KEY}`;
        const response = await fetch(url);
        const data = await response.json();

        if (data.error) {
            console.error("YouTube API Error:", data.error.message);
            return res.json([]);
        }

        const videos = data.items
            .filter(item => item.snippet.title !== "Private video" && item.snippet.title !== "Deleted video")
            .map(item => ({
                id: item.snippet.resourceId.videoId,
                title: item.snippet.title
            }));

        res.json(videos);
    } catch (error) {
        console.error("Server error:", error);
        res.json([]);
    }
});

// Only listen on local environment; export app for Vercel serverless
if (process.env.NODE_ENV !== 'production') {
    app.listen(PORT, () => {
        console.log(`Server running at http://localhost:${PORT}`);
    });
}

module.exports = app;