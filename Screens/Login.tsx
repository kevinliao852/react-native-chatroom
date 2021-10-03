import { useNavigation } from '@react-navigation/core';
import React from 'react';
import { View, Text, Button, TextInput } from 'react-native';
import { Input } from 'react-native-elements';

export const Login = () => {
  const navigation = useNavigation<any>();
  return (
    <View style={{ padding: 50, paddingTop: 100 }}>
      <Input label="Username" />
      <Input label="Password" secureTextEntry />
      <Button onPress={() => navigation.navigate('ChatList')} title="Login" />
    </View>
  );
};
