import { StatusBar } from 'expo-status-bar';
import { SafeAreaView, StyleSheet, Text, View } from 'react-native';

export default function App() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={{ flex: 1, backgroundColor: "#AAA", alignItems: "center" }}>
        <Text>Open up App.tsx to start working on your app!</Text>
      </View>
      <StatusBar style="auto" />
      <View style={{ flex: 1, backgroundColor: "#0AAA", alignItems: "center" }}>
        <Text>test on bottom</Text>
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
