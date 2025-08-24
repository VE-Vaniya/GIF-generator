from flask import Flask, request, send_file, jsonify
from flask_cors import CORS
import imageio.v3 as iio
import os
from werkzeug.utils import secure_filename
from PIL import Image

app = Flask(__name__)
CORS(app)

# Use absolute path for production
app.config['UPLOAD_FOLDER'] = os.path.join(os.getcwd(), 'temp')
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024  # 16MB limit

# Create upload folder if it doesn't exist
os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)

ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'webp'}

def allowed_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def validate_images(image_paths):
    # Check dimensions
    dimensions = []
    for path in image_paths:
        with Image.open(path) as img:
            dimensions.append(img.size)
    
    if len(set(dimensions)) > 1:
        return False, "Please add images having same dimensions"
    
    return True, ""

def create_gif(image_paths, output_path, duration=500):  # Keep 500ms as in first version
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
        return jsonify({'error': 'No files uploaded'}), 400
    
    files = request.files.getlist('images')
    if len(files) < 2:
        return jsonify({'error': 'Please upload at least 2 images'}), 400
    
    filenames = []
    for file in files:
        if file.filename == '':
            continue
        if not allowed_file(file.filename):
            return jsonify({'error': 'Only JPG, PNG, or WEBP images are allowed'}), 400
        if file.filename.lower().endswith('.gif'):
            return jsonify({'error': 'GIF files cannot be used as input'}), 400
        
        filename = secure_filename(file.filename)
        filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        file.save(filepath)
        filenames.append(filepath)
    
    # Validate image dimensions
    valid, message = validate_images(filenames)
    if not valid:
        # Clean up uploaded files
        for filepath in filenames:
            try:
                os.remove(filepath)
            except:
                pass
        return jsonify({'error': message}), 400
    
    output_path = os.path.join(app.config['UPLOAD_FOLDER'], 'output.gif')
    try:
        create_gif(filenames, output_path)
        return send_file(output_path, mimetype='image/gif')
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    finally:
        # Clean up uploaded files
        for filepath in filenames:
            try:
                os.remove(filepath)
            except:
                pass

# Use this for production (PythonAnywhere)
if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port)
