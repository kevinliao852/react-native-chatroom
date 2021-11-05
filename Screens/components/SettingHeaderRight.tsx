import { useNavigation } from "@react-navigation/core";
import React from "react";
import { TouchableOpacity, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export const SettingHeaderRight = (props: any) => {
  const navigation = useNavigation<any>();
  return (
    <TouchableOpacity onPress={() => navigation.navigate("Setting")}>
      <View>
        <Ionicons name="settings" size={20} style={{ marginRight: 10 }} />
      </View>
    </TouchableOpacity>
  );
};
