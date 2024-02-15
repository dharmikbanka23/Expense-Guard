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
- **Frameworks:** Mongoose, JQuery, Multer, Nodemailer, Socket.io

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
   JWT_SECRET='YOUR_JWT_TOKEN'
   
   EMAIL='YOUR_EMAIL'
   PASSWORD='YOUR_APP_PASSWORD_FOR_EMAIL'
   
   AWS_ACCESS_KEY_ID='YOUR_S3_ACCESS_KEY'
   AWS_SECRET_ACCESS_KEY='YOUR_S3_SECRET_KEY'
   AWS_REGION='YOUR_S3_REGION'
   AWS_S3_BUCKET_NAME='YOUR_S3_BUCKET_NAME'
   ```

5. **Run the application:**
