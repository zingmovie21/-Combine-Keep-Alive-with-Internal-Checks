const http = require('http');
const https = require('https');
const fs = require('fs');
const path = require('path');

const websiteUrl = 'https://www.vegetablesking.in/logo149.png'; // Replace with your website's image URL
const checkInterval = 14 * 60 * 1000; // 14 minutes in milliseconds

function checkWebsite() {
  console.log('Checking website status...');
  
  const protocol = websiteUrl.startsWith('https') ? https : http;

  protocol.get(websiteUrl, (res) => {
    if (res.statusCode === 200) {
      console.log('Website is live.');
      setTimeout(checkWebsite, checkInterval);
    } else {
      console.log('Website is down. Status code:', res.statusCode);
      setTimeout(checkWebsite, 1000); // Retry after 1 second
    }
  }).on('error', (err) => {
    console.error('Error checking website:', err.message);
    setTimeout(checkWebsite, 1000); // Retry after 1 second
  });
}

// Start the website checking loop
checkWebsite();

// Serve the HTML file
const server = http.createServer((req, res) => {
  if (req.url === '/') {
    fs.readFile(path.join(__dirname, 'index.html'), (err, content) => {
      if (err) {
        res.writeHead(500);
        res.end('Error loading index.html');
      } else {
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(content);
      }
    });
  } else {
    res.writeHead(404);
    res.end('Not found');
  }
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
