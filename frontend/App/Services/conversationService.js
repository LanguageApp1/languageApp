import { db } from '../Config/firebase';
import {
  collection,
  addDoc,
  query,
  orderBy,
  getDocs,
  doc,
  updateDoc,
  arrayUnion,
} from 'firebase/firestore';

const CONVERSATIONS_COLLECTION = 'conversations';

export const createNewConversation = async (userId, title) => {
  try {
    const docRef = await addDoc(collection(db, CONVERSATIONS_COLLECTION), {
      userId,
      title,
      timestamp_created: new Date(),
      conversation_log: [],
    });
    return docRef.id;
  } catch (error) {
    console.error('Error creating conversation:', error);
    throw error;
  }
};

export const addMessageToConversation = async (conversationId, message) => {
  try {
    const conversationRef = doc(db, CONVERSATIONS_COLLECTION, conversationId);
    await updateDoc(conversationRef, {
      conversation_log: arrayUnion({
        speaker: message.speaker,
        timestamp: new Date(),
        message: message.message,
      }),
    });
  } catch (error) {
    console.error('Error adding message:', error);
    throw error;
  }
};

export const getConversations = async (userId) => {
  try {
    const q = query(
      collection(db, CONVERSATIONS_COLLECTION),
      orderBy('timestamp_created', 'desc')
    );

    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  } catch (error) {
    console.error('Error getting conversations:', error);
    throw error;
  }
};
