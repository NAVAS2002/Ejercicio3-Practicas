import {useEffect, useState} from 'react';
import {traducciones} from './utils/traducciones';
import './App.css';

const API = 'https://ejercicio3-practicas.onrender.com/tareas';

function App() {
  const [idioma, setIdioma] = useState('es');
  const t = traducciones[idioma];

  const [tareas, setTareas] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');

  const [titulo, setTitulo] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [guardando, setGuardando] = useState(false);
  const [errorGuardar, setErrorGuardar] = useState('');

  const [eliminando, setEliminando] = useState(null);
  const [errorEliminar, setErrorEliminar] = useState('');

  useEffect(() => {
    async function cargarTareas() {
      try {
        const respuesta = await fetch(API);

        if (!respuesta.ok) {
          throw new Error('Error al obtener las tareas');
        }

        const datos = await respuesta.json();
        setTareas(datos);
      } catch {
        setError('errorCargar');
      } finally {
        setCargando(false);
      }
    }

    cargarTareas();
  }, []);

  async function crearTarea(evento) {
    evento.preventDefault();

    if (!titulo.trim()) {
      setErrorGuardar('tituloObligatorio');
      return;
    }

    setGuardando(true);
    setErrorGuardar('');

    try {
      const respuesta = await fetch(API, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
          titulo: titulo.trim(),
          descripcion: descripcion.trim(),
        }),
      });

      if (!respuesta.ok) {
        throw new Error('Error al crear la tarea');
      }

      const nuevaTarea = await respuesta.json();

      setTareas(anteriores => [...anteriores, nuevaTarea]);
      setTitulo('');
      setDescripcion('');
    } catch {
      setErrorGuardar('errorGuardar');
    } finally {
      setGuardando(false);
    }
  }

  async function eliminarTarea(id) {
    setEliminando(id);
    setErrorEliminar('');

    try {
      const respuesta = await fetch(`${API}/${id}`, {
        method: 'DELETE',
      });

      if (!respuesta.ok) {
        throw new Error('Error al eliminar la tarea');
      }

      setTareas(anteriores =>
        anteriores.filter(tarea => tarea.id !== id),
      );
    } catch {
      setErrorEliminar('errorEliminar');
    } finally {
      setEliminando(null);
    }
  }

  return (
    <main>
      <label htmlFor="idioma">{t.idioma}</label>
      <select
        id="idioma"
        value={idioma}
        onChange={evento => setIdioma(evento.target.value)}
      >
        <option value="es">Español</option>
        <option value="en">English</option>
        <option value="pt">Português</option>
      </select>

      <h1>{t.misTareas}</h1>

      <form onSubmit={crearTarea}>
        <label>
          {t.titulo}:
          <input
            type="text"
            value={titulo}
            onChange={evento => setTitulo(evento.target.value)}
            placeholder={t.escribirTitulo}
            disabled={guardando}
          />
        </label>

        <label>
          {t.descripcion}:
          <textarea
            value={descripcion}
            onChange={evento => setDescripcion(evento.target.value)}
            placeholder={t.escribirDescripcion}
            disabled={guardando}
          />
        </label>

        <button
          type="submit"
          disabled={guardando || cargando || error !== ''}
        >
          {guardando ? t.guardando : t.crear}
        </button>

        {errorGuardar && (
          <p className="error" role="alert">
            {t[errorGuardar]}
          </p>
        )}
      </form>

      {errorEliminar && (
        <p className="error" role="alert">
          {t[errorEliminar]}
        </p>
      )}

      {cargando ? (
        <p>{t.cargando}</p>
      ) : error ? (
        <p className="error" role="alert">
          {t[error]}
        </p>
      ) : tareas.length === 0 ? (
        <p>{t.sinTareas}</p>
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
                {eliminando === tarea.id ? t.eliminando : t.eliminar}
              </button>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}

export default App;