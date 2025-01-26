import { StyleSheet, SafeAreaView, TouchableOpacity } from 'react-native';
import React, { useState, useCallback, useEffect } from 'react';
import { GiftedChat, Bubble } from 'react-native-gifted-chat';
import { useRoute } from '@react-navigation/native';
import { Audio } from 'expo-av';
import { Ionicons } from '@expo/vector-icons';
import { Buffer } from 'buffer';

// Find your IP address using:
// - Mac/Linux: ifconfig
// - Windows: ipconfig
// Comment out other options and use your machine's IP
const API_URL = 'http://10.0.0.150:8000'; // Your IP address is correct here
// OR
// const API_URL = 'http://YOUR_MACHINE_IP:8000';  // For physical devices

export default function ChatScreen() {
  const param = useRoute().params;
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedChatFace, setSelectedChatFace] = useState([]);
  const [sound, setSound] = useState(null);
  const [playingMessageId, setPlayingMessageId] = useState(null);

  useEffect(() => {
    setSelectedChatFace(param.selectedFace);
    setMessages([
      {
        _id: 1,
        text: 'Hello, I am ' + param.selectedFace.name,
        createdAt: new Date(),
        user: {
          _id: 2,
          name: 'React Native',
          avatar: param.selectedFace.image,
        },
      },
    ]);
  }, [param.selectedFace]);

  const onSend = useCallback((messages = []) => {
    setMessages((previousMessages) =>
      GiftedChat.append(previousMessages, messages)
    );
    setLoading(true);
    if (messages[0].text) {
      getChatResponse(messages[0].text);
    }
  }, []);

  const playMessage = async (messageId, text) => {
    try {
      // Stop any currently playing message
      if (sound) {
        await sound.unloadAsync();
      }

      if (playingMessageId === messageId) {
        setPlayingMessageId(null);
        return;
      }

      const params = new URLSearchParams({
        text: text,
        provider: 'openai',
        voice: 'alloy',
      });

      const response = await fetch(
        `${API_URL}/text-to-speech?${params.toString()}`,
        {
          method: 'POST',
        }
      );

      if (!response.ok) {
        throw new Error('Failed to get audio');
      }

      // Get the audio data as base64
      const audioData = await response.arrayBuffer();
      const base64Audio = Buffer.from(audioData).toString('base64');
      const audioUri = `data:audio/mpeg;base64,${base64Audio}`;

      const { sound: newSound } = await Audio.Sound.createAsync(
        { uri: audioUri },
        { shouldPlay: true }
      );

      setSound(newSound);
      setPlayingMessageId(messageId);

      // When audio finishes playing
      newSound.setOnPlaybackStatusUpdate(async (status) => {
        if (status.didJustFinish) {
          setPlayingMessageId(null);
          await newSound.unloadAsync();
        }
      });
    } catch (error) {
      console.error('Error playing message:', error);
    }
  };

  const renderBubble = (props) => {
    const message = props.currentMessage;
    const isBot = message.user._id === 2;

    return (
      <Bubble
        {...props}
        wrapperStyle={{
          right: {
            backgroundColor: '#007AFF',
          },
          left: {
            backgroundColor: '#E8E8E8',
          },
        }}
        renderCustomView={() =>
          isBot ? (
            <TouchableOpacity
              style={styles.playButton}
              onPress={() => playMessage(message._id, message.text)}
            >
              <Ionicons
                name={playingMessageId === message._id ? 'pause' : 'play'}
                size={24}
                color={isBot ? '#666' : '#007AFF'}
              />
            </TouchableOpacity>
          ) : null
        }
      />
    );
  };

  const getChatResponse = async (prompt) => {
    try {
      const params = new URLSearchParams({
        prompt: prompt,
        model: 'gpt-3.5-turbo',
      });

      const url = `${API_URL}/chat?${params.toString()}`;
      console.log('Attempting to fetch:', url);

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Server response:', response.status, errorText);
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('Server response:', data);

      if (data.response) {
        const messageId = Math.random() * (9999999 - 1);
        const chatAPIResp = {
          _id: messageId,
          text: data.response,
          createdAt: new Date(),
          user: {
            _id: 2,
            name: 'React Native',
            avatar: selectedChatFace.image,
          },
        };
        setLoading(false);
        setMessages((previousMessages) =>
          GiftedChat.append(previousMessages, chatAPIResp)
        );

        // Automatically play the response
        playMessage(messageId, data.response);
      } else {
        throw new Error('No response from API');
      }
    } catch (error) {
      console.error('Chat API Error:', error);
      setLoading(false);
      const errorMessage = {
        _id: Math.random() * (9999999 - 1),
        text: 'Sorry, there was an error processing your message. Please try again.',
        createdAt: new Date(),
        user: {
          _id: 2,
          name: 'React Native',
          avatar: selectedChatFace.image,
        },
      };
      setMessages((previousMessages) =>
        GiftedChat.append(previousMessages, errorMessage)
      );
    }
  };

  // Clean up sound when component unmounts
  useEffect(() => {
    return sound
      ? () => {
          sound.unloadAsync();
        }
      : undefined;
  }, [sound]);

  return (
    <SafeAreaView style={styles.chatView}>
      <GiftedChat
        messages={messages}
        isTyping={loading}
        onSend={(messages) => onSend(messages)}
        user={{
          _id: 1,
        }}
        renderBubble={renderBubble}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  chatView: {
    flex: 1,
    marginTop: 42,
    backgroundColor: '#fff',
    borderRadius: 10,
  },
  playButton: {
    padding: 8,
    alignSelf: 'flex-end',
  },
});
