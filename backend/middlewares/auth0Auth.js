// middlewares/auth0Auth.js
import { auth } from 'express-oauth2-jwt-bearer';

export default auth({
  audience: 'https://api.fitnessclub.com',
  issuerBaseURL: 'https://dev-1de0bowjvfbbcx7q.us.auth0.com/',
});
