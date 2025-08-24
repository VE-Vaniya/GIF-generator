import { useState } from 'react';
import './index.css';

function App() {
  const [file1, setFile1] = useState(null);
  const [file2, setFile2] = useState(null);
  const [file3, setFile3] = useState(null);
  const [gifUrl, setGifUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const validateImage = (file) => {
    if (!file) return true;
    const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      return 'Only JPG, PNG, or WEBP images are allowed';
    }
    if (file.name.toLowerCase().endsWith('.gif')) {
      return 'GIF files cannot be used as input';
    }
    return null;
  };

  const handleFile1Change = (e) => {
    const file = e.target.files[0];
    const error = validateImage(file);
    if (error) {
      setError(error);
      e.target.value = ''; // Clear the file input
      setFile1(null);
    } else {
      setFile1(file);
      setError('');
    }
  };

  const handleFile2Change = (e) => {
    const file = e.target.files[0];
    const error = validateImage(file);
    if (error) {
      setError(error);
      e.target.value = ''; // Clear the file input
      setFile2(null);
    } else {
      setFile2(file);
      setError('');
    }
  };

  const handleFile3Change = (e) => {
    const file = e.target.files[0];
    if (!file) {
      setFile3(null);
      return;
    }
    const error = validateImage(file);
    if (error) {
      setError(error);
      e.target.value = ''; // Clear the file input
      setFile3(null);
    } else {
      setFile3(file);
      setError('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!file1 || !file2) {
      setError('Please select at least two images');
      return;
    }

    setLoading(true);
    setError('');
    
    const formData = new FormData();
    formData.append('images', file1);
    formData.append('images', file2);
    if (file3) {
      formData.append('images', file3);
    }

    try {
      const response = await fetch('vaniyaejaz.pythonanywhere.com/generate-gif', {  
        method: 'POST',
        body: formData,
        mode: 'cors',
        headers: {
          'Accept': 'application/json',
        },
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to generate GIF');
      }
      
      const blob = await response.blob();
      setGifUrl(URL.createObjectURL(blob));
    } catch (error) {
      console.error(error);
      setError(error.message || 'Error generating GIF. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <h1>GIF Generator</h1>
      <form onSubmit={handleSubmit}>
        <div className="file-inputs">
          <div className="file-input-group">
            <label>First Image (Required):</label>
            <input 
              type="file" 
              accept="image/jpeg, image/png, image/webp"
              onChange={handleFile1Change}
              required
            />
          </div>
          
          <div className="file-input-group">
            <label>Second Image (Required):</label>
            <input 
              type="file" 
              accept="image/jpeg, image/png, image/webp"
              onChange={handleFile2Change}
              required
            />
          </div>

          <div className="file-input-group">
            <label>Third Image (Optional):</label>
            <input 
              type="file" 
              accept="image/jpeg, image/png, image/webp"
              onChange={handleFile3Change}
            />
          </div>
        </div>
        
        {error && <div className="error">{error}</div>}
        
        <button type="submit" disabled={loading || !file1 || !file2}>
          {loading ? 'Generating GIF...' : 'Create GIF'}
        </button>
      </form>
      
      {gifUrl && (
        <div className="result">
          <h2>Your GIF:</h2>
          <img src={gifUrl} alt="Generated GIF" />
          <a href={gifUrl} download="generated.gif" className="download-btn">
            Download GIF
          </a>
        </div>
      )}
    </div>
  );
}

export default App;
