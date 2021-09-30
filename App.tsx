// import dotenv from 'dotenv';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import firebase from './firebase/firebase';
import { ChatRoom } from './Screens/ChatRoom';
// const result = dotenv.config();
// console.log(result);

export default function App() {
  console.log();

  return (
    <View style={{ flex: 1 }}>
      <View style={{ height: 100, borderWidth: 1, borderColor: 'grey' }}>
        <Text
          style={{
            textAlignVertical: 'center',
            justifyContent: 'center',
            textAlign: 'center',
            height: '100%',
          }}
        >
          ChatRoom
        </Text>
      </View>
      <ChatRoom />
      {/* <Text>Open up App.tsx to start working on your app!!!</Text>
      <StatusBar style="auto" /> */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
