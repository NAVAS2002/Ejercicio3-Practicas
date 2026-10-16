import {SafeAreaProvider, SafeAreaView} from 'react-native-safe-area-context';
import TareasScreen from './src/screens/TareasScreen';

export default function App() {
  return (
    <SafeAreaProvider>
      <SafeAreaView style={{flex: 1, backgroundColor: '#fff'}}>
      <TareasScreen />
      </SafeAreaView>
    </SafeAreaProvider>
  );
}