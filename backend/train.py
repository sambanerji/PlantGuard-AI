import os
import torch
import torch.nn as nn
import torch.optim as optim

from torchvision import datasets
from torchvision import transforms
from torchvision import models

from torch.utils.data import DataLoader
from torch.utils.data import random_split

from tqdm import tqdm

# ----------------------------
# Configuration
# ----------------------------

DATASET_PATH = "../dataset"

IMAGE_SIZE = 224

BATCH_SIZE = 16

EPOCHS = 5

LEARNING_RATE = 0.001

MODEL_PATH = "plant_model.pth"

# ----------------------------
# Device
# ----------------------------

device = torch.device(
    "cuda" if torch.cuda.is_available() else "cpu"
)

print("\nUsing Device:", device)

# ----------------------------
# Image Transform
# ----------------------------

transform = transforms.Compose([

    transforms.Resize((IMAGE_SIZE, IMAGE_SIZE)),

    transforms.RandomHorizontalFlip(),

    transforms.RandomRotation(20),

    transforms.ToTensor()

])

# ----------------------------
# Load Dataset
# ----------------------------

dataset = datasets.ImageFolder(

    DATASET_PATH,

    transform=transform

)

print("\nDataset Loaded Successfully")

print("Classes:", dataset.classes)

print("Total Images:", len(dataset))

print("Total Classes:", len(dataset.classes))

# ----------------------------
# Train Validation Split
# ----------------------------

train_size = int(0.8 * len(dataset))

val_size = len(dataset) - train_size

train_dataset, val_dataset = random_split(

    dataset,

    [train_size, val_size]

)

train_loader = DataLoader(

    train_dataset,

    batch_size=BATCH_SIZE,

    shuffle=True,

    num_workers=0

)

val_loader = DataLoader(

    val_dataset,

    batch_size=BATCH_SIZE,

    shuffle=False,

    num_workers=0

)

print("Training Images:", len(train_dataset))

print("Validation Images:", len(val_dataset))

# ----------------------------
# Model
# ----------------------------

model = models.resnet50(

    weights=models.ResNet50_Weights.DEFAULT

)

for param in model.parameters():

    param.requires_grad = False

model.fc = nn.Linear(

    model.fc.in_features,

    len(dataset.classes)

)

model = model.to(device)

# ----------------------------
# Loss
# ----------------------------

criterion = nn.CrossEntropyLoss()

optimizer = optim.Adam(

    model.fc.parameters(),

    lr=LEARNING_RATE

)

best_accuracy = 0

# ----------------------------
# Training Loop
# ----------------------------

for epoch in range(EPOCHS):

    print("\n============================")

    print(f"Epoch {epoch+1}/{EPOCHS}")

    print("============================")

    model.train()

    running_loss = 0

    correct = 0

    total = 0

    for images, labels in tqdm(train_loader):

        images = images.to(device)

        labels = labels.to(device)

        optimizer.zero_grad()

        outputs = model(images)

        loss = criterion(outputs, labels)

        loss.backward()

        optimizer.step()

        running_loss += loss.item()

        _, predicted = torch.max(outputs, 1)

        total += labels.size(0)

        correct += (predicted == labels).sum().item()

    train_accuracy = 100 * correct / total

    train_loss = running_loss / len(train_loader)

    # ------------------------
    # Validation
    # ------------------------

    model.eval()

    correct = 0

    total = 0

    with torch.no_grad():

        for images, labels in val_loader:

            images = images.to(device)

            labels = labels.to(device)

            outputs = model(images)

            _, predicted = torch.max(outputs, 1)

            total += labels.size(0)

            correct += (predicted == labels).sum().item()

    validation_accuracy = 100 * correct / total

    print(f"\nTrain Loss : {train_loss:.4f}")

    print(f"Train Accuracy : {train_accuracy:.2f}%")

    print(f"Validation Accuracy : {validation_accuracy:.2f}%")

    # ------------------------
    # Save Best Model
    # ------------------------

    if validation_accuracy > best_accuracy:

        best_accuracy = validation_accuracy

        torch.save({

            "model": model.state_dict(),

            "classes": dataset.classes

        }, MODEL_PATH)

        print("✅ Best Model Saved")

print("\n=================================")

print("Training Finished")

print(f"Best Validation Accuracy : {best_accuracy:.2f}%")

print(f"Model Saved As : {MODEL_PATH}")

print("=================================")