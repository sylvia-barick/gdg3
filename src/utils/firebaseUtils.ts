// firebaseUtils.ts
import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, getDocs, doc, getDoc, updateDoc, deleteDoc, Timestamp } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCBcL5gN4-skA_EyKWAt58v-aSG9ZboxZU",
  authDomain: "gdg-org-paro.firebaseapp.com",
  projectId: "gdg-org-paro",
  storageBucket: "gdg-org-paro.appspot.com", // fixed typo: `.app` → `.com`
  messagingSenderId: "626430140066",
  appId: "1:626430140066:web:1a468f25af89145b8801fb",
  measurementId: "G-H7VTSNLTCM"
};

// Init Firebase + Firestore
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

export interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  department: string;
  club: string;
  tags: string[];
  attendees?: number;
  maxAttendees?: number;
  createdAt: Date;
  updatedAt: Date;
}

// 🔹 Add Event
export const addEvent = async (eventData: Omit<Event, 'id' | 'createdAt' | 'updatedAt'>) => {
  try {
    console.log('🚀 Attempting to add event to Firestore:', eventData);
    
    const now = new Date();
    const docRef = await addDoc(collection(db, 'events'), {
      ...eventData,
      createdAt: now,
      updatedAt: now
    });
    
    console.log('✅ Successfully added event with ID:', docRef.id);
    return { id: docRef.id, ...eventData, createdAt: now, updatedAt: now };
  } catch (error) {
    console.error('❌ Error adding event to Firestore:', error);
    throw error;
  }
};

// 🔹 Get All Events
export const getEvents = async (): Promise<Event[]> => {
  const querySnapshot = await getDocs(collection(db, 'events'));
  return querySnapshot.docs.map(doc => {
    const data = doc.data();
    return {
      id: doc.id,
      ...(data as Omit<Event, 'id'>)
    };
  });
};

// 🔹 Get Event by ID
export const getEventById = async (id: string): Promise<Event | null> => {
  const docRef = doc(db, 'events', id);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    const data = docSnap.data();
    return {
      id: docSnap.id,
      ...(data as Omit<Event, 'id'>)
    };
  }
  return null;
};

// 🔹 Update Event
export const updateEvent = async (id: string, updates: Partial<Event>) => {
  const docRef = doc(db, 'events', id);
  await updateDoc(docRef, {
    ...updates,
    updatedAt: new Date()
  });
};

// 🔹 Delete Event
export const deleteEvent = async (id: string) => {
  const docRef = doc(db, 'events', id);
  await deleteDoc(docRef);
};

// 🔹 Test Firebase Connection
export const testFirebaseConnection = async () => {
  try {
    console.log('🧪 Testing Firebase connection...');
    console.log('Firebase config:', firebaseConfig);
    console.log('Firestore instance:', db);
    
    // Try to read from a test collection
    const testQuery = await getDocs(collection(db, 'test'));
    console.log('✅ Firebase connection successful');
    return true;
  } catch (error) {
    console.error('❌ Firebase connection failed:', error);
    return false;
  }
};
