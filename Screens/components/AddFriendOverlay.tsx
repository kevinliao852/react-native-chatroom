import React, { forwardRef, useImperativeHandle, useState } from "react";
import { TextInput, View } from "react-native";
import { Button, Overlay, Text } from "react-native-elements";

export const AddFriendOverlay = forwardRef((prop: any, ref: any) => {
  const [visible, setVisible] = useState(false);
  useImperativeHandle(ref, () => ({ toggleOverlay }));

  const toggleOverlay = () => {
    setVisible(!visible);
  };

  return (
    <View>
      <Overlay
        isVisible={visible}
        onBackdropPress={toggleOverlay}
        overlayStyle={{
          padding: 40,
        }}
      >
        <Text style={{ fontSize: 20, fontWeight: "600", marginBottom: 20 }}>
          Add a New Friend
        </Text>
        <TextInput placeholder="Enter User Id" />
      </Overlay>
    </View>
  );
});
