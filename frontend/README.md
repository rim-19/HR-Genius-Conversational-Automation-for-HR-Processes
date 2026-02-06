# HR-Genius Frontend

A modern, AI-powered HR management interface built with React, TypeScript, and TailwindCSS.

## 🚀 Features

- **AI Assistant**: Conversational interface for HR tasks with real-time chat
- **Employee Management**: View, add, edit, and manage employee records
- **Document Generation**: AI-powered document creation (certificates, letters, etc.)
- **Modern UI**: Beautiful, responsive design with animations and micro-interactions
- **Professional Design**: Light pink and light blue color scheme with Poppins/Inter fonts

## 📋 Prerequisites

- Node.js (v18 or higher)
- npm or yarn

## 🛠️ Installation

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

## 🏃 Running the Application

Start the development server:
```bash
npm run dev
```

The application will open automatically at `http://localhost:3000`

## 📦 Build for Production

```bash
npm run build
```

The production-ready files will be in the `dist` directory.

## 🎨 Tech Stack

- **React 18** - UI library
- **TypeScript** - Type safety
- **TailwindCSS** - Styling
- **Framer Motion** - Animations
- **React Router** - Navigation
- **React Query** - Data fetching
- **Axios** - HTTP client
- **React Toastify** - Notifications
- **React Icons** - Icon library

## 📁 Project Structure

```
frontend/
├── public/              # Static assets
├── src/
│   ├── assets/         # Images, fonts, etc.
│   ├── components/     # Reusable components
│   │   ├── ChatbotUI.tsx
│   │   ├── EmployeeCard.tsx
│   │   ├── Navbar.tsx
│   │   └── Sidebar.tsx
│   ├── context/        # React context providers
│   │   └── AuthContext.tsx
│   ├── hooks/          # Custom React hooks
│   │   └── useFetch.ts
│   ├── layouts/        # Layout components
│   │   ├── AuthLayout.tsx
│   │   └── MainLayout.tsx
│   ├── pages/          # Page components
│   │   ├── Assistant.tsx
│   │   ├── Dashboard.tsx
│   │   ├── Documents.tsx
│   │   ├── Employees.tsx
│   │   ├── Login.tsx
│   ├── services/       # API services
│   │   └── api.ts
│   ├── styles/         # Global styles
│   │   └── index.css
│   ├── App.tsx         # Main app component
│   ├── main.tsx        # Entry point
│   └── router.tsx      # Route definitions
├── index.html
├── package.json
├── tailwind.config.js
├── tsconfig.json
└── vite.config.ts
```

## 🔌 Backend Integration

The frontend is designed to connect to a backend API. Update the API base URL in `src/services/api.ts`:

```typescript
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api',
});
```

### API Endpoints (To be implemented in backend)

- `POST /api/auth/login` - User authentication
- `GET /api/employees` - Fetch employees
- `POST /api/employees` - Create employee
- `POST /api/assistant/chat` - Send message to AI
- `GET /api/documents` - Fetch documents
- `POST /api/documents/generate` - Generate document

## 🎯 Demo Credentials

For the demo version, you can login with any email and password. The app uses mock data for demonstration purposes.

## 🎨 Customization

### Colors

Edit `tailwind.config.js` to customize the color scheme:

```javascript
colors: {
  primary: { /* Light blue shades */ },
  secondary: { /* Light pink shades */ },
}
```

### Fonts

The app uses Google Fonts (Poppins and Inter). These are imported in `src/styles/index.css`.

## 📝 Environment Variables

Create a `.env` file in the frontend directory:

```env
VITE_API_URL=http://localhost:3000/api
```

## 🐛 Known Issues

- All lint errors related to missing modules will resolve after running `npm install`
- The Tailwind `@apply` warnings in CSS are expected and can be ignored

## 🤝 Contributing

1. Create a feature branch
2. Make your changes
3. Test thoroughly
4. Submit a pull request

## 📄 License

This project is part of the HR-Genius system.

## 🆘 Support

For issues or questions, please create an issue in the repository.
