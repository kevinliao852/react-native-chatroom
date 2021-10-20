import { useNavigation } from "@react-navigation/core";
import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import firebase from "../firebase/firebase";
const RoomItem = () => {
  const [rooms, setRooms] = useState([]);

  useEffect(() => {
    firebase
      .firestore()
      .collection("User_ChatRoom")
      .where("userId", "==", "1")
      .get()
      .then((querySnapshot) => {
        querySnapshot.forEach((documentSnapshot) =>
          setRooms(documentSnapshot.data().rooms)
        );
      });
  }, []);

  console.log(rooms);

  const navigation = useNavigation<any>();
  return (
    <TouchableOpacity
      onPress={() => {
        navigation.navigate("ChatRoom", { roomId: "Ghkfy5xoq7cGHfysRg8j" });
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
    <View style={{ flex: 1, backgroundColor: "black" }}>
      <ScrollView style={{ flex: 1, backgroundColor: "white" }}>
        <View>
          {new Array(1).fill(null).map((data, index) => (
            <RoomItem key={index} />
          ))}
        </View>
      </ScrollView>
      <View
        style={{
          backgroundColor: "white",
          width: "100%",
          flexDirection: "row",
          paddingHorizontal: 30,
          borderTopWidth: 1,
          padding: 10,
          borderBottomWidth: 1,
          marginBottom: 50,
        }}
      >
        <TouchableOpacity style={{ flex: 1 }}>
          <View style={{}}>
            <Text style={{ textAlign: "center" }}>ChatList</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity style={{ flex: 1 }}>
          <View style={{}}>
            <Text style={{ textAlign: "center" }}>FriendList</Text>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
};
