# 🦜 Language Translator

A modern language translation application with speech recognition capabilities. Translate text between multiple languages with voice input support.

## 🚀 Live Demo

Deployed on Vercel: [language-translator-navy-rho.vercel.app](https://language-translator-navy-rho.vercel.app)

## ✨ Features

- **Text Translation**: Translate text between multiple languages
- **Speech Recognition**: Voice input support for hands-free translation
- **Real-time Translation**: Fast and accurate translations
- **Responsive Design**: Modern UI built with React and Tailwind CSS
- **Cross-platform**: Works on desktop and mobile devices

## 🛠️ Tech Stack

### Frontend
- **React** 18.3.0 - UI library
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **React Icons** - Icon library
- **React Speech Recognition** - Speech-to-text functionality

### Backend
- **Vercel Serverless Functions** - API endpoints (production)
- **Node.js** - Runtime environment (local development)
- **Express.js** - Web framework (local development)
- **Google Translate API X** - Translation service

## 📋 Prerequisites

Before running this application, make sure you have:

- **Node.js** (version 16.0 or higher)
- **npm** or **yarn** package manager

## 🚀 Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Aman296940/Language_Translator-.git
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

## 🔌 API Endpoints

### Translation Endpoint

- **GET** `/api/translate?q=text&to=lang&from=lang` - Translate text
  - **Query Parameters**:
    - `q` (required): Text to translate
    - `to` (required): Target language code (e.g., 'es', 'fr', 'de')
    - `from` (optional): Source language code (default: auto-detect)
  - **Response**:
    ```json
    {
      "result": "Translated text",
      "detected": "en"
    }
    ```

### Health Check

- **GET** `/api/health`
  - **Response**:
    ```json
    {
      "status": "OK",
      "timestamp": "2024-01-01T00:00:00.000Z"
    }
    ```

## 📝 Notes

- The `server/` directory is only used for local development
- Production uses Vercel serverless functions in the `api/` directory
- No API keys or environment variables required for deployment
- Works on Vercel's free tier

## 🎯 Usage

1. Open the application in your browser
2. Select source and target languages from the dropdowns
3. Enter text manually or use the microphone button for voice input
4. View the translated text in real-time
5. Copy or share the translation as needed

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Development Guidelines

- Follow ESLint configuration for code formatting
- Write descriptive commit messages
- Add comments for complex logic
- Test your changes thoroughly
- Update documentation as needed

## 🐛 Troubleshooting

### Common Issues

**Backend not starting:**
- Check if the port is already in use
- Verify environment variables are set correctly
- Ensure all dependencies are installed

**Translation not working:**
- Check internet connection
- Review API quotas and billing settings (if using official Google Translate API)
- For Vercel deployment, ensure the `api/` directory functions are properly deployed

**Speech recognition not working:**
- Ensure microphone permissions are granted
- Use HTTPS in production (required for speech recognition)
- Check browser compatibility (Chrome/Edge recommended)

## 📄 License

This project is licensed under the MIT License. See the LICENSE file for details.

## 🙏 Acknowledgments

- Google Translate API X for translation services
- React Speech Recognition library for voice input
- Tailwind CSS for styling utilities
- The open-source community for various packages and tools

## 📞 Support

If you encounter any issues or have questions, please:

1. Check the troubleshooting section above
2. Search existing issues on GitHub
3. Create a new issue with detailed information

---

**Made with ❤️ and 🦜**
