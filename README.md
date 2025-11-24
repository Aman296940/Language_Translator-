# Language Translator

A modern web application for translating text between multiple languages with real-time speech recognition support. Built with React and deployed on Vercel.

## Live Demo

🌐 [View Live App](https://language-translator-navy-rho.vercel.app)

## Features

- **Real-time Translation**: Translate text between 10+ languages instantly
- **Voice Input**: Use your microphone to speak and get instant transcription
- **Text Input**: Manual text input option for typing translations
- **Speech Output**: Hear translations spoken back to you
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Modern UI**: Clean interface built with Tailwind CSS

## Tech Stack

### Frontend
- React 18.3.0
- Vite
- Tailwind CSS
- React Speech Recognition
- React Icons

### Backend
- Vercel Serverless Functions
- Google Translate API X (unofficial, no API key required)

## Getting Started

### Prerequisites
- Node.js 16+ 
- npm or yarn

### Installation

1. Clone the repository
```bash
git clone https://github.com/Aman296940/Language_Translator-.git
cd Language_translator
```

2. Install dependencies
```bash
npm install
cd client && npm install
cd ../server && npm install
```

3. Run locally
```bash
# From root directory
npm run dev
```

This starts:
- Backend server on `http://localhost:5000`
- Frontend dev server on `http://localhost:5173`

## Deployment

The app is configured for Vercel deployment. Simply:

1. Push to GitHub
2. Import repository on Vercel
3. Deploy

The `vercel.json` configuration handles everything automatically.

## Project Structure

```
Language_translator/
├── api/              # Vercel serverless functions
│   ├── translate.js
│   └── health.js
├── client/           # React frontend
│   ├── src/
│   │   ├── components/
│   │   ├── hooks/
│   │   └── App.jsx
│   └── package.json
├── server/           # Local dev server (optional)
├── vercel.json       # Vercel config
└── package.json
```

## API Endpoints

### Translate
```
GET /api/translate?q=text&to=lang&from=lang
```

### Health Check
```
GET /api/health
```

## Usage

1. Select source and target languages
2. Click microphone button to start voice input
3. Speak clearly into your microphone
4. View transcribed text and translation
5. Or type text manually in the input field

## Browser Support

- Chrome (recommended)
- Edge
- Safari (limited)
- Firefox (limited)

Speech recognition requires HTTPS (automatically provided by Vercel).

## License

MIT License

## Author

Aman296940

---

Built with React and deployed on Vercel.
