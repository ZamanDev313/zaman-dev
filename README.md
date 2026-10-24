
# ZamanDev — Developer Portfolio 🚀

A personal developer portfolio built with React to showcase projects, technical skills, education, certifications, and professional experience. It also includes an admin dashboard for managing portfolio content.

## 🌐 Live Demo

- **Portfolio:** [View Live Portfolio](https://zaman-react-portfolio.vercel.app/)
- **GitHub Repository:** [ZamanDev/zaman-dev](https://github.com/ZamanDev313/zaman-dev)

## ✨ Features

- Responsive portfolio design
- Projects showcase
- Education and certifications sections
- Admin dashboard for portfolio management
- Supabase integration
- PostgreSQL database through Supabase
- Certificate image uploads using Supabase Storage
- Authentication and access control
- Reusable React components
- Environment-based configuration
- Vercel deployment

## 🛠️ Tech Stack

| Technology | Purpose |
|---|---|
| React | Frontend development |
| JavaScript | Application logic |
| HTML5 | Page structure |
| CSS3 | Styling and responsive design |
| React Router | Client-side routing |
| Supabase | Backend services and authentication |
| PostgreSQL | Database |
| Supabase Storage | Certificate image storage |
| Git & GitHub | Version control |
| Vercel | Deployment |

## 📁 Project Structure

```text
zaman-dev/
├── public/
├── src/
│   ├── assets/
│   ├── components/
│   ├── pages/
│   ├── styles/
│   ├── supabaseClient.js
│   ├── App.js
│   └── index.js
├── .gitignore
├── package.json
└── README.md
```

*Note: This is a high-level overview. The final folder structure should match the actual project files.*

## 🚀 Getting Started

### Prerequisites

Make sure you have installed:

- [Node.js](https://nodejs.org/)
- npm
- [Git](https://git-scm.com/)

### 1. Clone the repository

```bash
git clone https://github.com/ZamanDev313/zaman-dev.git
```

### 2. Navigate to the project directory

```bash
cd zaman-dev
```

### 3. Install dependencies

```bash
npm install
```

### 4. Configure environment variables

Create a `.env` file in the project root directory:

```env
REACT_APP_SUPABASE_URL=your_supabase_project_url
REACT_APP_SUPABASE_ANON_KEY=your_supabase_publishable_or_anon_key
```

Replace the example values with your actual Supabase project credentials.

**Security notes:**
- Never commit your `.env` file to GitHub.
- Never expose your Supabase service-role key or secret key in frontend code.
- Configure appropriate Row Level Security (RLS) policies for database access.

### 5. Run the development server

```bash
npm start
```

Open the local URL displayed in your terminal, usually:

http://localhost:3000

## 🏗️ Production Build

To create an optimized production build, run:

```bash
npm run build
```

The generated files will be available in the `build/` directory.

## 🔐 Admin Dashboard

The admin dashboard is designed to make portfolio content management easier without manually editing source code for every update.

Depending on the implemented features, it can support managing projects, education, certifications, and related portfolio content.

Admin access and data changes should be protected through authentication and appropriate Supabase security policies.

## ☁️ Deployment

This project is hosted on Vercel.

To deploy your own version:

1. Import the GitHub repository into Vercel.
2. Configure the required Supabase environment variables in Vercel project settings.
3. Deploy the project.
4. Verify the portfolio pages and admin dashboard.

## 📚 Documentation

Detailed project documentation will be added as the documentation phase progresses.

Planned guides include:

- Project overview
- Application architecture
- Folder structure
- Admin dashboard guide
- Supabase setup
- Security and access policies
- Deployment guide

## 👨‍💻 Author

**Muhammad Zaman Rehmani**

- **GitHub:** [ZamanDev313](https://github.com/ZamanDev313)
- **LinkedIn:** [Muhammad Zaman](https://www.linkedin.com/in/muhammadzaman-dev/)
- **Portfolio:** [zaman-react-portfolio.vercel.app](https://zaman-react-portfolio.vercel.app/)

---

Built with React and a focus on clean, maintainable frontend development.
