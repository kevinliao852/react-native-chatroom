import React from "react";
import { ScrollView, View } from "react-native";
import { Nav } from "./components/Nav";

export const FriendList = () => {
  return (
    <View style={{ flex: 1, backgroundColor: "black" }}>
      <ScrollView style={{ flex: 1, backgroundColor: "white" }}>
        <View></View>
      </ScrollView>
      <Nav />
    </View>
  );
};
