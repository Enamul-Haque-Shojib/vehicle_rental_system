
## Project Name: 
### Vehicle Rental System

### 🔗 Live API
Base URL: [https://ass2-one.vercel.app/](https://ass2-one.vercel.app/)


### 🚀 Key Features
- There are two roles, admin and customer
- admin can add, update, delete vehicle, vehicle will be delete when there are no booking active on that vehicle
- admin can update and delete customer, customer can delete if there are no booking active on that customer
- admin and customer both can booking any vehicle
- admin can returned the vehicle by updating booking
- customer can cancelled the vehicle by updating booking
- admin and customer can their access by token
- without token will be unauthorized 


### 🛠 Tech Stack
#### BackEnd
- Express.js
- TypeScript
- pg
- PostgreSQL
- tsx (for dev server)
- vercel (deployment)
- dotenv
- jwt

### ⚙️ Setup Guide

1. Clone the repo:
   ```bash
   git clone https://github.com/Enamul-Haque-Shojib/movie-series-rating-client.git
   cd movie-series-rating-client
2. Install dependencies:
    ```bash
    npm install
3. Set up .env file:
    ```env
    CONNECTION_STR, PORT, JWT_SECRET
4. Start the server:
    ```bash
    npm run dev
5. The server will run on https://ass2-one.vercel.app/ by default.