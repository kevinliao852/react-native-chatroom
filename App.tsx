// import dotenv from 'dotenv';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import firebase from './firebase/firebase';
import { ChatList } from './Screens/ChatLIst';
import { Home } from './Screens/Home';
import { ChatRoom } from './Screens/ChatRoom';
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { Login } from './Screens/Login';
import { Setting } from './Screens/Setting';
// const result = dotenv.config();
// console.log(result);
const Stack = createNativeStackNavigator<{
  ChatList: undefined;
  ChatRoom: undefined;
  Home: undefined;
  Login: undefined;
  Setting: undefined;
}>();

export default function App() {
  return (
    <View style={{ flex: 1 }}>
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen name="Home" component={Home} />
          <Stack.Screen name="Login" component={Login} />
          <Stack.Screen name="Setting" component={Setting} />
          <Stack.Screen
            name="ChatList"
            component={ChatList}
            options={{
              headerRight: (props: any) => {
                const navigation = useNavigation<any>();
                return (
                  <TouchableOpacity
                    onPress={() => navigation.navigate('Setting')}
                  >
                    <View>
                      <Ionicons
                        name="settings"
                        size={20}
                        style={{ marginRight: 10 }}
                      />
                    </View>
                  </TouchableOpacity>
                );
              },
            }}
          />
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
