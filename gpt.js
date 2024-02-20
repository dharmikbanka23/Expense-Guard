require("dotenv").config();
const { OpenAI } = require("openai");
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

async function askExpenseGPT(conversationRecord, username, data) {

  const defaultMessageRecord = [{
    role: "system",
    content: `
      Welcome to Expense Guard. I'm ExpenseGPT, your personal expense tracking assistant. I'm here to provide suggestions and help you to manage your expenses.

      - Username: ${username}
      - Date and Time: ${new Date()}
      - Currency: INR

      Current Month Overview:
      - Total spent: ${data.monthSpent}
      - Budget: ${data.monthBudget}
      - Remaining: ${data.monthRemaining}
      - Predicted monthly spending: ${data.monthPrediction}

      System Health Check:
      - Spending status: "${data.healthCheck}"

      Spending Categories for the Month: ${data.monthCategory}

      Please note:
      - I can provide responses and suggestions to assist you.
      - Avoid asking about previous messages.
      - Keep your questions concise for quicker assistance.

      How can I help you today?
      `,
  }]

  const queryMessage = defaultMessageRecord.concat(conversationRecord);

  const completion = await openai.chat.completions.create({
    messages: queryMessage,
    model: "gpt-3.5-turbo-0125",
  });

  return completion.choices[0].message.content;
}

module.exports = { askExpenseGPT }