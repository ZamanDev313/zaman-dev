
# ZamanDev — Developer Portfolio 🚀

A personal developer portfolio built with React to showcase projects, technical skills, education, certifications, and professional experience. It also includes an admin dashboard for managing portfolio content.

## 🌐 Live Demo

- **Portfolio:** [View Live Portfolio](https://zaman-react-portfolio.vercel.app/)
- **GitHub Repository:** [ZamanDev / zaman-dev](https://github.com/ZamanDev313/zaman-dev)

## ✨ Features

- Responsive portfolio design
- Projects showcase
- Education and certifications sections
- Admin dashboard for portfolio management
- Supabase integration for backend services
- PostgreSQL database through Supabase
- Certificate image uploads using Supabase Storage
- Authentication and access control
- Reusable React components
- Environment-based configuration
- Vercel deployment

## 🛠️ Tech Stack

| Technology | Purpose |
|---|---|
| React 19 | Frontend development |
| JavaScript | Application logic |
| HTML5 | Page structure |
| CSS3 | Styling and responsive design |
| React Router DOM 7 | Client-side routing |
| Bootstrap 5 | UI styling |
| React Bootstrap | Bootstrap components for React |
| React Icons | Icons |
| Supabase JS | Backend services and database integration |
| PostgreSQL | Database |
| Supabase Storage | Certificate image storage |
| EmailJS | Email integration |
| Tailwind CSS 4 | Utility-first CSS tooling |
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
├── package-lock.json
└── README.md
```

*Note: This is a high-level overview. Folder names may be adjusted to match the actual project structure.*

## 🚀 Getting Started

### Prerequisites

Before running the project, install:

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

Create a `.env` file in the project root directory and add your Supabase credentials:

```env
REACT_APP_SUPABASE_URL=your_supabase_project_url
REACT_APP_SUPABASE_ANON_KEY=your_supabase_publishable_or_anon_key
```

Replace the example values with your actual Supabase project values.

**Security guidelines:**

- Never commit your `.env` file to GitHub.
- Never expose a Supabase service-role key or secret key in frontend code.
- Configure appropriate Row Level Security (RLS) policies for database access.
- Protect admin operations with authentication and proper authorization.

### 5. Start the development server

```bash
npm start
```

Open the local URL displayed in your terminal, usually:

http://localhost:3000

## 🏗️ Production Build

Create an optimized production build by running:

```bash
npm run build
```

The generated production files will be available in the `build/` directory.

## 🧪 Testing

Run the test suite with:

```bash
npm test
```

This project uses the Create React App testing environment.

## 🔐 Admin Dashboard

The admin dashboard is designed to make portfolio content management easier without manually editing source code for every update.

Depending on the implemented functionality, portfolio content may include:

- Projects
- Education
- Certifications
- Certificate images

Admin access and data changes should be protected through authentication and appropriate Supabase database and storage policies.

## 🗄️ Supabase Configuration

This project uses Supabase for backend functionality.

The setup may include:

- PostgreSQL database
- Authentication
- Storage for certificate images
- Row Level Security policies

Ensure the required database tables, storage buckets, environment variables, and security policies are configured before using the admin dashboard.

## ☁️ Deployment

The portfolio is deployed through Vercel.

To deploy your own version:

1. Import the GitHub repository into Vercel.
2. Configure the required environment variables in Vercel project settings.
3. Deploy the project.
4. Verify the public portfolio pages.
5. Test admin functionality and Supabase access.

## 📚 Documentation

Detailed project documentation will be added as the documentation phase progresses.

Planned guides:

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
