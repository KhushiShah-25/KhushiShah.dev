# Khushi Shah — Portfolio
> Full Stack Developer · Bennett University · Greater Noida

Built with **React + Vite**, **React Three Fiber**, **GSAP**, **Node.js**, **Express.js**, and **PostgreSQL**.

---

## 📁 Project Structure

```
khushi-portfolio/
├── portfolio.html          ← Standalone HTML version (deploy directly)
├── frontend/               ← React + Vite app
│   ├── index.html
│   ├── vite.config.js
│   ├── package.json
│   └── src/
│       ├── main.jsx
│       ├── App.jsx
│       ├── App.css
│       ├── styles/
│       │   └── global.css
│       ├── hooks/
│       │   ├── useTheme.js          ← dark/light toggle
│       │   ├── useCursor.js         ← custom cursor tracking
│       │   └── useScrollReveal.js   ← GSAP scroll animations
│       ├── three/
│       │   ├── HeroScene.jsx        ← R3F particle background
│       │   └── PhotoCarousel.jsx    ← R3F 3D revolving carousel
│       └── components/
│           ├── Loader/              ← SVG "KHUSHI SHAH" stroke animation
│           ├── Navbar/              ← Functional nav + mobile drawer
│           ├── Cursor/              ← Custom cursor dot + ring
│           ├── ThemeToggle/         ← Dark ↔ Light toggle button
│           ├── Hero/                ← GSAP entrance + 3D cursor tilt
│           ├── Gallery/             ← Wraps R3F PhotoCarousel
│           ├── Skills/              ← 4-card skill grid
│           ├── About/               ← Code block bio
│           ├── Projects/            ← Fetches from /api/projects
│           ├── Testimonials/        ← Fetches from /api/testimonials
│           ├── FAQ/                 ← Accordion
│           ├── Blog/                ← "How I Built This" devlog timeline
│           ├── Contact/             ← Posts to /api/contact
│           └── Footer/
└── backend/                ← Node.js + Express + PostgreSQL
    ├── server.js
    ├── .env.example
    ├── package.json
    ├── db/
    │   └── schema.sql       ← Run this to set up tables + seed data
    └── routes/
        ├── projects.js
        ├── contact.js
        └── testimonials.js
```

---

## 🚀 Quick Start

### Option A — Standalone HTML (Zero setup)
Just open `portfolio.html` in any browser. Everything is self-contained.

---

### Option B — Full React + Backend Stack

#### 1. Clone & install

```bash
# Frontend
cd frontend
npm install

# Backend
cd ../backend
npm install
cp .env.example .env
# Edit .env with your PostgreSQL credentials
```

#### 2. Set up PostgreSQL

```bash
# Create the database
psql -U postgres -c "CREATE DATABASE khushi_portfolio;"

# Run the schema (creates tables + seeds data)
psql -U postgres -d khushi_portfolio -f backend/db/schema.sql
```

#### 3. Run both servers

```bash
# Terminal 1 — Backend (port 5000)
cd backend
npm run dev

# Terminal 2 — Frontend (port 5173)
cd frontend
npm run dev
```

Open **http://localhost:5173**

---

## 🌐 Deployment

| Service  | What to deploy          | Notes                              |
|----------|-------------------------|------------------------------------|
| Vercel   | `frontend/`             | Set `VITE_API_URL` env var         |
| Railway  | `backend/`              | Add PostgreSQL plugin for free DB  |
| Supabase | PostgreSQL database only| Paste connection string in `.env`  |

---

## 🎨 Features

| Feature | Implementation |
|---------|---------------|
| SVG loader | Stroke-dashoffset animation per letter via GSAP |
| Theme toggle | CSS `[data-theme]` custom properties + localStorage |
| 3D cursor photo | rAF lerp tracking → CSS `rotateX/Y` |
| 3D photo carousel | React Three Fiber — 10 cards on a cylinder |
| Hero particles | R3F `<points>` with animated rotation |
| Scroll reveals | GSAP ScrollTrigger via `useScrollReveal` hook |
| Contact form | Posts to Express `/api/contact` → saved to PostgreSQL |
| Functional navbar | Smooth scroll, active section detection, mobile drawer |
| Dark/Light theme | CSS variables, instant switch, persisted to localStorage |

---

## 🛠 Customising

### Add your photo
In `frontend/src/components/Hero/Hero.jsx`, replace:
```jsx
<div className={styles.initials}>KS</div>
```
with:
```jsx
<img src="/your-photo.jpg" alt="Khushi Shah" style={{ width:'100%', height:'100%', objectFit:'cover' }} />
```

### Add gallery photos
In `frontend/src/three/PhotoCarousel.jsx`, each slide has a `c-photo-placeholder`.
Replace the `<Text>KS</Text>` element with:
```jsx
<mesh>
  <planeGeometry args={[2.2, 3.2]} />
  <meshBasicMaterial map={useTexture('/photos/photo-01.jpg')} />
</mesh>
```

### Add your email
Update `backend/.env`:
```
SMTP_HOST=smtp.gmail.com
SMTP_USER=yourname@gmail.com
SMTP_PASS=your-app-password
CONTACT_EMAIL=yourname@gmail.com
```

---

## 📦 Tech Stack

| Layer      | Technology                    |
|------------|-------------------------------|
| Frontend   | React 18, Vite 5              |
| 3D         | React Three Fiber, Three.js   |
| Animation  | GSAP + ScrollTrigger          |
| Styling    | CSS Modules + Custom Props    |
| Backend    | Node.js, Express.js           |
| Database   | PostgreSQL (via `pg`)         |
| Deployment | Vercel + Railway              |

---

*Made with ♥ by Khushi Shah — Bennett University, Greater Noida*
