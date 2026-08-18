# 🌿 PlantGuard AI

### AI-Powered Plant Disease Detection System

PlantGuard AI is a web-based plant disease detection application that uses **deep learning and computer vision** to identify plant diseases from leaf images.

Users can upload a plant leaf image, and the trained **ResNet50** model analyzes the image and returns the predicted disease along with its confidence score.

🔗 **Live Demo:** https://plant-guard-ai-three.vercel.app/

---

##  Features

- 🌿 Upload plant leaf images
-  AI-based disease detection
-  ResNet50 deep learning model
-  Prediction confidence score
-  Image preview before analysis
-  FastAPI-based prediction API
-  Modern React frontend
- Cloud deployment
- ML model hosted separately on Hugging Face

---

##  How It Works

The application follows a simple pipeline:

```text
User uploads leaf image
          ↓
React Frontend
          ↓
FastAPI Backend
          ↓
Image Preprocessing
          ↓
ResNet50 Model
          ↓
Disease Prediction
          ↓
Confidence Score
          ↓
Result displayed to user
🏗️ Project Architecture
PlantGuard-AI/
│
├── backend/
│   ├── app.py
│   ├── predictor.py
│   ├── disease_info.py
│   ├── requirements.txt
│   └── uploads/
│
├── frontend/
│   ├── src/
│   │   ├── App.jsx
│   │   ├── App.css
│   │   ├── index.css
│   │   └── main.jsx
│   │
│   ├── public/
│   ├── package.json
│   └── vite.config.js
│
└── README.md
