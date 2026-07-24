// This runs on Vercel's server, NOT in the browser.
// The API key here is read from an environment variable,
// so it is never visible to anyone viewing your site.

module.exports = async function handler(req, res) {
// Only allow POST requests
if (req.method !== "POST") {
return res.status(405).json({ error: "Method not allowed" });
}

const { messages } = req.body;

if (!messages) {
return res.status(400).json({ error: "Missing 'messages' in request body" });
}

const API_KEY = process.env.OPENAI_API_KEY; // set this in Vercel dashboard, not here in code

if (!API_KEY) {
return res.status(500).json({ error: "Server is missing OPENAI_API_KEY" });
}

try {
const response = await fetch("https://api.openai.com/v1/chat/completions", {
method: "POST",
headers: {
"Content-Type": "application/json",
"Authorization": `Bearer ${API_KEY}`,
},
body: JSON.stringify({
model: "gpt-4o-mini",
messages: messages,
}),
});

const data = await response.json();

// Forward OpenAI's status code and body back to the browser
return res.status(response.status).json(data);

} catch (error) {
console.error(error);
return res.status(500).json({ error: "Failed to reach OpenAI API" });
}
}


