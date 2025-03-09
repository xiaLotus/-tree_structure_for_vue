from flask import Flask, request, jsonify
from flask_cors import CORS
import json

app = Flask(__name__)
CORS(app)

# 設定 JSON 檔案存放路徑
TREE_DATA_FILE = "tree_data.json"

# ✅ API：儲存 `treeData` 到 JSON 檔案
@app.route('/save_tree_data', methods=['POST'])
def save_tree_data():
    try:
        data = request.json  # 取得前端送來的 JSON
        with open(TREE_DATA_FILE, "w", encoding="utf-8") as f:
            json.dump(data, f, indent=2, ensure_ascii=False)  # 儲存 JSON
        return jsonify({"message": "樹狀結構已儲存！"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
# ✅ API：讀取 `treeData`，回傳給前端


@app.route('/load_tree_data', methods=['GET'])
def load_tree_data():
    import os
    if os.path.exists(TREE_DATA_FILE):  # 確保檔案存在
        with open(TREE_DATA_FILE, "r", encoding="utf-8") as f:
            data = json.load(f)
        return jsonify(data), 200
    return jsonify({"message": "沒有儲存的樹狀結構"}), 404

if __name__ == '__main__':
    app.run(debug=True, port=5000)