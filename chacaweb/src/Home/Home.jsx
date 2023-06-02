import React, { useEffect, useState } from 'react';
import AdminPanel from '../Admin/AdminPanel';
import axios from 'axios';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';

import './Navbar.css'; // Importa un archivo CSS para los estilos del Navbar
import './FotoStilo.css';



// Componente de la barra de navegación
const Navbar = () => {
    return (
      <nav className="navbar">
        <ul className="navbar-list">
          <li className="navbar-item">
            <Link to="/" className="navbar-link">
              HOME
            </Link>
          </li>
          <li className="navbar-item">
            <Link to="/gallery" className="navbar-link">
              Galería
            </Link>
          </li>
          <li className="navbar-item">
            <Link to="/upload" className="navbar-link">
              Subir
            </Link>
          </li>
        </ul>
      </nav>
    );
  };

// Componente de la página de inicio (Home)
const Home = () => {
    return (
      <div>
        <h1>Bienvenido a la página de inicio</h1>
        {/* Aquí va el contenido de la página de inicio */}
      </div>
    );
  };

// Componente para cargar y mostrar las fotos
const PhotoUploader = () => {
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [previewImages, setPreviewImages] = useState([]);
  
    const handlePhotoUpload = (event) => {
      const files = Array.from(event.target.files);
  
      // Filtrar los archivos seleccionados que sean imágenes
      const imageFiles = files.filter(file => file.type.startsWith('image/'));
      
      setSelectedFiles([...selectedFiles, ...imageFiles]);
  
      const imagePreviewPromises = imageFiles.map(file => {
        return new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result);
          reader.onerror = reject;
          reader.readAsDataURL(file);
        });
      });
  
      Promise.all(imagePreviewPromises)
        .then(results => {
          setPreviewImages([...previewImages, ...results]);
        })
        .catch(error => {
          console.log('Error al cargar las imágenes:', error);
        });
    };
  
    const handleUpload = async () => {
        if (selectedFiles.length > 0) {
          const formData = new FormData();
      
          selectedFiles.forEach(file => {
            formData.append('photos', file);
          });
      
          try {
            const response = await fetch('http://127.0.0.1:3000/api/upload', {
              method: 'POST',
              body: formData,
            });
      
            if (response.ok) {
              console.log('Fotos subidas con éxito');
            } else {
              console.error('Error al subir las fotos:', response.statusText);
            }
      
            setSelectedFiles([]);
            setPreviewImages([]);
          } catch (error) {
            console.error('Error al subir las fotos:', error);
          }
        } else {
          console.log('No hay fotos seleccionadas para subir');
        }
    };
  
    return (
      <div>
        <h2>Cargar fotos</h2>
        <input type="file" accept="image/*" multiple onChange={handlePhotoUpload} />
        <div>
          {/* Mostrar las miniaturas de las imágenes seleccionadas */}
          {previewImages.map((image, index) => (
            <img key={index} src={image} alt={`Foto ${index + 1}`} style={{ maxWidth: '200px', maxHeight: '200px' }} />
          ))}
        </div>
        <button onClick={handleUpload}>Subir</button>
      </div>
    );
  };
  
  // Componente para comprar y descargar fotos
  const PhotoGallery = () => {
    const [photos, setPhotos] = useState([]);
  
    useEffect(() => {
      const fetchPhotos = async () => {
        try {
          const response = await axios.get('http://localhost:3000/api/photos');          
          console.log(response);
          setPhotos(response.data.photos);
          
        } catch (error) {
          console.error('Error al obtener las fotos:', error);
        }
      };
  
      fetchPhotos();
    }, []);
  
    const handleBuyPhoto = (photo) => {
      // Lógica para comprar la foto
      console.log(`Comprar foto: ${photo.filename}`);
    };
  
    const handleDownloadPhoto = (photo) => {
      // Lógica para descargar la foto
      console.log(`Descargar foto: ${photo.filename}`);
    };
  
    return (
      <div>
        <h2>Galería de fotos</h2>
        <div className="photo-grid">
          {/* Mostrar las fotos en miniatura */}
          {photos.map((photo, index) => (
            <div key={index} className="photo-item">
              <img src={`http://127.0.0.1:3000/api/photos/${photo}`} alt="Foto" style={{ maxWidth: '200px', maxHeight: '200px' }} />
              <button onClick={() => handleBuyPhoto(photo)}>Comprar</button>
              <button onClick={() => handleDownloadPhoto(photo)}>Descargar</button>
            </div>
          ))}
        </div>
      </div>
    );
  };

// Componente para el inicio de sesión
const Login = ({ handleLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleFormSubmit = (event) => {
    event.preventDefault();
    handleLogin(username, password);
  };

  return (
    <div>
      <h2>Iniciar sesión</h2>
      <form onSubmit={handleFormSubmit}>
        <input
          type="text"
          placeholder="Nombre de usuario"
          value={username}
          onChange={(event) => setUsername(event.target.value)}
        />
        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
        />
        <button type="submit">Iniciar sesión</button>
      </form>
    </div>
  );
};

// Componente principal de la aplicación
const Appp = () => {
  const [loggedIn, setLoggedIn] = useState(false);
  const [user, setUser] = useState(null);

  const exampleUsers = [
    { username: 'usuarioEjemplo1', password: 'contraseñaEjemplo1', level: 'admin' },
    { username: '1', password: '1', level: 'standard' },
    { username: 'usuarioEjemplo3', password: 'contraseñaEjemplo3', level: 'standard' },
  ];

  const handleLogin = (username, password) => {
    const user = exampleUsers.find((user) => user.username === username && user.password === password);

    if (user) {
      setLoggedIn(true);
      setUser(user);
    } else {
      // Credenciales inválidas, mostrar un mensaje de error o realizar alguna acción
    }
  };

  const handleLogout = () => {
    setLoggedIn(false);
    setUser(null);
  };

  return (
    <Router>

        <div>
        
        {loggedIn ? (
            <div>
                <Navbar />
                <Route exact path="/" component={Home} />
                <Route path="/gallery" render={() => <PhotoGallery />} />
                <Route path="/upload" render={() => <PhotoUploader />} />
                {user.level === 'admin' && <Route path="/admin" render={() => <AdminPanel />} />} 
                {/*<PhotoUploader />
                <PhotoGallery photos={[]} /> */}
                <button onClick={handleLogout}>Cerrar sesión</button>
            </div>
        ) : (
            <Login handleLogin={handleLogin} />
        )}
        </div>
    </Router>

  );
};

export default Appp;