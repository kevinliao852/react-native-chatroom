import { useNavigation } from '@react-navigation/core';
import React, { useEffect, useState } from 'react';
import { View, Text, Button, TextInput } from 'react-native';
import { Input } from 'react-native-elements';
import firebase from '../firebase/firebase';
import { TEST_ACCOUNT, TEST_PASSWORD } from '@env';

export const Login = () => {
  const navigation = useNavigation<any>();
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  useEffect(() => {
    (async () => {
      if (firebase.auth().currentUser) {
        navigation.navigate('ChatList');
      }
    })();
  });

  return (
    <View style={{ padding: 50, paddingTop: 100 }}>
      <Input
        label="Username"
        onChangeText={(value: string) => setUsername(value)}
      />
      <Input
        label="Password"
        onChangeText={(value: string) => setPassword(value)}
        secureTextEntry
      />
      <Button
        onPress={() => {
          (async () => {
            console.log(username, password);
            await firebase
              .auth()
              .signInWithEmailAndPassword(username, password)
              .then(() => navigation.navigate('ChatList'))
              .catch(console.log);
          })();
        }}
        title="Login"
      />
    </View>
  );
};
