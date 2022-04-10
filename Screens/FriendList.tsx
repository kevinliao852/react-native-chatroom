import { useNavigation } from "@react-navigation/core";
import firebase from "firebase";
import React, { useContext, useEffect, useState } from "react";
import { ScrollView, TouchableOpacity, View } from "react-native";
import { Text, Image } from "react-native-elements";
import { UserContext } from "../Context/UserContext";
import { Nav } from "./components/Nav";
import { useFriends } from "./hooks/useFriends";

const chatRoom = "ChatRoom2";
const roomsCollectionName = "Rooms";
const roomUserRelations = "User_ChatRoom";

//TODO: extract the fetch logic to apply repository pattern
const createRoomInChatRoom = () =>
  firebase
    .firestore()
    .collection(chatRoom)
    .doc()
    .collection(roomsCollectionName)
    .doc();

const getMyChatListByUserId = (userId: string) =>
  firebase
    .firestore()
    .collection(roomUserRelations)
    .where("userId", "==", userId)
    .get();

const isTheFriendInMyChatList = ({ chatList, friend }: any) => {
  let rooms: Array<any> | undefined;
  chatList.forEach((documentSnapshot: any) => {
    rooms = documentSnapshot.data().rooms as Array<any>;
  });

  if (!Array.isArray(rooms)) {
    throw new Error("rooms is not an array");
  }

  return rooms.filter((room: any) => room.friendId === friend.id).length > 0;
};

const getFriendRoom = ({ chatList, friend }: any) => {
  let rooms: Array<any> | undefined;
  chatList.forEach((documentSnapshot: any) => {
    rooms = documentSnapshot.data().rooms as Array<any>;
  });

  if (!Array.isArray(rooms)) {
    throw new Error("rooms is not an array");
  }

  const filteredRoom = rooms.filter((room: any) => room.friendId === friend.id);

  if (filteredRoom.length !== 1) {
    console.log(filteredRoom);
    throw new Error("there are two chatRooms to ur friend ");
  }

  return filteredRoom[0];
};

const getChatListId = (chatList: any) => {
  let id: string | undefined;
  chatList.forEach((documentSnapshot: any) => {
    id = documentSnapshot.id;
  });

  if (id === undefined) {
    throw new Error("chatLIst id is not found");
  }
  return id;
};

const renderFriends = ({ friend, index, user, navigation }: any) => {
  return (
    <TouchableOpacity
      key={index}
      onPress={async () => {
        const rooms: Array<any> = [];
        const batch = firebase.firestore().batch();
        const newChatRoom = createRoomInChatRoom();
        const chatList = await getMyChatListByUserId(user.uid);
        const chatListId = getChatListId(chatList);

        if (isTheFriendInMyChatList({ chatList, friend })) {
          const room = getFriendRoom({ chatList, friend });
          navigation.navigate("ChatRoom", { roomId: room.roomId });
          return;
        }

        //TODO: change the default rootName
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
  const userContext = useContext<any>(UserContext);
  const navigation = useNavigation<any>();
  const { user } = userContext;
  const { friends } = useFriends(user);

  return (
    <View style={{ flex: 1, backgroundColor: "black" }}>
      <ScrollView style={{ flex: 1, backgroundColor: "white" }}>
        {friends &&
          friends
            .filter((friend: any) => friend.id !== user.uid)
            .map((friend: any, index: any) =>
              renderFriends({ friend, index, user, navigation })
            )}
      </ScrollView>
      <Nav />
    </View>
  );
};
