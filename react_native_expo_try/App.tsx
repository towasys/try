import { StatusBar } from 'expo-status-bar';
import { Button, SafeAreaView, StyleSheet, Text, View } from 'react-native';
import { useState } from 'react';
import * as Speech from 'expo-speech';


export default function App() {
  const [logs, set_logs] = useState<string[]>([]);
  return (
    <SafeAreaView style={styles.container}>
      <View style={{ flex: 1, backgroundColor: "#AAA", alignItems: "center" }}>
        <Text>Open up App.tsx to start working on your app!</Text>
        <Text>Changes you make will automatically reload.</Text>
        {logs.map((log, index) => <Text key={index}>{log}</Text>)}
      </View>
      <StatusBar style="auto" />
      <View style={{ flex: 1, backgroundColor: "#0AAA", alignItems: "center" }}>
        <Button title="Listen" onPress={() => {
          Speech.speak("test");
          set_logs(logs => ["test", ...logs]);
        }} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});