import firebase from "firebase";
import React, {
  forwardRef,
  useContext,
  useImperativeHandle,
  useState,
} from "react";
import { TextInput, TouchableOpacity, View } from "react-native";
import { Button, Overlay, Text } from "react-native-elements";
import { UserContext } from "../../Context/UserContext";

export const AddFriendOverlay = forwardRef((prop: any, ref: any) => {
  const [visible, setVisible] = useState(false);
  const { user } = useContext<any>(UserContext);
  const [friendId, setFriendId] = useState("");
  useImperativeHandle(ref, () => ({ toggleOverlay }));

  console.log(friendId);

  const toggleOverlay = () => {
    setVisible(!visible);
  };

  function addFriend(friendRef: firebase.firestore.DocumentReference) {
    return firebase
      .firestore()
      .collection("Friendship")
      .where("userId", "==", user.uid)
      .get()
      .then((querySnapshot) => {
        querySnapshot.forEach((documentSnapshot) => {
          const friendship = documentSnapshot.ref;
          friendship.update({
            friendIds: firebase.firestore.FieldValue.arrayUnion(friendRef),
          });
        });
      });
  }

  return (
    <View>
      <Overlay
        isVisible={visible}
        onBackdropPress={toggleOverlay}
        overlayStyle={{
          padding: 40,
          width: "90%",
        }}
      >
        <Text
          style={{
            fontSize: 20,
            fontWeight: "600",
            marginBottom: 20,
            textAlign: "center",
          }}
        >
          Add a New Friend
        </Text>
        <View style={{ borderBottomWidth: 1 }}>
          <TextInput
            placeholder="Enter User Id"
            defaultValue=""
            onChangeText={(data) => {
              setFriendId(data);
            }}
          />
        </View>
        <TouchableOpacity
          onPress={() => {
            const friendRef = firebase
              .firestore()
              .collection("Users")
              .doc(friendId);
            addFriend(friendRef).then(() => toggleOverlay());
          }}
        >
          <Text style={{ textAlign: "center", marginTop: 40 }}>Add</Text>
        </TouchableOpacity>
      </Overlay>
    </View>
  );
});
