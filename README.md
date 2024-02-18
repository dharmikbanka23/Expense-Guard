# Expense Tracker Project

## Overview

The **Expense Tracker Project** is designed to help individuals manage their expenses effectively. This document provides an overview of the project, including its features, technologies used, and installation instructions.

## Features

- **Expense Entry:** Users can add, edit and delete expenses, that contains details such as amount, category, date, bills and descriptions.
- **Category Management:** Ability to categorize and filter expenses for better understanding.
- **Dashboard Analytics:** View all metrics and find the predictive analysis of your expenses.
- **Monthly Budget Tracking:** Keep track of monthly budgets and compare them with actual spending.
- **Custom Configurations:** Customize budgets and set notification preferences for wellness report.
- **Graphical Reports:** Visualize expense data through charts and graphs.
- **User Authentication:** Secure access with user accounts and authentication.
- **Chat Application:** Chat with random users who are online. [Experimental]

## Technologies Used

- **Frontend:** HTML, CSS, JavaScript
- **Backend:** Node.js, Express.js
- **Database:** MongoDB
- **Storage** Amazon S3
- **Authentication:** JSON Web Tokens (JWT)
- **Frameworks:** Mongoose, JQuery, Multer, Nodemailer, Socket.io, Moment, Google Charts, Stupid Table
- **Unit Testing:** Mocha, Chai, Chai-as-promised, Sinon, Sinon-chai, Supertest, Rewire 

## Installation

1. **Clone the repository:**

   ```bash
   git clone https://github.com/dharmikbanka23/expense-guard.git
   ```
   
2. **Navigate to the project folder:**

   ```bash
   cd expense-guard
   ```
   
3. **Install dependencies:**

   ```bash
   npm install
   ```

4. **Configure the environment variables:**

   Create a .env file in the root directory and add necessary configurations.

   ```.env
   MONGODB_URI='YOUR_MONGODB_ACCESS_STRING'
   
   JWT_SECRET='YOUR_JWT_TOKEN'
   
   EMAIL='YOUR_EMAIL'
   PASSWORD='YOUR_APP_PASSWORD_FOR_EMAIL'
   
   AWS_ACCESS_KEY_ID='YOUR_S3_ACCESS_KEY'
   AWS_SECRET_ACCESS_KEY='YOUR_S3_SECRET_KEY'
   AWS_REGION='YOUR_S3_REGION'
   AWS_S3_BUCKET_NAME='YOUR_S3_BUCKET_NAME'
   ```

6. **Run the application:**
   ```bash
   npm start
   ```

   Visit http://localhost:4000 to access the Expense Guard application.

## Usage

1. **Sign up or log in to your account:**
   
   Visit the application's sign-up or login page to access your account. If you don't have an account, you'll need to sign up to get started.

2. **Add your expenses:**
   
   Once logged in, navigate to the expense entry section. Provide details such as the amount spent, category, date of the expense, bill and description. Save the entry.

3. **View reports:**
   
   Explore the graphical reports section to visualize your spending patterns. Charts and graphs will help you understand where your money is going.

4. **Access dashboard:**

   Get all the important data at one place for better visualization. View the predictive analysis of your spendings.

5. **Track your spending patterns:**
   
   Regularly check the reports to track your expenses against the set budget. Adjust your spending habits accordingly to stay within your financial goals.

6. **Global chat:**

   In the dashboard, you could open up the chat feature and communicate with other users guarding their expenses.

7. **Logout:**
   
   For security, always log out of your account when you're done using the application. This ensures that your financial information remains secure.

## Contributors

- [Banka Dharmik](https://github.com/dharmikbanka23)

## License

This project is licensed under the [MIT License](LICENSE).
