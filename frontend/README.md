# FinNewt.bi

A fintech dashboard for tracking and managing personal finances, with AI-assisted insights powered by the Google Gemini API. Built with a secure, full-stack architecture covering authentication, backend APIs, and a responsive frontend.

![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-339933?logo=node.js&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-336791?logo=postgresql&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-2D3748?logo=prisma&logoColor=white)


---

## ✨ Features

- **Secure authentication** — JWT-based login and session handling
- **Finance dashboard** — track income, expenses, and overall financial activity
- **AI-powered insights** — Google Gemini API integration for AI-driven features within the dashboard
- **Modern, responsive UI** — built with shadcn/ui components and Framer Motion animations
- **Global state management** — Zustand for lightweight, predictable client-side state

> _Add 1–2 specific feature details here once finalized — e.g., what exactly the AI insights surface, or specific dashboard views (budget tracker, spending breakdown, etc.)_

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 19, TypeScript, shadcn/ui, Framer Motion |
| State Management | Zustand |
| Backend | Node.js |
| Database / ORM | PostgreSQL, Prisma |
| Authentication | JWT |
| AI Integration | Google Gemini API |
| Deployment | GitHub Pages |


## 🚀 Getting Started

### Prerequisites
- Node.js (v18+ recommended)
- PostgreSQL database (local or hosted)

### Installation

```bash
# Clone the repository
git clone https://github.com/nithishkumar1456-create/<repo-name>.git
cd <repo-name>

# Install dependencies
npm install

# Set up environment variables (see below)
cp .env.example .env

# Run database migrations
npx prisma migrate dev

# Start the development server
npm run dev
```

### Environment Variables

Create a `.env` file in the root directory with the following:

```env
DATABASE_URL=your_postgresql_connection_string
JWT_SECRET=your_jwt_secret_key
GEMINI_API_KEY=your_google_gemini_api_key
```

> _Confirm and update these variable names to match what's actually used in your codebase._

## 📁 Project Structure

```
finnewt.bi/
├── src/
│   ├── components/     # Reusable UI components
│   ├── pages/           # Application pages/routes
│   ├── api/             # Backend API routes
│   ├── lib/              # Utilities, Prisma client, helpers
│   └── store/           # Zustand state stores
├── prisma/
│   └── schema.prisma    # Database schema
└── public/
```

> _Replace with your actual folder structure once you confirm it._

## 👤 Author

**Nithish Kumar G**
Built during a Full-Stack Developer Internship at **SuprMentr Technologies**, in partnership with VTU Belagavi.

- GitHub: [@nithishkumar1456-create](https://github.com/nithishkumar1456-create)

## 📄 License

This project is for educational/portfolio purposes.
