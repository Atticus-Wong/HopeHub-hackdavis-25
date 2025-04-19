from flask import Flask, request, jsonify
from firebase_config import init_firebase

db = init_firebase()
app = Flask(__name__)
COLLECTION = "clients"

@app.route("/", methods=["GET"])
def home():
    return "🔥 Flask-Firebase Server is running!"


@app.route("/clients", methods=["POST"])
def create_client():
    data = request.get_json()
    uuid = data.get("uuid")
    if not uuid:
        return jsonify({"error": "UUID is required"}), 400

    db.collection(COLLECTION).document(uuid).set(data)
    return jsonify({"message": "Client created"}), 201

@app.route("/clients/<string:uuid>", methods=["GET"])
def get_client(uuid):
    doc = db.collection(COLLECTION).document(uuid).get()
    if not doc.exists:
        return jsonify({"error": "Client not found"}), 404
    return jsonify(doc.to_dict()), 200

@app.route("/clients/<string:uuid>", methods=["PUT"])
def update_client(uuid):
    data = request.get_json()
    db.collection(COLLECTION).document(uuid).update(data)
    return jsonify({"message": "Client updated"}), 200

@app.route("/clients/<string:uuid>", methods=["DELETE"])
def delete_client(uuid):
    db.collection(COLLECTION).document(uuid).delete()
    return jsonify({"message": "Client deleted"}), 200

if __name__ == "__main__":
    app.run(debug=True)
