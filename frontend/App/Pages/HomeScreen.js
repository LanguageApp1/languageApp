import {
  StyleSheet,
  View,
  TouchableOpacity,
  Text,
  FlatList,
} from 'react-native';
import React, { useState, useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import { getConversations } from '../Services/conversationService';

export default function HomeScreen() {
  const navigation = useNavigation();
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadConversations = async () => {
      try {
        const data = await getConversations('anonymous'); // Replace with actual userId
        setConversations(
          data.map((conv) => ({
            id: conv.id,
            date: conv.timestamp_created.toDate().toLocaleDateString(),
            preview: conv.conversation_log[0]?.message || 'Empty conversation',
            botName: conv.title,
          }))
        );
      } catch (error) {
        console.error('Error loading conversations:', error);
      } finally {
        setLoading(false);
      }
    };

    loadConversations();
  }, []);

  const startNewChat = () => {
    console.log('Navigating to ChatFaceScreen'); // Add debug log
    navigation.navigate('ChatFaceScreen');
  };

  const viewConversation = (conversation) => {
    navigation.navigate('ConversationHistory', { conversation }); // This looks correct
  };

  const renderConversationItem = ({ item }) => (
    <TouchableOpacity
      style={styles.conversationItem}
      onPress={() => viewConversation(item)}
    >
      <Text style={styles.conversationDate}>{item.date}</Text>
      <Text style={styles.conversationBot}>{item.botName}</Text>
      <Text style={styles.conversationPreview} numberOfLines={2}>
        {item.preview}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Language Learning Assistant</Text>
      </View>

      <TouchableOpacity style={styles.startButton} onPress={startNewChat}>
        <Text style={styles.startButtonText}>Start New Conversation</Text>
      </TouchableOpacity>

      <View style={styles.historySection}>
        <Text style={styles.historyTitle}>Previous Conversations</Text>
        <FlatList
          data={conversations}
          renderItem={renderConversationItem}
          keyExtractor={(item) => item.id}
          style={styles.historyList}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
  },
  header: {
    marginTop: 40,
    marginBottom: 30,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  startButton: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 30,
  },
  startButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  historySection: {
    flex: 1,
  },
  historyTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 15,
  },
  historyList: {
    flex: 1,
  },
  conversationItem: {
    padding: 15,
    borderRadius: 10,
    backgroundColor: '#f5f5f5',
    marginBottom: 10,
  },
  conversationDate: {
    fontSize: 14,
    color: '#666',
  },
  conversationBot: {
    fontSize: 16,
    fontWeight: '600',
    marginVertical: 5,
  },
  conversationPreview: {
    fontSize: 14,
    color: '#444',
  },
});
