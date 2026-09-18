const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

// Google Cloud API and YouTube Playlist Configuration
const API_KEY = 'AIzaSyArFH14uJyyClW_RI5cV52BQweBAK_WTEw';
const PLAYLISTS = [
    { id: 'PLdb-URfes6G3mhnXvG-nB_mJ0RZE0CUXL', name: 'Bible Teaching' },
    { id: 'PLdb-URfes6G0fvNkrOStD4tMvYKVPXA9y', name: 'Prayer & Fellowship' }
];

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

// API Endpoint to fetch YouTube playlist items from both configured playlists
app.get('/api/videos', async (req, res) => {
    try {
        const playlistResults = await Promise.all(
            PLAYLISTS.map(async (playlist) => {
                const url = `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&maxResults=50&playlistId=${playlist.id}&key=${API_KEY}`;
                const response = await fetch(url);
                const data = await response.json();

                if (data.error) {
                    console.error(`YouTube API Error for playlist ${playlist.name}:`, data.error.message);
                    return [];
                }

                return (data.items || [])
                    .filter(item => item && item.snippet && item.snippet.title !== "Private video" && item.snippet.title !== "Deleted video")
                    .map(item => ({
                        id: item.snippet.resourceId.videoId,
                        title: item.snippet.title,
                        playlist: playlist.name,
                        playlistId: playlist.id
                    }));
            })
        );

        const merged = new Map();
        for (const playlistVideos of playlistResults) {
            for (const video of playlistVideos) {
                if (!merged.has(video.id)) {
                    merged.set(video.id, video);
                }
            }
        }

        const videos = [...merged.values()].sort((a, b) => b.title.localeCompare(a.title));
        const homeVideos = videos.filter(video => video.playlist === 'Bible Teaching');
        res.json(homeVideos.length ? homeVideos : videos);
    } catch (error) {
        console.error("Server error:", error);
        res.json([]);
    }
});

function startServer(port) {
    const server = app.listen(port, () => {
        console.log(`Server running at http://localhost:${port}`);
    });

    server.on('error', (error) => {
        if (error.code === 'EADDRINUSE') {
            const fallbackPort = port + 1;
            console.warn(`Port ${port} is busy. Trying ${fallbackPort} instead.`);
            startServer(fallbackPort);
            return;
        }

        console.error('Server startup error:', error);
        process.exit(1);
    });
}

// Only listen on local environment; export app for Vercel serverless
if (process.env.NODE_ENV !== 'production') {
    startServer(PORT);
}

module.exports = app;