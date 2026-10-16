import {useEffect, useState} from 'react';
import {View, Text, FlatList, StyleSheet, TextInput, Button, } from 'react-native';

import {traducciones} from '../utils/traducciones';
import type {Idioma} from '../utils/traducciones';

type Props = {
  idioma: Idioma;
};

type Tarea = {
  id: string;
  titulo: string;
  descripcion: string;
};

const API = 'https://ejercicio3-practicas.onrender.com/tareas';

export default function TareasScreen({idioma}: Props) {
  const t = traducciones[idioma];

  const [tareas, setTareas] = useState<Tarea[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<'' | 'errorCargar'>('');

  const [titulo, setTitulo] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [guardando, setGuardando] = useState(false);
  const [errorGuardar, setErrorGuardar] = useState<
    '' | 'tituloObligatorio' | 'errorGuardar'
  >('');

  const [eliminando, setEliminando] = useState<string | null>(null);
  const [errorEliminar, setErrorEliminar] = useState<
    '' | 'errorEliminar'
  >('');

  useEffect(() => {
    async function cargarTareas() {
      try {
        const respuesta = await fetch(API);

        if (!respuesta.ok) {
          throw new Error('Error al obtener las tareas');
        }

        const datos: Tarea[] = await respuesta.json();
        setTareas(datos);
      } catch {
        setError('errorCargar');
      } finally {
        setCargando(false);
      }
    }

    cargarTareas();
  }, []);

  async function crearTarea() {
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

      const nuevaTarea: Tarea = await respuesta.json();

      setTareas(anteriores => [...anteriores, nuevaTarea]);
      setTitulo('');
      setDescripcion('');
    } catch {
      setErrorGuardar('errorGuardar');
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
    <View style={styles.contenedor}>
      <Text style={styles.titulo}>{t.misTareas}</Text>

      <View style={styles.formulario}>
        <Text style={styles.texto}>{t.titulo}</Text>
        <TextInput
          style={styles.campo}
          value={titulo}
          onChangeText={setTitulo}
          placeholder={t.escribirTitulo}
          placeholderTextColor="#666"
          editable={!guardando}
        />

        <Text style={styles.texto}>{t.descripcion}</Text>
        <TextInput
          style={styles.campo}
          value={descripcion}
          onChangeText={setDescripcion}
          placeholder={t.escribirDescripcion}
          placeholderTextColor="#666"
          multiline
          editable={!guardando}
        />

        <Button
          title={guardando ? t.guardando : t.crear}
          onPress={crearTarea}
          disabled={guardando || cargando || error !== ''}
        />

        {errorGuardar !== '' && (
          <Text style={styles.error}>{t[errorGuardar]}</Text>
        )}
      </View>

      {errorEliminar !== '' && (
        <Text style={styles.error}>{t[errorEliminar]}</Text>
      )}

      {cargando ? (
        <Text style={styles.texto}>{t.cargando}</Text>
      ) : error !== '' ? (
        <Text style={styles.error}>{t[error]}</Text>
      ) : (
        <FlatList
          style={styles.lista}
          data={tareas}
          keyExtractor={item => item.id}
          keyboardShouldPersistTaps="handled"
          ListEmptyComponent={
            <Text style={styles.texto}>{t.sinTareas}</Text>
          }
          renderItem={({item}) => (
            <View style={styles.tarea}>
              <Text style={styles.nombre}>{item.titulo}</Text>
              <Text style={styles.descripcion}>{item.descripcion}</Text>

              <Button
                title={
                  eliminando === item.id ? t.eliminando : t.eliminar
                }
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