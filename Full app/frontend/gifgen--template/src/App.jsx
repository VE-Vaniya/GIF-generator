import { useState } from 'react';
import './index.css';

function App() {
  const [file1, setFile1] = useState(null);
  const [file2, setFile2] = useState(null);
  const [gifUrl, setGifUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleFile1Change = (e) => {
    setFile1(e.target.files[0]);
    setError('');
  };

  const handleFile2Change = (e) => {
    setFile2(e.target.files[0]);
    setError('');
  };

 const handleSubmit = async (e) => {
  e.preventDefault();
  
  if (!file1 || !file2) {
    setError('Please select both images');
    return;
  }

  setLoading(true);
  setError('');
  
  const formData = new FormData();
  formData.append('images', file1);
  formData.append('images', file2);

  try {
    const response = await fetch('http://localhost:5000/generate-gif', {
      method: 'POST',
      body: formData,
      mode: 'cors',
      headers: {
        'Accept': 'application/json',
      },
    });
    
    if (!response.ok) throw new Error('Failed to generate GIF');
    
    const blob = await response.blob();
    setGifUrl(URL.createObjectURL(blob));
  } catch (error) {
    console.error(error);
    setError('Error generating GIF. Please try again.');
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
            <label>First Image:</label>
            <input 
              type="file" 
              accept="image/*"
              onChange={handleFile1Change}
              required
            />
          </div>
          
          <div className="file-input-group">
            <label>Second Image:</label>
            <input 
              type="file" 
              accept="image/*"
              onChange={handleFile2Change}
              required
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