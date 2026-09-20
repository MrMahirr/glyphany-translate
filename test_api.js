const http = require('http');

const data = JSON.stringify({
  fullName: 'Test User',
  email: 'test@example.com',
  password: 'password123',
  passwordConfirm: 'password123'
});

const options = {
  hostname: 'localhost',
  port: 3000,
  path: '/api/v1/auth/register',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(data)
  }
};

const req = http.request(options, (res) => {
  let responseBody = '';
  res.on('data', (chunk) => { responseBody += chunk; });
  res.on('end', () => {
    console.log('Status:', res.statusCode);
    console.log('Response:', responseBody);
  });
});

req.on('error', (e) => {
  console.error('Request failed:', e.message);
});

req.write(data);
req.end();
