from flask import Flask, request, send_file
from flask_cors import CORS  # Add this import
import imageio.v3 as iio
import os
from werkzeug.utils import secure_filename

app = Flask(__name__)
CORS(app)  # Add this line to enable CORS for all routes
app.config['UPLOAD_FOLDER'] = 'temp'

# ... rest of your existing code ...
def create_gif(image_paths, output_path, duration=500):
    """Create GIF from images with consistent dimensions"""
    images = []
    first_img = iio.imread(image_paths[0])
    h, w = first_img.shape[:2]
    
    for path in image_paths:
        img = iio.imread(path)
        if img.shape[:2] != (h, w):
            img = iio.imresize(img, (h, w))
        images.append(img)
    
    iio.imwrite(output_path, images, duration=duration, loop=0)

@app.route('/generate-gif', methods=['POST'])
def generate_gif():
    if 'images' not in request.files:
        return {'error': 'No files uploaded'}, 400
    
    files = request.files.getlist('images')
    if len(files) != 2:
        return {'error': 'Please upload exactly 2 images'}, 400
    
    filenames = []
    for file in files:
        filename = secure_filename(file.filename)
        filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        file.save(filepath)
        filenames.append(filepath)
    
    output_path = os.path.join(app.config['UPLOAD_FOLDER'], 'output.gif')
    create_gif(filenames, output_path)
    
    return send_file(output_path, mimetype='image/gif')

if __name__ == '__main__':
    os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)
    app.run(debug=True)