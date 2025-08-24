import jwt from 'jsonwebtoken'; // ✅ use 'import' instead of 'require'

// Replace with your actual values or load from .env
const JWT_SECRET = 'your_jwt_secret'; // 👈 Replace with your real secret (same as in backend .env)
const userId = '6890a658d482060784f2f159'; // 👈 MongoDB _id of the user you want to generate a token for
const companyCode = 'DB50'; // 👈 Your registered company code

// JWT Payload
const payload = {
  userId,
  companyCode
};

// Sign the token (valid for 1 hour)
const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' });

console.log("\n🔐 Generated JWT Token:\n");
console.log(token);
