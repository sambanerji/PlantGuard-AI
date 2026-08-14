import torch
import torch.nn as nn
from torchvision import models, transforms
from PIL import Image
import os

# -----------------------------
# Device
# -----------------------------

device = torch.device("cpu")

# -----------------------------
# Model path
# -----------------------------

MODEL_PATH = os.path.join(
    os.path.dirname(__file__),
    "plant_model.pth"
)

# -----------------------------
# Load trained model
# -----------------------------

checkpoint = torch.load(
    MODEL_PATH,
    map_location=device
)

classes = checkpoint["classes"]

model = models.resnet50(weights=None)

model.fc = nn.Linear(
    model.fc.in_features,
    len(classes)
)

model.load_state_dict(
    checkpoint["model"]
)

model = model.to(device)
model.eval()

# -----------------------------
# Image preprocessing
# -----------------------------

transform = transforms.Compose([
    transforms.Resize((224, 224)),
    transforms.ToTensor()
])

# -----------------------------
# Prediction function
# -----------------------------

def predict(image_path):

    image = Image.open(
        image_path
    ).convert("RGB")

    image = transform(image)

    image = image.unsqueeze(0)

    image = image.to(device)

    with torch.no_grad():

        output = model(image)

        probabilities = torch.softmax(
            output,
            dim=1
        )

        confidence, prediction = torch.max(
            probabilities,
            dim=1
        )

    predicted_class = classes[
        prediction.item()
    ]

    confidence_value = (
        confidence.item() * 100
    )

    return {
        "disease": predicted_class,
        "confidence": round(
            confidence_value,
            2
        )
    }