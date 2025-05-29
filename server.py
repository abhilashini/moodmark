from flask import Flask, request, jsonify, send_from_directory, send_file, after_this_request
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

    subprocess.run(["java", "-jar", "build/libs/moodmark-0.1.0-all.jar", "log", "mood", mood], capture_output=True, text=True)

    return jsonify({"status": "ok"})
                    
@app.route("/data.json")
def get_data():
    @after_this_request
    def add_header(response):
        response.headers["Cache-Control"] = 'no-store'
        return response

    return send_file("data.json")

if __name__ == "__main__":
    app.run(debug=True)