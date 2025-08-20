from flask import Flask, send_file
from io import BytesIO
from PIL import Image
import io

files = [
'./data/mihan.png',
'./data/oleg.png',
'./data/sanek.png',
'./data/serega.png',
'./data/vovan.png',
]

images = []
for file in files:
    images.append(Image.open(file))

app = Flask(__name__)

@app.route('/hello', methods=['GET'])
def hello_world():
    # Create a simple image (original endpoint)
    print("new request received for /hello...")
    img = Image.new('RGB', (200, 200), color='blue')
    img_byte_arr = BytesIO()
    img.save(img_byte_arr, format='PNG')
    img_byte_arr.seek(0)

    return send_file(img_byte_arr, mimetype='image/png')

@app.route('/hello/<id>', methods=['GET'])
def hello_with_id(id):
    # Create a simple image, customized based on id
    print(f"new request received for /hello/{id}...")

    image_id = (int(id) - 1) % len(images)
    image = images[image_id]
    image_byte_arr = BytesIO()
    image.save(image_byte_arr, format='PNG')
    image_byte_arr.seek(0)

    return send_file(image_byte_arr, mimetype='image/png')

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5555)