import { useNavigation } from '@react-navigation/core';
import React from 'react';
import { View } from 'react-native';
import { ListItem, Text } from 'react-native-elements';
import firebase from '../firebase/firebase';

export const Setting = () => {
  const navigation = useNavigation<any>();
  return (
    <View>
      <ListItem
        bottomDivider
        onPress={() => {
          firebase
            .auth()
            .signOut()
            .then(() => navigation.navigate('Home'));
        }}
      >
        <ListItem.Content>
          <Text>Logout</Text>
        </ListItem.Content>
      </ListItem>
    </View>
  );
};
