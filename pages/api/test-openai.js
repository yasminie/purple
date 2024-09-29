// pages/api/test-openai.js

const { Configuration, OpenAIApi } = require('openai');

console.log('Configuration:', Configuration);
console.log('OpenAIApi:', OpenAIApi);

export default async function handler(req, res) {
  res.status(200).json({ message: 'Test route is working.' });
}
