# 🦜 Language Translator

A modern language translation application with speech recognition capabilities. Parrot Translator allows users to translate text between multiple languages and includes voice input functionality for seamless communication.

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Running the Application](#running-the-application)
- [Project Structure](#project-structure)
- [API Endpoints](#api-endpoints)
- [Environment Variables](#environment-variables)
- [Contributing](#contributing)
- [License](#license)

## ✨ Features

- **Text Translation**: Translate text between multiple languages
- **Speech Recognition**: Voice input support for hands-free translation
- **Real-time Translation**: Fast and accurate translations using Google Translate API
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
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **Google Translate API** - Translation service
- **CORS** - Cross-origin resource sharing
- **dotenv** - Environment variable management

## 📋 Prerequisites

Before running this application, make sure you have:

- **Node.js** (version 16.0 or higher)
- **npm** or **yarn** package manager
- **Google Cloud Platform account** (for Google Translate API access)

## 🚀 Installation

1. **Clone the repository**
   ```bash
   git clone <your-repository-url>
   cd parrot-translator
   ```

2. **Install backend dependencies**
   ```bash
   cd parrot-backend
   npm install
   ```

3. **Install frontend dependencies**
   ```bash
   cd ../parrot-frontend
   npm install
   ```

4. **Set up environment variables**
   
   Create a `.env` file in the `parrot-backend` directory:
   ```env
   PORT=5000
   GOOGLE_TRANSLATE_API_KEY=your_google_translate_api_key_here
   ```

## 🏃‍♂️ Running the Application

### Development Mode

1. **Start the backend server**
   ```bash
   cd parrot-backend
   npm run dev
   ```
   The backend will run on `http://localhost:5000`

2. **Start the frontend development server**
   ```bash
   cd parrot-frontend
   npm run dev
   ```
   The frontend will run on `http://localhost:5173`

### Production Mode

1. **Build the frontend**
   ```bash
   cd parrot-frontend
   npm run build
   ```

2. **Start the backend server**
   ```bash
   cd parrot-backend
   npm start
   ```

## 📁 Project Structure

```
parrot-translator/
│
├── parrot-frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── public/
│   ├── package.json
│   ├── vite.config.js
│   └── tailwind.config.js
│
├── parrot-backend/
│   ├── app.js
│   ├── package.json
│   └── .env
│
└── README.md
```

## 🔌 API Endpoints

### Translation Endpoint
- **POST** `/api/translate`
  - **Body**: 
    ```json
    {
      "text": "Hello world",
      "from": "en",
      "to": "es"
    }
    ```
  - **Response**: 
    ```json
    {
      "translatedText": "Hola mundo",
      "originalText": "Hello world",
      "from": "en",
      "to": "es"
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

## 🔐 Environment Variables

Create a `.env` file in the `parrot-backend` directory with the following variables:

| Variable | Description | Required |
|----------|-------------|----------|
| `PORT` | Port number for the backend server | No (default: 5000) |
| `GOOGLE_TRANSLATE_API_KEY` | Google Translate API key | Yes |
| `NODE_ENV` | Environment mode (development/production) | No |

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
- Verify Google Translate API key is valid
- Check internet connection
- Review API quotas and billing settings

**Speech recognition not working:**
- Ensure microphone permissions are granted
- Use HTTPS in production (required for speech recognition)
- Check browser compatibility

## 📄 License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Google Translate API for translation services
- React Speech Recognition library for voice input
- Tailwind CSS for styling utilities
- The open-source community for various packages and tools

## 📞 Support

If you encounter any issues or have questions, please:
1. Check the troubleshooting section above
2. Search existing issues on GitHub
3. Create a new issue with detailed information

---

**Made with ❤️ and 🦜 by [Your Name]**
