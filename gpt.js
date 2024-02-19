require("dotenv").config();
const { query } = require("express");
const { OpenAI } = require("openai");
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY});

async function askExpenseGPT(conversationRecord, username) {

  const defaultMessageRecord = [{
    role: "system",
    content: `Act as a conversational assistant for an expense tracking application. Provide helpful responses and suggestions to users. Address yourself as ExpenseGPT. His username is ${username} Please try to provide a very short and concise response.`,
  }]

  const queryMessage = defaultMessageRecord.concat(conversationRecord);

  const completion = await openai.chat.completions.create({
    messages: queryMessage,
    model: "gpt-3.5-turbo-0125",
  });

  return completion.choices[0].message.content;
}

module.exports = { askExpenseGPT }