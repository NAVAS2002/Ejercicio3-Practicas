import {useEffect, useState} from 'react';
import './App.css';

function App() {
  const [tareas, setTareas] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  const [titulo, setTitulo] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [guardando, setGuardando] = useState(false);
  const [errorGuardar, setErrorGuardar] = useState(null);
  const [eliminando, setEliminando] = useState(null);
  const [errorEliminar, setErrorEliminar] = useState('');

  useEffect(() => {
    const fetchTareas = async () => {
      try {
        const response = await fetch(
          'https://ejercicio3-practicas.onrender.com/tareas',
        );

        if (!response.ok) {
          throw new Error('Error al obtener las tareas');
        }

        const data = await response.json();
        setTareas(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setCargando(false);
      }
    };

    fetchTareas();
  }, []);

  async function crearTarea(evento) {
    evento.preventDefault();

    if (!titulo.trim()) {
      setErrorGuardar('Escribe un título para la tarea.');
      return;
    }

    setGuardando(true);
    setErrorGuardar(null);

    try {
      const respuesta = await fetch(
        'https://ejercicio3-practicas.onrender.com/tareas',
        {
          method: 'POST',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({
            titulo: titulo.trim(),
            descripcion: descripcion.trim(),
          }),
        },
      );

      if (!respuesta.ok) {
        throw new Error('No se pudo crear la tarea');
      }

      const nuevaTarea = await respuesta.json();

      setTareas(anteriores => [...anteriores, nuevaTarea]);
      setTitulo('');
      setDescripcion('');
    } catch {
      setErrorGuardar('No se pudo crear la tarea. Intenta nuevamente.');
    } finally {
      setGuardando(false);
    }
  }

  async function eliminarTarea(id) {
    setEliminando(id);
    setErrorEliminar('');

    try {
      const respuesta = await fetch(
        `https://ejercicio3-practicas.onrender.com/tareas/${id}`,
        {method: 'DELETE'},
      );

      if (!respuesta.ok) {
        throw new Error('No se pudo eliminar la tarea');
      }

      setTareas(anteriores =>
        anteriores.filter(tarea => tarea.id !== id),
      );
    } catch {
      setErrorEliminar('No se pudo eliminar la tarea. Intenta nuevamente.');
    } finally {
      setEliminando(null);
    }
  }

  if (cargando) {
    return <p>Cargando tareas...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  return (
    <main>
      <h1>Mis tareas</h1>

      <form onSubmit={crearTarea}>
        <label>
          Título:
          <input
            type="text"
            value={titulo}
            onChange={evento => setTitulo(evento.target.value)}
            disabled={guardando}
          />
        </label>

        <label>
          Descripción:
          <textarea
            value={descripcion}
            onChange={evento => setDescripcion(evento.target.value)}
            disabled={guardando}
          />
        </label>

        <button type="submit" disabled={guardando}>
          {guardando ? 'Guardando...' : 'Crear tarea'}
        </button>

        {errorGuardar && (
          <p className="error" role="alert">
            {errorGuardar}
          </p>
        )}
      </form>

      {errorEliminar && (
        <p className="error" role="alert">
          {errorEliminar}
        </p>
      )}

      {tareas.length === 0 ? (
        <p>No hay tareas para mostrar.</p>
      ) : (
        <ul>
          {tareas.map(tarea => (
            <li key={tarea.id}>
              <h2>{tarea.titulo}</h2>
              <h3>{tarea.descripcion}</h3>

              <button
                type="button"
                onClick={() => eliminarTarea(tarea.id)}
                disabled={eliminando !== null}
              >
                {eliminando === tarea.id ? 'Eliminando...' : 'Eliminar'}
              </button>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}

export default App;