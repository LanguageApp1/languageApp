import { StyleSheet, SafeAreaView } from 'react-native';
import React, { useState, useCallback, useEffect } from 'react';
import { GiftedChat } from 'react-native-gifted-chat';
import { useRoute } from '@react-navigation/native';

const API_URL = 'http://192.168.1.100:8000'; // Use your actual IP address

export default function ChatScreen() {
  const param = useRoute().params;
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedChatFace, setSelectedChatFace] = useState([]);

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

  const getChatResponse = async (prompt) => {
    try {
      // Using URLSearchParams to properly encode parameters
      const params = new URLSearchParams({
        prompt: prompt,
        model: 'gpt-3.5-turbo',
      });

      const response = await fetch(`${API_URL}/chat?${params.toString()}`, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data.response) {
        const chatAPIResp = {
          _id: Math.random() * (9999999 - 1),
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

  return (
    <SafeAreaView style={styles.chatView}>
      <GiftedChat
        messages={messages}
        isTyping={loading}
        onSend={(messages) => onSend(messages)}
        user={{
          _id: 1,
        }}
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
});
