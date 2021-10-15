import React, { useState, useCallback, useEffect } from 'react';
import { Ionicons } from '@expo/vector-icons';
import firebase from '../firebase/firebase';
import {
  Actions,
  Bubble,
  GiftedChat,
  IMessage,
} from 'react-native-gifted-chat';
import { v4 as uuidv4 } from 'uuid';
import { Audio } from 'expo-av';
import { Alert, Text, View } from 'react-native';

export const ChatRoom = (props: any) => {
  const roomId = props.route.params.roomId;
  const collectionName = 'ChatRoom2';
  const [messages, setMessages] = useState<any>([]);
  const [recording, setRecording] = useState<any>();
  const [sound, setSound] = useState<any>();
  const [active, setActive] = useState<boolean>(false);

  useEffect(() => {
    const chatRoom = firebase
      .firestore()
      .collection(collectionName)
      .doc(roomId)
      .collection('Room')
      .orderBy('createdAt', 'desc');

    const HandleSnapshot = (querySnapshot: any) => {
      console.log('Message size: ', querySnapshot.size);
      const storedData: any = [];

      querySnapshot.forEach((documentSnapshot: any) => {
        storedData.push({
          ...documentSnapshot.data(),
          createdAt: documentSnapshot.data().createdAt.toDate(),
        });
      });
      setMessages(storedData);
    };

    const subscriber = chatRoom.onSnapshot(HandleSnapshot);
    (async () => {
      await chatRoom.get().then(HandleSnapshot).catch(console.log);
    })();

    // Stop listening for updates when no longer required
    return () => subscriber();
  }, []);

  useEffect(() => {
    return sound
      ? () => {
          console.log('Unloading Sound');
          sound.unloadAsync();
        }
      : undefined;
  }, [sound]);

  const uploadAudio = async () => {
    const filename = uuidv4();
    const uri = recording.getURI();
    const uriParts = uri.split('.');
    const fileType = uriParts[uriParts.length - 1];
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
        await firebase
          .storage()
          .ref()
          .child(`${filename}.${fileType}`)
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
    return `${filename}.${fileType}`;
  };

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

  const stopRecording = async () => {
    console.log('Stopping recording..');
    setRecording(undefined);
    await recording.stopAndUnloadAsync();
    const uri = recording.getURI();

    const filename = await uploadAudio();
    //console.log(filename);
    const downloadURI = await firebase.storage().ref(filename).getDownloadURL();
    //.catch((e) => console.log);

    console.log(downloadURI);

    const message: IMessage = {
      _id: uuidv4(),
      createdAt: new Date(),
      user: {
        _id: 1,
      },
      text: '',
      audio: downloadURI,
    };

    //console.log(message);

    await firebase
      .firestore()
      .collection(collectionName)
      .doc(roomId)
      .collection('Room')
      .add(message)
      .then(() => console.log('User added'))
      .catch(console.log);

    console.log('Recording stopped and stored at', uri);
  };

  const renderActions = () => {
    return (
      <Ionicons
        name={recording ? 'mic-off' : 'ios-mic'}
        size={35}
        onPress={recording ? stopRecording : startRecording}
      />
    );
  };

  const renderAudio = (props: any) => {
    return !props.currentMessage?.audio ? (
      <View />
    ) : (
      <View>
        <Ionicons
          name="ios-play"
          size={35}
          color={active ? 'green' : 'red'}
          onPress={async () => {
            console.log(props.currentMessage.audio);
            const downloadURI = await firebase
              .storage()
              .refFromURL(props.currentMessage.audio)
              .getDownloadURL();
            const soundObject = new Audio.Sound();
            const d = await soundObject
              .loadAsync({ uri: downloadURI })
              .catch(console.log);

            setSound(soundObject);

            soundObject.setOnPlaybackStatusUpdate((status: any) => {
              console.log(123, status);
              if (status.isPlaying === true) {
                setActive(true);
              } else {
                setActive(false);
              }
            });

            console.log('Playing Sound');
            const s = await soundObject.playAsync();
          }}
        />
      </View>
    );
  };

  const onSend = useCallback((messages: Array<IMessage> = []) => {
    messages.forEach((data: any) => {
      firebase
        .firestore()
        .collection(collectionName)
        .doc(roomId)
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
      //@ts-ignore
      renderMessageAudio={renderAudio}
      renderCustomView={() => renderAudio(props)}
      renderActions={renderActions}
      renderUsernameOnMessage={true}
      renderBubble={(props) => {
        return (
          <View>
            <Bubble {...props}></Bubble>
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
