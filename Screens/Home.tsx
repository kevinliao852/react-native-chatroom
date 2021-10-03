import { useNavigation } from '@react-navigation/core';
import React from 'react';
import { View, Text, Button } from 'react-native';

export const Home = () => {
  const navigation = useNavigation<any>();
  return (
    <View>
      <View style={{ margin: 20 }}>
        <Text style={{ fontSize: 20, textAlign: 'center' }}>
          WelCome to KChat
        </Text>
      </View>
      <View style={{ marginTop: 300 }}>
        <Button onPress={() => navigation.navigate('Login')} title="Login" />
      </View>
    </View>
  );
};
