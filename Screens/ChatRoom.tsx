import React, { useState, useCallback, useEffect } from 'react';
import { Ionicons } from '@expo/vector-icons';
import firebase from '../firebase/firebase';
import {
  Actions,
  Bubble,
  GiftedChat,
  IMessage,
} from 'react-native-gifted-chat';
import { Audio } from 'expo-av';
import { Alert, View } from 'react-native';

export const ChatRoom = (props: any) => {
  const uploadAudio = async () => {
    const uri = recording.getURI();
    try {
      const blob: any = await new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.onload = () => {
          try {
            resolve(xhr.response);
          } catch (error) {
            console.log('error:', error);
          }
        };
        xhr.onerror = (e) => {
          console.log(e);
          reject(new TypeError('Network request failed'));
        };
        xhr.responseType = 'blob';
        xhr.open('GET', uri, true);
        xhr.send(null);
      });
      if (blob != null) {
        const uriParts = uri.split('.');
        const fileType = uriParts[uriParts.length - 1];
        firebase
          .storage()
          .ref()
          .child(`audio02.${fileType}`)
          .put(blob, {
            contentType: `audio/${fileType}`,
          })
          .then(() => {
            console.log('Sent!');
          })
          .catch((e) => console.log('error:', e));
      } else {
        console.log('error with blob');
      }
    } catch (error) {
      console.log('error:', error);
    }
  };
  console.log(props.route.params.roomId);

  const [messages, setMessages] = useState<any>([]);
  const [recording, setRecording] = useState<any>();
  const [sound, setSound] = useState<any>();
  useEffect(() => {
    return sound
      ? () => {
          console.log('Unloading Sound');
          sound.unloadAsync();
        }
      : undefined;
  }, [sound]);
  console.log('recording', recording);
  async function stopRecording() {
    console.log('Stopping recording..');
    setRecording(undefined);
    await recording.stopAndUnloadAsync();
    const uri = recording.getURI();

    await uploadAudio();

    const downloadUri = await firebase
      .storage()
      .ref('audio02.caf')
      .getDownloadURL()
      .catch((e) => console.log);

    const message: IMessage = {
      _id: 'xxxx123',
      createdAt: new Date(),
      user: {
        _id: 1,
      },
      text: '',
      audio: downloadUri,
    };

    await firebase
      .firestore()
      .collection('ChatRoom2')
      .doc('Ghkfy5xoq7cGHfysRg8j')
      .collection('Room')
      .add(message)
      .then(() => console.log('User added'))
      .catch(console.log);

    console.log('Recording stopped and stored at', uri);
  }
  const startRecording = async () => {
    try {
      await Audio.requestPermissionsAsync();
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });
      console.log('Starting recording..');
      const { recording } = await Audio.Recording.createAsync(
        Audio.RECORDING_OPTIONS_PRESET_HIGH_QUALITY
      );
      setRecording(recording);
      console.log('Recording started');
    } catch (err: any) {
      console.log(err);
    }
  };
  const renderActions = (props: any) => {
    return (
      <Ionicons
        name={recording ? 'mic-off' : 'ios-mic'}
        size={35}
        onPress={recording ? stopRecording : startRecording}
      />
    );
  };
  const renderAudio = (props: any) => {
    return !props.currentMessage.audio ? (
      <View />
    ) : (
      <Ionicons
        name="ios-play"
        size={35}
        color={sound ? 'red' : 'green'}
        style={{
          left: 90,
          position: 'relative',
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 0 },
          shadowOpacity: 0.5,
          backgroundColor: 'transparent',
        }}
        onPress={async () => {
          console.log(props.currentMessage.audio);
          const downloadUri = await firebase
            .storage()
            .ref('audio02.caf')
            .getDownloadURL();
          const soundObject = new Audio.Sound();
          await soundObject.loadAsync({ uri: downloadUri });

          setSound(soundObject);

          console.log('Playing Sound');
          await soundObject.playAsync().catch(console.log);
        }}
      />
    );
  };
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
          //console.log(storedData);
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
      showAvatarForEveryMessage
      renderMessageAudio={renderAudio}
      renderActions={renderActions}
      renderBubble={(props) => {
        return (
          <View>
            {renderAudio(props)}
            <Bubble {...props} />
          </View>
        );
      }}
      messages={messages}
      onSend={(messages) => onSend(messages)}
      user={{
        _id: 1,
      }}
    />
  );
};
