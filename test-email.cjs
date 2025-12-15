// Simple Node.js script to test your /api/test-email endpoint (CommonJS version)
// Usage: node test-email.cjs your@email.com

const http = require('http');

const email = process.argv[2];
if (!email) {
  console.error('Usage: node test-email.cjs your@email.com');
  process.exit(1);
}

const data = JSON.stringify({ to: email });

const options = {
  hostname: 'localhost',
  port: 3001,
  path: '/api/test-email',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': data.length,
  },
};

const req = http.request(options, (res) => {
  let body = '';
  res.on('data', (chunk) => { body += chunk; });
  res.on('end', () => {
    console.log('Status:', res.statusCode);
    console.log('Response:', body);
  });
});

req.on('error', (e) => {
  console.error('Problem with request:', e.message);
});

req.write(data);
req.end();
