# Easygen Backend

This is the backend of the Easygen application, built with **NestJS** and **MongoDB**. It handles user authentication, session management, and secure password handling. It is using **Mongoose** as ORM & has logging table in database as well for detailed error handling.

## 🔧 Tech Stack

- NestJS
- MongoDB (Mongoose)
- class-validator / class-transformer
- AES-256 encryption
- CORS 
- Logger

## 🚀 Getting Started

### 1. Clone the repo

```bash
git clone https://github.com/zohajamil/easygen-backend.git
```


### 2. Install dependencies

```bash
npm install
```

### 3. Add .env
Create a .env file at the root of project & add the following vars in it as follows:
```bash
PORT='3000'
DOMAIN='http://localhost:5173/'
MONGODB_URI='mongodb://localhost:27017'
MONGODB_DB_NAME="easygen-db"
ENCRYPTION_KEY='l0rokijpr5mv8xcvhhbr3366wza4nnkn'
```

### 4. Run the app
```bash
npm run start:dev
```
The app will start running on http://localhost:3000

## 📁 Folder Structure
```
src/
├── auth/
    ├── auth.controller.ts
    ├── auth.module.ts
    ├── auth.service.ts
├── logging/
    ├── dto
        ├── create-logging.dto.ts
    ├── entities
        ├── logging.entity.ts
        ├── logging.schema.ts
    ├── logging.controller.ts
    ├── logging.module.ts
    ├── logging.repository.ts
    ├── logging.service.ts
├── users/
    ├── dto
        ├── req
        ├── res
    ├── entities
        ├── user.entity.ts
        ├── user.schema.ts
    ├── models
        ├── session.model.ts
    ├── users.controller.ts
    ├── users.module.ts
    ├── users.repository.ts
    ├── users.service.ts
├── utils/
    └── crypto.utils.ts
    └── password.utils.ts
├── app.controller.ts
├── app.module.ts
├── app.service.ts
```

## ✅ Features & Security
- User Signup / Signin
- Session storage in MongoDB
- AES encryption for userId and expiration time (1 hour) for generating token
- Decrytion of payload and checking expiration time for session handling
- CORS restricted to frontend URL for security
- Used bcrypt for password hashing
- Used crypto package for AES encryption