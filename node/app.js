const express = require('express');
const multer = require('multer');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const port = 3000;

const app = express();
const upload = multer({ dest: 'uploads/' }); // Carpeta donde se guardarán los archivos subidos


app.use(cors());

app.get('/api/photos', (req, res) => {
  const uploadsDir = path.join(__dirname, 'uploads');

  fs.readdir(uploadsDir, (err, files) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: 'Error al leer la carpeta de subidas' });
    } else {
      const photos = files.filter((file) => {
        const filePath = path.join(uploadsDir, file);
        return fs.statSync(filePath).isFile();
      });

      res.json({ photos });
    }
  });
});

app.get('/api/photos/:filename', (req, res) => {
  const filename = req.params.filename;
  const filePath = path.join(__dirname, 'uploads', filename);

  fs.access(filePath, fs.constants.F_OK, (err) => {
    if (err) {
      console.error(err);
      res.status(404).json({ error: 'La foto solicitada no existe' });
    } else {
      res.download(filePath);
    }
  });
});

app.post('/api/upload', upload.array('photos'), (req, res) => {

  
  // Ejemplo de respuesta exitosa
  res.json({ message: 'Fotos subidas con éxito' });
});

app.listen(port, () => {
  console.log(`Servidor escuchando en el puerto ${port}`);
});