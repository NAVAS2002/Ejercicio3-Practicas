const express = require('express');
const crypto = require('crypto');
const app = express();
const cors = require('cors');

app.use(cors());
const port = process.env.PORT || 3000;

app.use(express.json());

const tareas = [];


app.get('/', (req, res) => {
  res.send('Practica de Node.js y Express');
});

app.get('/tareas', (req, res) => {
  res.json(tareas);
});

app.post('/tareas', (req, res) => {
  const { titulo, descripcion } = req.body ?? {};

    if (typeof titulo !== 'string' || titulo.trim() === '') {
      return res.status(400).json({ mensaje: 'El título es obligatorio', 
      });
    }


    if (typeof descripcion !== 'string') {
        return res.status(400).json({
             mensaje: 'La descripción debe ser solo texto', 
            });
    }
  const nuevaTarea = {
    id: crypto.randomUUID(),
    titulo: titulo.trim(),
    descripcion: descripcion.trim(),
  };

  tareas.push(nuevaTarea);
  res.status(201).json(nuevaTarea); 
});

app.delete('/tareas/:id', (req, res) => {
  const indice = tareas.findIndex(
    tarea => tarea.id === req.params.id
  );

if (indice === -1) {
    return res.status(404).json({ mensaje: 'Tarea no encontrada', 

    });
  }

    tareas.splice(indice, 1);

    res.status(204).send();
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

