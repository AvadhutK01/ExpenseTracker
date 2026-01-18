# Expense Tracker

A full-stack expense tracking application designed to help users manage their finances, track expenses, and view monetary data through interactive graphs.

## Tech Stack

### Frontend
- **HTML5 & CSS3**: Core structure and styling.
- **JavaScript**: Client-side logic and DOM manipulation.
- **Bootstrap**: Responsive design framework.
- **Axios**: HTTP client for API requests.

### Backend
- **Node.js**: JavaScript runtime environment.
- **Express.js**: Web framework for Node.js.
- **Sequelize**: Promise-based Node.js ORM for MySQL.
- **MySQL**: Relational database management system.
- **JWT (JSON Web Tokens)**: Secure user authentication.
- **Razorpay**: Payment gateway integration.
- **AWS SDK**: For S3 storage services.
- **Sendinblue (Brevo)**: For transactional emails (password reset).

## Prerequisites
- [Node.js](https://nodejs.org/) (v14 or higher recommended)
- [MySQL](https://www.mysql.com/) installed and running.

## Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/AvadhutK01/ExpenseTracker.git
   cd ExpenseTracker
   ```

2. **Backend Setup:**
   Navigate to the Backend directory and install dependencies:
   ```bash
   cd Backend
   npm install
   ```

3. **Database Configuration:**
   Ensure you have a MySQL database created. The application will automatically create tables using Sequelize `sync`.

4. **Environment Configuration:**
   Create a `.env` file in the `Backend` directory with the following variables:
   ```env
   PORT=3000
   
   # Database Configuration
   DB_NAME=your_database_name
   DB_CONNECTION_USER=your_db_user
   DB_CONNECTION_PASSWORD=your_db_password
   DB_HOST=localhost

   # JWT Configuration
   SECRETKEY=your_jwt_secret_key

   # Razorpay Configuration
   RAZORPAYKEYID=your_razorpay_key_id
   RAZORPAYSECRET=your_razorpay_secret

   # AWS S3 Configuration
   IAM_USER_KEY=your_aws_access_key
   IAM_USER_SECRET=your_aws_secret_key

   # Email Service (Sendinblue/Brevo)
   FORGETPASSWORDKEY=your_sendinblue_api_key
   FORGET_LINK=http://localhost:3000/ # Base URL for reset link
   ```

## Running the Application

1. **Start the Backend Server:**
   From the root directory or `Backend` directory:
   ```bash
   # From root
   npm start
   
   # OR from Backend
   cd Backend
   npm start
   ```
   The server will start on `http://localhost:3000`.

2. **Access the Application:**
   Open your browser and navigate to `http://localhost:3000` (or `http://localhost:3000/user/login` to start).
   The frontend is served as static files by the Express backend.

## Features
- User Registration and Login.
- Add, Edit, and Delete Expenses.
- Premium Membership integration via Razorpay.
- Leaderboard to see top spenders.
- Download expense reports.
- Visual breakdown of expenses using graphs.
- Password recovery via email.

## Directory Structure
- **Backend/**: Contains API controllers, models, routes, and services.
- **Frontend/**: Contains HTML views, CSS, and client-side JavaScript.
