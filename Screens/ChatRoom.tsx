import React, { useState, useCallback, useEffect } from 'react';
import firebase from '../firebase/firebase';
import { GiftedChat, IMessage } from 'react-native-gifted-chat';

export const ChatRoom = (props: any) => {
  console.log(props.route.params.roomId);
  const [messages, setMessages] = useState<any>([]);
  useEffect(() => {
    console.log(firebase.auth().currentUser);
    const subscriber = firebase
      .firestore()
      .collection('ChatRoom2')
      .doc('Ghkfy5xoq7cGHfysRg8j')
      .collection('Room')
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
    (async () => {
      await firebase
        .firestore()
        .collection('ChatRoom2')
        .doc('Ghkfy5xoq7cGHfysRg8j')
        .collection('Room')
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
        })
        .catch(console.log);
    })();

    // Stop listening for updates when no longer required
    return () => subscriber();
  }, []);

  const onSend = useCallback((messages: Array<IMessage> = []) => {
    messages.forEach((data: any) => {
      firebase
        .firestore()
        .collection('ChatRoom2')
        .doc('Ghkfy5xoq7cGHfysRg8j')
        .collection('Room')
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
