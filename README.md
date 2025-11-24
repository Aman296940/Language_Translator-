# 🦜 Language Translator

A modern language translation application with speech recognition capabilities. Translate text between multiple languages with voice input support.

## 🚀 Live Demo

Deployed on Vercel: [Your Vercel URL]

## ✨ Features

- **Text Translation**: Translate text between multiple languages
- **Speech Recognition**: Voice input support for hands-free translation
- **Real-time Translation**: Fast and accurate translations
- **Responsive Design**: Modern UI built with React and Tailwind CSS
- **Cross-platform**: Works on desktop and mobile devices

## 🛠️ Tech Stack

### Frontend
- **React** 18.3.0
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **React Speech Recognition** - Voice input

### Backend
- **Vercel Serverless Functions** - API endpoints
- **Google Translate API X** - Translation service

## 📋 Local Development

### Prerequisites
- Node.js (version 16.0 or higher)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repository-url>
   cd Language_translator
   ```

2. **Install dependencies**
   ```bash
   # Install root dependencies (for API functions)
   npm install
   
   # Install client dependencies
   cd client && npm install
   
   # Install server dependencies (for local dev)
   cd ../server && npm install
   ```

3. **Run the application**
   ```bash
   # From root directory
   npm run dev
   ```
   
   This will start:
   - Backend server on `http://localhost:5000`
   - Frontend dev server on `http://localhost:5173`

## 🌐 Deployment on Vercel

This project is configured for easy deployment on Vercel (free tier).

### Steps to Deploy

1. **Push your code to GitHub**
   ```bash
   git add .
   git commit -m "Ready for deployment"
   git push origin main
   ```

2. **Deploy on Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Import your GitHub repository
   - Vercel will auto-detect the configuration
   - Click "Deploy"

3. **That's it!** Your app will be live in minutes.

### Project Structure for Vercel

```
Language_translator/
├── api/                 # Vercel serverless functions
│   ├── translate.js     # Translation endpoint
│   └── health.js        # Health check endpoint
├── client/              # React frontend
│   ├── src/
│   ├── dist/           # Build output (generated)
│   └── package.json
├── server/              # Local dev server (not used in production)
├── vercel.json          # Vercel configuration
└── package.json         # Root dependencies
```

### API Endpoints

- **GET** `/api/translate?q=text&to=lang&from=lang` - Translate text
- **GET** `/api/health` - Health check

## 📝 Notes

- The `server/` directory is only used for local development
- Production uses Vercel serverless functions in the `api/` directory
- No API keys or environment variables required
- Works on Vercel's free tier

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is open source and available under the MIT License.
