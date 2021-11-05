import { useNavigation } from "@react-navigation/core";
import React, { useContext, useEffect, useState } from "react";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { UserContext } from "../Context/UserContext";
import firebase from "../firebase/firebase";
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
  const navigation = useNavigation<any>();

  useEffect(() => {
    if (!user) {
      return;
    }

    console.log(user.uid);

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
            <Text
              style={{ textAlign: "center" }}
              onPress={() => navigation.navigate("ChatList")}
            >
              ChatList
            </Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          style={{ flex: 1 }}
          onPress={() => navigation.navigate("FriendList")}
        >
          <View style={{}}>
            <Text style={{ textAlign: "center" }}>FriendList</Text>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
};
