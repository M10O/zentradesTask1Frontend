from flask import Flask, jsonify
from flask_cors import CORS
import requests

app = Flask(__name__)
CORS(app) 

@app.route('/')
def index():
    return app.send_static_file('index.html')

@app.route('/products')
def get_products():
    url = "https://s3.amazonaws.com/open-to-cors/assignment.json"
    response = requests.get(url)
    data = response.json()

    # Extract the products from the nested object
    products = list(data['products'].values())

    # Sort products based on popularity
    sorted_products = sorted(products, key=lambda x: int(x['popularity']), reverse=True)

    return jsonify(sorted_products)

if __name__ == '__main__':
    app.run(debug=True)
