import React, { useState, useCallback, useEffect } from 'react';
import firebase from '../firebase/firebase';
import { GiftedChat, IMessage } from 'react-native-gifted-chat';
import { TEST_ACCOUNT, TEST_PASSWORD } from '@env';

export const ChatRoom = () => {
  const [messages, setMessages] = useState<any>([]);

  useEffect(() => {
    let subscriber: any;
    (async () => {
      await firebase
        .auth()
        .signInWithEmailAndPassword(TEST_ACCOUNT, TEST_PASSWORD)
        .catch(console.log);

      await firebase
        .firestore()
        .collection('ChatRoom')
        .orderBy('createdAt', 'desc')
        .get()
        .then((querySnapshot) => {
          console.log('Total users: ', querySnapshot.size);

          const storedData: any = [];

          querySnapshot.forEach((documentSnapshot) => {
            storedData.push({
              ...documentSnapshot.data(),
              createdAt: documentSnapshot.data().createdAt.toDate(),
            });
          });
          setMessages(storedData);
          console.log(storedData);
        });

      subscriber = firebase
        .firestore()
        .collection('ChatRoom')
        .orderBy('createdAt', 'desc')
        .onSnapshot((querySnapshot: any) => {
          console.log('User size: ', querySnapshot.size);
          const storedData: any = [];

          querySnapshot.forEach((documentSnapshot: any) => {
            storedData.push({
              ...documentSnapshot.data(),
              createdAt: documentSnapshot.data().createdAt.toDate(),
            });
          });
          setMessages(storedData);
        });
    })();

    // Stop listening for updates when no longer required
    return () => subscriber();
  }, []);

  const onSend = useCallback((messages: Array<IMessage> = []) => {
    messages.forEach((data: any) => {
      firebase
        .firestore()
        .collection('ChatRoom')
        .add(data)
        .then(() => console.log('User added'));
    });

    setMessages((previousMessages: any) =>
      GiftedChat.append(previousMessages, messages)
    );
  }, []);

  return (
    <GiftedChat
      messages={messages}
      onSend={(messages) => onSend(messages)}
      user={{
        _id: 1,
      }}
    />
  );
};
