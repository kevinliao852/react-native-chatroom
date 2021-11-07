import { useNavigation } from "@react-navigation/core";
import React, { useContext, useEffect, useState } from "react";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { UserContext } from "../Context/UserContext";
import firebase from "../firebase/firebase";
import { Nav } from "./components/Nav";
const RoomItem = ({ room }: any) => {
  const navigation = useNavigation<any>();
  return (
    <TouchableOpacity
      onPress={() => {
        navigation.navigate("ChatRoom", { roomId: room.roomId });
      }}
    >
      <View
        style={{
          padding: 20,
          borderBottomWidth: 1,
          marginHorizontal: 10,
        }}
      >
        <Text>{room.roomName}</Text>
      </View>
    </TouchableOpacity>
  );
};

export const ChatList = () => {
  const [rooms, setRooms] = useState([]);
  const { user } = useContext<any>(UserContext);

  useEffect(() => {
    if (!user) {
      return;
    }

    console.log(user.uid);

    const subscriber = firebase
      .firestore()
      .collection("User_ChatRoom")
      .where("userId", "==", user.uid)
      .onSnapshot((querySnapshot) => {
        querySnapshot.forEach((documentSnapshot) =>
          setRooms(documentSnapshot.data().rooms)
        );
      });

    firebase
      .firestore()
      .collection("User_ChatRoom")
      .where("userId", "==", user.uid)
      .get()
      .then((querySnapshot) => {
        querySnapshot.forEach((documentSnapshot) =>
          setRooms(documentSnapshot.data().rooms)
        );
      });

    return () => subscriber();
  }, [user]);

  return (
    <View style={{ flex: 1, backgroundColor: "black" }}>
      <ScrollView style={{ flex: 1, backgroundColor: "white" }}>
        <View>
          {rooms.map((room, index) => (
            <RoomItem key={index} room={room} />
          ))}
        </View>
      </ScrollView>
      <Nav />
    </View>
  );
};
