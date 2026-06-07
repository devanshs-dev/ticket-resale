from flask import Flask, request, jsonify
from flask_cors import CORS
import numpy as np
import os

app = Flask(__name__)
CORS(app)

def calculate_trust_score(data):
    score = 100
    category_avg = {
        "Concert": 800, "Travel": 600, "Sports": 1500,
        "Movies": 400, "Theatre": 700, "Subscription": 500, "Reservation": 1000
    }
    avg = category_avg.get(data.get("category", "Concert"), 800)
    price = float(data.get("price", 0))
    if price < avg * 0.2: score -= 30
    elif price < avg * 0.4: score -= 15
    description = data.get("description", "")
    if len(description) < 20: score -= 20
    elif len(description) < 50: score -= 10
    seats = data.get("seats", "")
    if not seats or len(seats) < 2: score -= 10
    account_age_days = int(data.get("account_age_days", 30))
    if account_age_days < 1 and price > 2000: score -= 25
    elif account_age_days < 7 and price > 3000: score -= 15
    score = max(0, min(100, score))
    label = "trusted" if score >= 80 else "moderate" if score >= 60 else "suspicious"
    return score, label

@app.route("/")
def home():
    return jsonify({"message": "ML Fraud Detection Service running"})

@app.route("/predict", methods=["POST"])
def predict():
    data = request.json
    score, label = calculate_trust_score(data)
    return jsonify({"trust_score": score, "label": label, "flagged": score < 60})

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=int(os.environ.get("PORT", 5001)), debug=False)
