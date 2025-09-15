// middlewares/auth0Auth.js
// import { auth } from 'express-oauth2-jwt-bearer';

// export default function auth0Auth(req, res, next) {
//   // 1️⃣ Prefer token from headers
//   let token = req.headers?.authorization?.split(' ')[1];

//   // 2️⃣ Fallback to token in body (dev only)
//   if (!token && req.body?.token) {
//     token = req.body.token;
//     // Temporarily set it in headers so express-oauth2-jwt-bearer can read it
//     req.headers.authorization = `Bearer ${token}`;
//   }

//   if (!token) {
//     return res.status(401).json({ success: false, message: 'No token provided' });
//   }

//   // 3️⃣ Call the standard Auth0 middleware
//   auth({
//     audience: 'https://api.fitnessclub.com',
//     issuerBaseURL: 'https://dev-1de0bowjvfbbcx7q.us.auth0.com/',
//   })(req, res, next);
// }

// src/middlewares/auth0Auth.js

// src/middlewares/auth0Auth.js

// src/middlewares/auth0Auth.js

import { auth } from 'express-oauth2-jwt-bearer';
import dotenv from 'dotenv';

dotenv.config();

const audience = process.env.AUTH0_AUDIENCE || "https://api.fitnessclub.com";
const domain = process.env.AUTH0_DOMAIN || "dev-1de0bowjvfbbcx7q.us.auth0.com";

if (!audience || !domain) {
  console.error('FATAL ERROR: Auth0 environment variables AUTH0_AUDIENCE or AUTH0_DOMAIN are not defined.');
  process.exit(1);
}

const auth0Auth = auth({
  audience: 'https://api.fitnessclub.com',
  issuerBaseURL: 'https://dev-1de0bowjvfbbcx7q.us.auth0.com/',
});

export default auth0Auth;
