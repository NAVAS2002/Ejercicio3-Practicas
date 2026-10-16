import {useEffect, useState} from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TextInput,
  Button,
} from 'react-native';

type Tarea = {
  id: string;
  titulo: string;
  descripcion: string;
};

const API = 'https://ejercicio3-practicas.onrender.com/tareas';

export default function TareasScreen() {
  const [tareas, setTareas] = useState<Tarea[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');

  const [titulo, setTitulo] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [guardando, setGuardando] = useState(false);
  const [errorGuardar, setErrorGuardar] = useState('');

  const [eliminando, setEliminando] = useState<string | null>(null);
  const [errorEliminar, setErrorEliminar] = useState('');

  useEffect(() => {
    async function cargarTareas() {
      try {
        const respuesta = await fetch(API);

        if (!respuesta.ok) {
          throw new Error('No se pudieron obtener las tareas');
        }

        const datos: Tarea[] = await respuesta.json();
        setTareas(datos);
      } catch {
        setError('No se pudieron cargar las tareas.');
      } finally {
        setCargando(false);
      }
    }

    cargarTareas();
  }, []);

  async function crearTarea() {
    if (!titulo.trim()) {
      setErrorGuardar('Escribe un título para la tarea.');
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
        throw new Error('No se pudo crear la tarea');
      }

      const nuevaTarea: Tarea = await respuesta.json();

      setTareas(anteriores => [...anteriores, nuevaTarea]);
      setTitulo('');
      setDescripcion('');
    } catch {
      setErrorGuardar('No se pudo crear la tarea. Intenta nuevamente.');
    } finally {
      setGuardando(false);
    }
  }

  async function eliminarTarea(id: string) {
    setEliminando(id);
    setErrorEliminar('');

    try {
      const respuesta = await fetch(`${API}/${id}`, {
        method: 'DELETE',
      });

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

  return (
    <View style={styles.contenedor}>
      <Text style={styles.titulo}>Mis tareas</Text>

      <View style={styles.formulario}>
        <Text style={styles.texto}>Título</Text>
        <TextInput
          style={styles.campo}
          value={titulo}
          onChangeText={setTitulo}
          placeholder="Escribe una tarea"
          placeholderTextColor="#666"
          editable={!guardando}
        />

        <Text style={styles.texto}>Descripción</Text>
        <TextInput
          style={styles.campo}
          value={descripcion}
          onChangeText={setDescripcion}
          placeholder="Agrega una descripción"
          placeholderTextColor="#666"
          multiline
          editable={!guardando}
        />

        <Button
          title={guardando ? 'Guardando...' : 'Crear tarea'}
          onPress={crearTarea}
          disabled={guardando || cargando || error !== ''}
        />

        {errorGuardar !== '' && (
          <Text style={styles.error}>{errorGuardar}</Text>
        )}
      </View>

      {errorEliminar !== '' && (
        <Text style={styles.error}>{errorEliminar}</Text>
      )}

      {cargando ? (
        <Text style={styles.texto}>Cargando tareas...</Text>
      ) : error !== '' ? (
        <Text style={styles.error}>{error}</Text>
      ) : (
        <FlatList
          style={styles.lista}
          data={tareas}
          keyExtractor={item => item.id}
          keyboardShouldPersistTaps="handled"
          ListEmptyComponent={
            <Text style={styles.texto}>No hay tareas para mostrar.</Text>
          }
          renderItem={({item}) => (
            <View style={styles.tarea}>
              <Text style={styles.nombre}>{item.titulo}</Text>
              <Text style={styles.descripcion}>{item.descripcion}</Text>

              <Button
                title={eliminando === item.id ? 'Eliminando...' : 'Eliminar'}
                onPress={() => eliminarTarea(item.id)}
                disabled={eliminando !== null}
              />
            </View>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  contenedor: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  titulo: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#222',
  },
  texto: {
    color: '#222',
  },
  formulario: {
    marginBottom: 20,
  },
  campo: {
    borderWidth: 1,
    borderColor: '#888',
    borderRadius: 4,
    padding: 10,
    marginTop: 6,
    marginBottom: 12,
    color: '#222',
    backgroundColor: '#fff',
  },
  lista: {
    flex: 1,
  },
  tarea: {
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  nombre: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 6,
    color: '#222',
  },
  descripcion: {
    color: '#222',
    marginBottom: 10,
  },
  error: {
    color: '#b00020',
    marginTop: 8,
  },
});