from flask import Flask, request, jsonify, send_from_directory
import json
import os

app = Flask(__name__, static_folder="web")

DATA_FILE = "data.json"

@app.route("/")
def index():
    return send_from_directory(app.static_folder, "index.html")

@app.route("/<path:path>")
def static_files(path):
    return send_from_directory(app.static_folder, path)

@app.route("/log", methods=["POST"])
def log_entry():
    data = request.get_json()
    
    with open(DATA_FILE, "r") as f:
        logs = json.load(f)
    logs.append(data)

    with open(DATA_FILE, "w") as f:
        json.dump(logs, f, indent=2)

    return jsonify({"status": "success", "logged": data}), 201

@app.route("/entries")
def get_entries():
    with open(DATA_FILE, "r") as f:
        logs = json.load(f)

    return jsonify(logs)

if __name__ == "__main__":
    app.run(debug=True)