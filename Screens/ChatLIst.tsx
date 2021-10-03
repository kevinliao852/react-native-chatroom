import { useNavigation } from '@react-navigation/core';
import React from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
const RoomItem = () => {
  const navigation = useNavigation<any>();
  return (
    <TouchableOpacity
      onPress={() => {
        navigation.navigate('ChatRoom');
      }}
    >
      <View
        style={{
          padding: 20,
          borderBottomWidth: 1,
          marginHorizontal: 10,
        }}
      >
        <Text>My ChatRoom</Text>
      </View>
    </TouchableOpacity>
  );
};

export const ChatList = () => {
  const navigation = useNavigation<any>();

  return (
    <View style={{ flex: 1, backgroundColor: 'black' }}>
      <ScrollView style={{ flex: 1, backgroundColor: 'white' }}>
        <View>
          {new Array(1).fill(null).map((data, index) => (
            <RoomItem key={index} />
          ))}
        </View>
      </ScrollView>
      <View
        style={{
          backgroundColor: 'white',
          width: '100%',
          flexDirection: 'row',
          paddingHorizontal: 30,
          borderTopWidth: 1,
          padding: 10,
          borderBottomWidth: 1,
          marginBottom: 50,
        }}
      >
        <TouchableOpacity style={{ flex: 1 }}>
          <View style={{}}>
            <Text style={{ textAlign: 'center' }}>ChatList</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity style={{ flex: 1 }}>
          <View style={{}}>
            <Text style={{ textAlign: 'center' }}>FriendList</Text>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
};
