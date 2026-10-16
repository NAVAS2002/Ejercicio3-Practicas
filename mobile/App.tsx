import {useState} from 'react';
import {View, Text, Button} from 'react-native';
import {
  SafeAreaProvider,
  SafeAreaView,
} from 'react-native-safe-area-context';

import TareasScreen from './src/screens/TareasScreen';
import {traducciones} from './src/utils/traducciones';
import type {Idioma} from './src/utils/traducciones';

export default function App() {
  const [idioma, setIdioma] = useState<Idioma>('es');
  const t = traducciones[idioma];

  return (
    <SafeAreaProvider>
      <SafeAreaView style={{flex: 1, backgroundColor: '#fff'}}>
        <View style={{padding: 16}}>
          <Text style={{color: '#222'}}>{t.idioma}</Text>

          <View style={{flexDirection: 'row', flexWrap: 'wrap'}}>
            <Button
              title="Español"
              onPress={() => setIdioma('es')}
              disabled={idioma === 'es'}
            />
            <Button
              title="English"
              onPress={() => setIdioma('en')}
              disabled={idioma === 'en'}
            />
            <Button
              title="Português"
              onPress={() => setIdioma('pt')}
              disabled={idioma === 'pt'}
            />
          </View>
        </View>

        <TareasScreen idioma={idioma} />
      </SafeAreaView>
    </SafeAreaProvider>
  );
}