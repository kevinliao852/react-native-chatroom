// import dotenv from 'dotenv';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import firebase from './firebase/firebase';
import { ChatList } from './Screens/ChatLIst';
import { Home } from './Screens/Home';
import { ChatRoom } from './Screens/ChatRoom';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Login } from './Screens/Login';
// const result = dotenv.config();
// console.log(result);
const Stack = createNativeStackNavigator<{
  ChatList: undefined;
  ChatRoom: undefined;
  Home: undefined;
  Login: undefined;
}>();

export default function App() {
  return (
    <View style={{ flex: 1 }}>
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen name="Home" component={Home} />
          <Stack.Screen name="Login" component={Login} />
          <Stack.Screen name="ChatList" component={ChatList} />
          <Stack.Screen name="ChatRoom" component={ChatRoom} />
        </Stack.Navigator>
      </NavigationContainer>
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
