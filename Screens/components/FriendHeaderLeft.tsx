import { useNavigation } from "@react-navigation/core";
import React, { useRef } from "react";
import { TouchableOpacity, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { AddFriendOverlay } from "./AddFriendOverlay";

export const FriendHeaderLeft = () => {
  const ref = useRef<any>();
  const navigation = useNavigation<any>();
  return (
    <TouchableOpacity onPress={() => ref.current.toggleOverlay()}>
      <View>
        <Ionicons name="ios-person-add" size={20} style={{ marginRight: 10 }} />
      </View>
      <AddFriendOverlay ref={ref} />
    </TouchableOpacity>
  );
};
