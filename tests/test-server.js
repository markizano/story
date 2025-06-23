const http = require('http');
const url = require('url');
const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

const PORT = 3000;

// Mock user data for testing
const mockUser = {
  id: 1,
  username: 'testuser',
  email: 'test@example.com',
  firstName: 'Test',
  lastName: 'User'
};

const BEARER_TOKEN = crypto.randomBytes(64).toString('base64')
const PREG_DATE = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d*)?(?:[-+]\d{2}:?\d{2}|Z)?$/;

// --- Story mock data ---
const stories = require('./stories.json');
const characters = JSON.parse(
  fs.readFileSync(path.resolve(__dirname, './characters.json'), 'utf8'),
  (k, v) => typeof v == 'string' && PREG_DATE.test(v)? new Date(v): v
);

const server = http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url, true);
  const path = parsedUrl.pathname;
  const method = req.method;

  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Content-Type', 'application/json');

  // Handle preflight requests
  if (method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }

  // Log the HTTP request to the console.
  console.log(`${method}: ${path}`);

  const storyIdMatch = path.match(/^\/api\/stories\/(\d+)$/);
  if (storyIdMatch && method === 'GET') {
    const storyId = parseInt(storyIdMatch[1], 10);
    const story = stories.find(s => s.id === storyId);
    if (story) {
      res.writeHead(200);
      res.end(JSON.stringify(story));
    } else {
      res.writeHead(404);
      res.end(JSON.stringify({ error: 'Story not found' }));
    }
    return;
  }

  const characterIdMatch = path.match(/^\/api\/characters\/(\d+)$/);
  if (characterIdMatch && method === 'GET') {
    const characterId = parseInt(characterIdMatch[1], 10);
    const character = characters[characterId];
    if (character) {
      res.writeHead(200);
      res.end(JSON.stringify(character));
    } else {
      res.writeHead(404);
      res.end(JSON.stringify({ error: 'Story not found' }));
    }
    return;
  }

  // Route handling
  switch (path) {
    case '/api/stories/list':
      if ( method == 'GET' ) {
        res.writeHead(200);
        res.end(JSON.stringify(stories));
        return;
      }
    case '/api/characters/list':
      if ( method == 'GET' ) {
        res.writeHead(200);
        res.end(JSON.stringify(characters));
        return;
      }
    case '/api/auth/login':
      if (method === 'POST') {
        let body = '';
        req.on('data', chunk => {
          body += chunk.toString();
        });
        req.on('end', () => {
          try {
            const loginData = JSON.parse(body);
            console.log('Login attempt:', loginData);
            
            // Always return success for testing
            res.writeHead(200);
            res.end(JSON.stringify({
              auth: {
                valid: true,
                token: BEARER_TOKEN,
                expires: new Date( Date.now() + ( 600*1000 )), // JS Date is always in (MS) not (S)
              },
              user: mockUser,
            }));
          } catch (error) {
            res.writeHead(400);
            res.end(JSON.stringify({ error: 'Invalid JSON' }));
          }
        });
      } else {
        res.writeHead(405);
        res.end(JSON.stringify({ error: 'Method not allowed' }));
      }
      break;

    case '/api/auth/status':
      if (method === 'POST') {
        // Always return authenticated for testing
        res.writeHead(201);
        res.end(JSON.stringify({
            auth: {
                valid: true,
                token: BEARER_TOKEN,
                expires: new Date( Date.now() + ( 600*1000 )), // JS Date is always in (MS) not (S)
            },
            user: mockUser
        }));
      } else {
        res.writeHead(405);
        res.end(JSON.stringify({ error: 'Method not allowed' }));
      }
      break;

    case '/api/auth/logout':
      if (method === 'POST') {
        console.log('Logout request received');
        res.writeHead(200);
        res.end(JSON.stringify({
          success: true,
          message: 'Logout successful'
        }));
      } else {
        res.writeHead(405);
        res.end(JSON.stringify({ error: 'Method not allowed' }));
      }
      break;

    case '/api/auth/signup':
      if (method === 'POST') {
        let body = '';
        req.on('data', chunk => {
          body += chunk.toString();
        });
        req.on('end', () => {
          try {
            const signupData = JSON.parse(body);
            console.log('Signup attempt:', signupData);
            
            // Always return success for testing
            res.writeHead(201);
            res.end(JSON.stringify({
              success: true,
              message: 'Account created successfully',
              user: {
                ...mockUser,
                username: signupData.username,
                email: signupData.email,
                firstName: signupData.firstName,
                lastName: signupData.lastName
              }
            }));
          } catch (error) {
            res.writeHead(400);
            res.end(JSON.stringify({ error: 'Invalid JSON' }));
          }
        });
      } else {
        res.writeHead(405);
        res.end(JSON.stringify({ error: 'Method not allowed' }));
      }
      break;

    case '/api/auth/forgot':
      if (method === 'POST') {
        let body = '';
        req.on('data', chunk => {
          body += chunk.toString();
        });
        req.on('end', () => {
          try {
            const forgotData = JSON.parse(body);
            console.log('Forgot password attempt:', forgotData);
            
            // Always return success for testing
            res.writeHead(200);
            res.end(JSON.stringify({
              success: true,
              message: 'Password reset email sent'
            }));
          } catch (error) {
            res.writeHead(400);
            res.end(JSON.stringify({ error: 'Invalid JSON' }));
          }
        });
      } else {
        res.writeHead(405);
        res.end(JSON.stringify({ error: 'Method not allowed' }));
      }
      break;

    default:
      res.writeHead(404);
      res.end(JSON.stringify({ error: 'Not found' }));
  }
});

server.listen(PORT, () => {
  console.log(`Mock authentication server running on http://localhost:${PORT}`);
  console.log('Available endpoints:');
  console.log('  POST /api/login - Always returns success');
  console.log('  GET  /api/auth/status - Always returns authenticated');
  console.log('  POST /api/logout - Always returns success');
  console.log('  POST /api/signup - Always returns success');
  console.log('  POST /api/login/forgot - Always returns success');
  console.log('  GET  /api/story/list - Returns all stories');
  console.log('  GET  /api/story/:id - Returns a single story');
  console.log('');
  console.log('This server is for testing purposes only!');
});

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('\nShutting down server...');
  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
}); 