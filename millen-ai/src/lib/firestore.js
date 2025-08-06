import { db } from './firebase';
import { collection, addDoc, query, where, onSnapshot, orderBy, serverTimestamp, doc, updateDoc, deleteDoc, writeBatch, getDocs } from 'firebase/firestore';

/**
 * Creates a new chat for a user.
 * @param {string} userId - The ID of the user creating the chat.
 * @returns {Promise<string>} The ID of the newly created chat.
 */
export const createNewChat = async (userId) => {
  const docRef = await addDoc(collection(db, 'chats'), {
    userId: userId,
    createdAt: serverTimestamp(),
    title: 'New Chat' 
  });
  return docRef.id;
};

/**
 * Fetches all chats for a given user in real-time.
 * @param {string} userId - The user's ID.
 * @param {function} callback - Function to call with the list of chats.
 * @returns {function} An unsubscribe function for the listener.
 */
export const getUserChats = (userId, callback) => {
  const q = query(
    collection(db, 'chats'), 
    where('userId', '==', userId), 
    orderBy('createdAt', 'desc')
  );
  return onSnapshot(q, (querySnapshot) => {
    const chats = [];
    querySnapshot.forEach((doc) => {
      chats.push({ id: doc.id, ...doc.data() });
    });
    callback(chats);
  });
};

/**
 * Fetches all messages for a specific chat in real-time.
 * @param {string} chatId - The chat's ID.
 * @param {function} callback - Function to call with the list of messages.
 * @returns {function} An unsubscribe function for the listener.
 */
export const getChatMessages = (chatId, callback) => {
  const messagesRef = collection(db, 'chats', chatId, 'messages');
  const q = query(messagesRef, orderBy('createdAt', 'asc'));

  return onSnapshot(q, (querySnapshot) => {
    const messages = [];
    querySnapshot.forEach((doc) => {
      messages.push({ id: doc.id, ...doc.data() });
    });
    callback(messages);
  });
};

/**
 * Adds a new message to a specific chat's subcollection.
 * @param {string} chatId - The chat's ID.
 * @param {object} message - The message object ({ role, content }).
 */
export const addMessageToChat = async (chatId, message) => {
  const messagesRef = collection(db, 'chats', chatId, 'messages');
  await addDoc(messagesRef, {
    ...message,
    createdAt: serverTimestamp(),
  });
};

/**
 * Updates the title of a specific chat document.
 * @param {string} chatId - The chat's ID.
 * @param {string} title - The new title for the chat.
 */
export const updateChatTitle = async (chatId, title) => {
  const chatRef = doc(db, 'chats', chatId);
  await updateDoc(chatRef, {
    title: title
  });
};

/**
 * Deletes a chat and all of its associated messages in a batch.
 * @param {string} chatId - The ID of the chat to delete.
 */
export const deleteChat = async (chatId) => {
  const chatRef = doc(db, 'chats', chatId);
  const messagesRef = collection(db, 'chats', chatId, 'messages');

  const batch = writeBatch(db);

  const messagesSnapshot = await getDocs(messagesRef);
  messagesSnapshot.forEach((doc) => {
    batch.delete(doc.ref);
  });

  batch.delete(chatRef);

  await batch.commit();
};