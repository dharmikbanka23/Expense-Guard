require("dotenv").config();
const { OpenAI } = require("openai");
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY});

async function askExpenseGPT(userMessage, user) {

  const completion = await openai.chat.completions.create({
    messages: [
      {
        role: "system",
        content: "Act as a conversational assistant for an expense tracking application. Provide helpful responses and suggestions to users. Address yourself as ExpenseGPT",
      },
      { role: "user", content: `${userMessage}\nPlease provide a short and concise response.`, },
    ],
    model: "gpt-3.5-turbo-0125",
  });

  return completion.choices[0].message.content;
}

module.exports = { askExpenseGPT }