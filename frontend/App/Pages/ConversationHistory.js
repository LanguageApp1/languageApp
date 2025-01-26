import { StyleSheet, View, Text, ScrollView } from 'react-native';
import React from 'react';
import { useRoute } from '@react-navigation/native';

export default function ConversationHistory() {
  const route = useRoute();
  const { conversation } = route.params;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Conversation History</Text>
        <Text style={styles.date}>{conversation.date}</Text>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            Conversation with {conversation.botName}
          </Text>
          <Text style={styles.preview}>{conversation.preview}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Analysis</Text>
          <Text style={styles.analysisText}>
            This is a placeholder for conversation analysis. In a real
            implementation, this would include AI-generated insights about the
            conversation, learning progress, and areas for improvement.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    padding: 20,
    paddingTop: 60,
    backgroundColor: '#f8f8f8',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  date: {
    fontSize: 16,
    color: '#666',
    marginTop: 5,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 10,
  },
  preview: {
    fontSize: 16,
    lineHeight: 24,
  },
  analysisText: {
    fontSize: 16,
    lineHeight: 24,
    color: '#444',
  },
});
