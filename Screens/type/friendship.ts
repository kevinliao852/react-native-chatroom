import firebase from "firebase";

export type Friendship = {
  friendIds: Array<firebase.firestore.DocumentReference>;
  userId: string;
};
