# GIF Generator

A web application that allows users to create GIFs from 2 or 3 uploaded images. The application features a React frontend and a Python Flask backend.

![GIF Generator](https://img.shields.io/badge/GIF-Generator-brightgreen) ![Python](https://img.shields.io/badge/Python-3.10%2B-blue) ![React](https://img.shields.io/badge/React-18%2B-61dafb) ![Flask](https://img.shields.io/badge/Flask-2.3%2B-lightgrey)

## 🌐 Live Demo

- **Frontend (Vercel)**: [https://gif-generator-2mxo2vf1v-ve-vaniyas-projects.vercel.app/](https://gif-generator-2mxo2vf1v-ve-vaniyas-projects.vercel.app/)
- **Backend (PythonAnywhere)**: `http://vaniyaejaz.pythonanywhere.com`

## ✨ Features

- Upload 2 or 3 images to create a GIF
- Responsive web design
- Real-time GIF generation
- Download generated GIFs
- Client-side image validation

## 🛠️ Tech Stack

### Frontend
- **React** - JavaScript library for building user interfaces
- **JavaScript** - Programming language
- **HTML** - Markup language
- **CSS** - Styling

### Backend
- **Python** - Programming language
- **Flask** - Web framework
- **ImageIO** - Image processing library
- **Pillow** - Python imaging library
- **Werkzeug** - WSGI utility library

## 📦 Installation

### Prerequisites
- Node.js (for frontend)
- Python 3.13+ (for backend)
- Git

### Frontend Setup
```bash
# Clone the repository
git clone <your-repo-url>
cd gif-generator/frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

### Backend Setup
```bash
# Navigate to backend directory
cd gif-generator/backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# On Windows:
venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt
