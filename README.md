# Disability Care Management System

## 📌 Project Overview
The **Disability Care Management System** is designed to streamline the workflow for **admins and support workers**, ensuring efficient management of users, tasks, and compliance tracking. This application is built using **NestJS, Angular, MongoDB, and Prisma**, following Agile Scrum methodology.

## 🚀 Features
### ✅ Admin Functionalities:
- User management (create, update, delete accounts)
- Compliance tracking and reporting
- Scheduling and task assignment

### ✅ Support Worker Functionalities:
- Task tracking and real-time updates
- Time management and scheduling
- Notifications for assigned tasks

### ✅ System Features:
- Authentication and role-based access control (JWT)
- Real-time notifications using WebSockets
- Secure data storage with MongoDB and Prisma ORM

## 🛠️ Tech Stack
- **Frontend:** [Nunchucks](https://mozilla.github.io/nunjucks/), [TailwindCSS](https://tailwindcss.com/)
- **Backend:** [Express](https://expressjs.com/), [Prisma ORM](https://www.prisma.io/docs)
- **Database:** [SQLite3](https://www.sqlite.org/)
- **Real-time:** [Socket.IO](https://socket.io/) for notifications
- **Version Control:** [Git](https://git-scm.com/) & [GitHub](https://github.com)
- **Task Management:** [Trello](https://trello.com/)

## 📂 Project Structure
```
/DCMS
├── README.md
├── app.js
├── bin
│   └── www
├── db.js
├── filters
│   ├── abbreviation.js
│   └── randomColor.js
├── middleware
│   ├── auth.middleware.js
│   └── role.middleware.js
├── node_modules/
├── package-lock.json
├── package.json
├── passport.js
├── pnpm-lock.yaml
├── postcss.config.js
├── prisma
│   ├── dev.db
│   ├── dev.db.backup
│   ├── migrations
│   └── schema.prisma
├── public
│   ├── favicon.ico
│   ├── img/
│   ├── javascripts
│   │   ├── index.js
│   │   └── main.js
│   ├── lib/
│   └── stylesheets
│       ├── bootstrap.min.css
│       ├── main.css
│       ├── style.css
│       └── tailwind.css
├── routes
│   ├── admin.js
│   ├── auth.js
│   ├── clients.js
│   ├── index.js
│   ├── supportworker.js
│   ├── tasks.js
│   └── users.js
├── services
│   ├── admin.js
│   ├── auth.js
│   ├── clients.js
│   ├── supportworker.js
│   ├── tasks.js
│   └── users.js
├── src
│   └── input.css
└── views
    ├── about.njk
    ├── admin
    │   └── assign-client.njk
    ├── auth
    │   ├── signin.njk
    │   └── signup.njk
    ├── base.njk
    ├── careplans
    ├── clients
    │   ├── add-care-plan.njk
    │   ├── add-client.njk
    │   ├── add-medical-record.njk
    │   ├── client-list.njk
    │   └── client.njk
    ├── contact.njk
    ├── dashboard.njk
    ├── error.njk
    ├── errors
    │   ├── 403.njk
    │   ├── 404.njk
    │   └── 500.njk
    ├── formsLayout.njk
    ├── home.njk
    ├── index.njk
    ├── partials
    │   ├── _footer.njk
    │   ├── footer.njk
    │   └── navbar.njk
    ├── supportworker
    │   ├── add-supportworker.njk
    │   ├── assign-client.njk
    │   ├── supportworker-list.njk
    │   └── supportworker.njk
    ├── tasks
    │   ├── add-task.njk
    │   ├── task-list.njk
    │   └── task.njk
    └── users
        ├── add-user.njk
        └── users-list.njk
```


## 🛠️ Setup Instructions
### Clone the Repository:
```bash
git clone https://github.com/Keffa-98/DCMS.git
cd DCMS
```

### Install Dependencies:
```bash
npm install
```

### Set Up Environment Variables:
Create a .env file
```bash
PORT=3000
```
### Run the Application:
```
npm run start
```

## 📌 Agile Workflow & Project Management
- Trello: Used for task tracking and sprint planning.
- GitHub: Feature branches mapped to Trello tasks.
- CI/CD: Automated testing and deployment pipelines.

## 🤝 Contributors
- [Keffa Ronoh](https://github.com/Keffa-98) - Backend & API Development
 - [Shadrack Ronoh](https://github.com/ronohbar) - Frontend & UI Development
## 📜 License
This project is licensed under the MIT License.
