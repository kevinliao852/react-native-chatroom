import { useNavigation } from "@react-navigation/core";
import React from "react";
import { TouchableOpacity, View } from "react-native";
import { Text } from "react-native-elements";

export const Nav = () => {
  const navigation = useNavigation<any>();

  return (
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
  );
};
