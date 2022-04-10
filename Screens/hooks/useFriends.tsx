import firebase from "firebase";
import { useEffect, useState } from "react";
import { Friendship } from "../type/friendship";
import { User } from "../type/user";

export type Friend = {
  name: string;
  id: string;
};

export function useFriends(user: User) {
  const [friends, setFriends] = useState<Array<Friend>>([]);
  // TODO Fix refetching issue (use redux or context hook)

  useEffect(() => {
    if (!user) {
      return;
    }

    firebase
      .firestore()
      .collection("Friendship")
      .where("userId", "==", user.uid)
      .get()
      .then((querySnapshot) => {
        let data: Array<Promise<firebase.firestore.DocumentData>> = [];
        querySnapshot.forEach((documentSnapshot) => {
          const friendship = documentSnapshot.data() as Friendship;
          data = friendship.friendIds.map(
            (item: firebase.firestore.DocumentReference) => item.get()
          );
        });
        return Promise.all(data);
      })
      .then((res) =>
        res.map((item) => {
          return { ...item.data(), id: item.id } as Friend;
        })
      )
      .then((data) => setFriends(data))
      .catch(console.log);
  }, [user]);

  return { friends };
}
