import { useNavigation } from "@react-navigation/core";
import React, { useContext, useEffect, useState } from "react";
import { View, Text, Button, TextInput } from "react-native";
import { Input } from "react-native-elements";
import firebase from "../firebase/firebase";
import { TEST_ACCOUNT, TEST_PASSWORD } from "@env";
import { UserContext } from "../Context/UserContext";

export const Login = () => {
  const navigation = useNavigation<any>();
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [Loading, setLoading] = useState<boolean>(true);
  const { user, setUser } = useContext<any>(UserContext);

  useEffect(() => {
    (async () => {
      const subscriber = firebase.auth().onAuthStateChanged((currentUser) => {
        if (currentUser) {
          const { uid, email } = currentUser;
          setUser({ ...{ uid, email } });
          navigation.navigate("ChatList");
        } else {
          setLoading(false);
        }
      });
      return subscriber; // unsubscribe on unmount
    })();
  }, []);

  return (
    <View style={{ padding: 50, paddingTop: 100 }}>
      {Loading ? (
        <View>
          <Text style={{ textAlign: "center" }}>Loading</Text>
        </View>
      ) : (
        <View>
          <Input
            label="Username"
            onChangeText={(value: string) => setUsername(value)}
          />
          <Input
            label="Password"
            onChangeText={(value: string) => setPassword(value)}
            secureTextEntry
          />
          <Button
            onPress={() => {
              (async () => {
                console.log(username, password);
                await firebase
                  .auth()
                  .signInWithEmailAndPassword(username, password)
                  .then(() => navigation.navigate("ChatList"))
                  .catch(console.log);
              })();
            }}
            title="Login"
          />
        </View>
      )}
    </View>
  );
};
