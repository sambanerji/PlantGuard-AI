from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
import shutil
from predictor import predict

app = FastAPI(title="PlantGuard AI")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def home():
    return {
        "status":"Running",
        "project":"PlantGuard AI"
    }

@app.post("/predict")
async def predict_leaf(file: UploadFile = File(...)):

    path = f"uploads/{file.filename}"

    with open(path,"wb") as buffer:
        shutil.copyfileobj(file.file,buffer)

    result = predict(path)

    return result