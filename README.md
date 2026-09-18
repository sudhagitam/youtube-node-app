### 1. The Folder Structure

Create a new main folder for your project, and inside it, create one subfolder named `public`.

```text
📦 youtube-node-app
 ┣ 📂 public
 ┃ ┣ 📜 index.html
 ┃ ┣ 📜 script.js
 ┃ ┗ 📜 style.css
 ┣ 📜 server.js
 ┗ 📜 package.json

```

### 2. Project Initialization

Open PowerShell, navigate to where you want your project, and run these commands to create the folder structure and install the Express server framework:

```powershell
mkdir youtube-node-app
cd youtube-node-app
mkdir public
npm init -y
npm install express

```

### 3. The Backend Files

**`package.json`**
Open the generated `package.json` file and add the `"start"` command to the `"scripts"` block 
so it looks like this:

```json
{
  "name": "youtube-node-app",
  "version": "1.0.0",
  "main": "server.js",
  "scripts": {
    "start": "node server.js"
  },
  "dependencies": {
    "express": "^4.21.0"
  }
}

```

**`server.js`**
Create this file in the main `youtube-node-app` folder. 
This is your backend that serves your webpage and the daily video data.

```javascript
const express = require('express');
const app = express();
const PORT = 3000;

// Tell the server to load HTML/CSS/JS from the "public" folder
app.use(express.static('public'));

// The API that provides your daily videos
app.get('/api/videos', (req, res) => {
    res.json([
        { id: "djq2LXwenlw", title: "1 Cor 4 14 21 Paul as a Spiritual father" },
        { id: "kJQP7kiw5Fk", title: "Worship Song / Choir" },
        { id: "3tmd-ClpJxA", title: "Group Discussion Study" }
    ]);
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});

```

### 4. The Frontend Files (Inside `public` folder)

**`public/index.html`**
This holds the blueprint of the page. It connects to your separate CSS and JS files.

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Daily Media Portal</title>
    <link rel="stylesheet" href="public/style.css">
</head>
<body>
<header>
    <h1>Daily Media Portal</h1>
</header>
<main class="container">
    <div class="video-player">
        <iframe id="main-player" src="" allowfullscreen></iframe>
    </div>
    <h2 id="video-title">Loading...</h2>

    <h3>Today's Playlist</h3>
    <div id="playlist" class="playlist"></div>
</main>
<script src="public/script.js"></script>
</body>
</html>

```

**`public/style.css`**
This ensures the page looks premium and the video player perfectly scales on mobile phones and desktops (maintaining a 16:9 ratio).

```css
body { 
    font-family: sans-serif; 
    background-color: #121212; 
    color: #ffffff; 
    margin: 0; 
    padding: 20px; 
}
header { text-align: center; margin-bottom: 20px; }
.container { max-width: 900px; margin: 0 auto; }
.video-player { 
    position: relative; 
    padding-bottom: 56.25%; 
    height: 0; 
    margin-bottom: 10px; 
}
.video-player iframe { 
    position: absolute; top: 0; left: 0; 
    width: 100%; height: 100%; 
    border: none; border-radius: 8px; 
}
.playlist { 
    display: grid; 
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); 
    gap: 15px; 
    margin-top: 15px; 
}
.card { 
    background-color: #1e1e1e; 
    border-radius: 6px; padding: 10px; 
    cursor: pointer; 
    transition: transform 0.2s; 
}
.card:hover { transform: translateY(-3px); }
.card img { width: 100%; border-radius: 4px; display: block; }
.card h4 { margin: 10px 0 0 0; font-size: 14px; color: #e0e0e0; }

```

**`public/script.js`**
This logic fetches the videos from `server.js` and builds the clickable playlist dynamically.

```javascript
document.addEventListener("DOMContentLoaded", () => {
    fetch('/api/videos')
        .then(res => res.json())
        .then(videos => {
            if (videos.length === 0) return;
            
            // Set the first video to play immediately
            setVideo(videos[0].id, videos[0].title);
            
            // Build the clickable thumbnails below
            const playlist = document.getElementById('playlist');
            videos.forEach(v => {
                const card = document.createElement('div');
                card.className = 'card';
                card.innerHTML = `
                    <img src="https://img.youtube.com/vi/${v.id}/mqdefault.jpg" alt="Thumbnail">
                    <h4>${v.title}</h4>
                `;
                card.onclick = () => setVideo(v.id, v.title);
                playlist.appendChild(card);
            });
        });
});

function setVideo(id, title) {
    document.getElementById('main-player').src = `https://www.youtube.com/embed/${id}`;
    document.getElementById('video-title').textContent = title;
}

```

### 5. Run the Application

In your PowerShell window, ensure you are inside the `youtube-node-app` folder and run:

```powershell
npm start

```

Open your web browser and navigate to `http://localhost:3000` to view the running application.