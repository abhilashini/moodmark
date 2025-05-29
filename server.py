from flask import Flask, request, jsonify, send_from_directory
import subprocess
import json

app = Flask(__name__, static_folder="web")

DATA_FILE = "data.json"

@app.route("/")
def root():
    return send_from_directory(app.static_folder, "index.html")

@app.route("/<path:path>")
def static_proxy(path):
    return send_from_directory(app.static_folder, path)

@app.route("/log", methods=["POST"])
def log_mood():
    data = request.get_json()
    mood = data.get("mood", "neutral")

    subprocess.run(["./moodmark", "log", "mood", mood])

    return jsonify({"status": "ok"})
                    
@app.route("/data.json")
def get_data():
    return send_from_directory(".", "data.json")

if __name__ == "__main__":
    app.run(debug=True)