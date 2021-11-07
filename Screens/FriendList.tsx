import firebase from "firebase";
import React, { useContext, useEffect, useState } from "react";
import { ScrollView, TouchableOpacity, View } from "react-native";
import { Text, Image } from "react-native-elements";
import { UserContext } from "../Context/UserContext";
import { Nav } from "./components/Nav";

const RenderFriends = (friend: any, index: any, user: any) => {
  return (
    <TouchableOpacity
      key={index}
      onPress={async () => {
        console.log(friend);
        const batch = firebase.firestore().batch();
        let rooms: Array<any> = [];

        const newChatRoom = firebase
          .firestore()
          .collection("ChatRoom2")
          .doc()
          .collection("Room")
          .doc();

        let hasRoom = false;

        const chatListId = await firebase
          .firestore()
          .collection("User_ChatRoom")
          .where("userId", "==", user.uid)
          .get()
          .then((querySnapshot: any) => {
            let id;
            querySnapshot.forEach((documentSnapshot: any) => {
              rooms = documentSnapshot.data().rooms;
              id = documentSnapshot.id;
              hasRoom =
                rooms.filter((item: any) => item.friendId === friend.id)
                  .length > 0;
            });
            return id;
          });

        if (hasRoom) {
          return;
        }

        rooms.push({
          roomId: newChatRoom.id,
          roomName: newChatRoom.id,
          friendId: friend.id,
        });

        const ChatList = firebase
          .firestore()
          .collection("User_ChatRoom")
          .doc(chatListId);

        batch.set(newChatRoom, {});
        console.log(rooms, friend);
        batch.update(ChatList, { rooms });
        await batch.commit();
      }}
    >
      <View
        style={{
          margin: 20,
          flexDirection: "row",
          alignItems: "center",
        }}
      >
        <Image
          source={{ uri: "https://i.pravatar.cc/" }}
          style={{ width: 40, height: 40, borderRadius: 40 }}
        />
        <Text style={{ marginLeft: 20 }}>{friend.name}</Text>
      </View>
    </TouchableOpacity>
  );
};

export const FriendList = () => {
  const { user } = useContext<any>(UserContext);
  const [friends, setFriends] = useState<any>();

  //console.log("friends", friends);

  useEffect(() => {
    if (!user) {
      return;
    }

    firebase
      .firestore()
      .collection("Friendship")
      .get()
      .then(async (querySnapshot) => {
        let data: any = [];
        querySnapshot.forEach((documentSnapshot) => {
          data = documentSnapshot
            .data()
            .friendIds.map((item: any) => item.get());
        });
        console.log("data", data);
        return Promise.all(data);
      })
      .then((res) =>
        res.map((item: any) => {
          return { ...item.data(), id: item.id };
        })
      )
      .then((res) => {
        console.log(res);
        return res;
      })
      .then(setFriends)
      .catch(console.log);
  }, [user]);

  return (
    <View style={{ flex: 1, backgroundColor: "black" }}>
      <ScrollView style={{ flex: 1, backgroundColor: "white" }}>
        {friends &&
          friends.map((friend: any, index: any) =>
            RenderFriends(friend, index, user)
          )}
      </ScrollView>
      <Nav />
    </View>
  );
};
