import { db, handleFirestoreError, OperationType } from '../firebase';
import { 
  collection, 
  doc, 
  setDoc, 
  deleteDoc, 
  getDocs, 
  query, 
  orderBy,
  serverTimestamp 
} from 'firebase/firestore';

export interface UserBookmark {
  id: string;
  userId: string;
  platformId: string;
  platformName: string;
  category: string;
  officialUrl: string;
  createdAt: string;
}

export interface UserApplication {
  id: string;
  userId: string;
  platformId: string;
  platformName: string;
  serviceName: string;
  referenceNumber: string;
  status: 'Submitted' | 'In Verification' | 'Approved' | 'Action Required' | 'Dispatched / Completed';
  submissionDate: string;
  notes: string;
  updatedAt?: any;
}

const LOCAL_STORAGE_BOOKMARKS_KEY = 'sevasync_guest_bookmarks';
const LOCAL_STORAGE_APPLICATIONS_KEY = 'sevasync_guest_applications';

// BOOKMARKS
export async function getBookmarks(userId: string | null): Promise<UserBookmark[]> {
  if (!userId) {
    try {
      const stored = localStorage.getItem(LOCAL_STORAGE_BOOKMARKS_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  }

  const path = `users/${userId}/bookmarks`;
  try {
    const q = query(collection(db, path), orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(d => ({ id: d.id, ...d.data() } as UserBookmark));
  } catch (error) {
    try {
      handleFirestoreError(error, OperationType.LIST, path);
    } catch {
      // Fallback to local storage if Firestore error occurs
    }
    const stored = localStorage.getItem(LOCAL_STORAGE_BOOKMARKS_KEY);
    return stored ? JSON.parse(stored) : [];
  }
}

export async function toggleBookmark(
  userId: string | null,
  platform: { id: string; name: string; category: string; officialUrl: string }
): Promise<boolean> {
  if (!userId) {
    const local = localStorage.getItem(LOCAL_STORAGE_BOOKMARKS_KEY);
    let list: UserBookmark[] = local ? JSON.parse(local) : [];
    const exists = list.some(b => b.platformId === platform.id);
    if (exists) {
      list = list.filter(b => b.platformId !== platform.id);
    } else {
      list.push({
        id: platform.id,
        userId: 'guest',
        platformId: platform.id,
        platformName: platform.name,
        category: platform.category,
        officialUrl: platform.officialUrl,
        createdAt: new Date().toISOString()
      });
    }
    localStorage.setItem(LOCAL_STORAGE_BOOKMARKS_KEY, JSON.stringify(list));
    return !exists;
  }

  const docPath = `users/${userId}/bookmarks/${platform.id}`;
  const docRef = doc(db, 'users', userId, 'bookmarks', platform.id);

  try {
    const list = await getBookmarks(userId);
    const exists = list.some(b => b.platformId === platform.id);
    if (exists) {
      await deleteDoc(docRef);
      return false;
    } else {
      await setDoc(docRef, {
        id: platform.id,
        userId,
        platformId: platform.id,
        platformName: platform.name,
        category: platform.category,
        officialUrl: platform.officialUrl,
        createdAt: new Date().toISOString()
      });
      return true;
    }
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, docPath);
    return false;
  }
}

// APPLICATION TRACKER
export async function getTrackedApplications(userId: string | null): Promise<UserApplication[]> {
  if (!userId) {
    try {
      const stored = localStorage.getItem(LOCAL_STORAGE_APPLICATIONS_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  }

  const path = `users/${userId}/applications`;
  try {
    const q = query(collection(db, path));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(d => ({ id: d.id, ...d.data() } as UserApplication));
  } catch (error) {
    try {
      handleFirestoreError(error, OperationType.LIST, path);
    } catch {
      // fallback
    }
    const stored = localStorage.getItem(LOCAL_STORAGE_APPLICATIONS_KEY);
    return stored ? JSON.parse(stored) : [];
  }
}

export async function saveTrackedApplication(
  userId: string | null,
  appData: Omit<UserApplication, 'id' | 'userId'>,
  existingId?: string
): Promise<UserApplication> {
  const id = existingId || `app_${Date.now()}`;
  const record: UserApplication = {
    ...appData,
    id,
    userId: userId || 'guest',
    updatedAt: new Date().toISOString()
  };

  if (!userId) {
    const local = localStorage.getItem(LOCAL_STORAGE_APPLICATIONS_KEY);
    let list: UserApplication[] = local ? JSON.parse(local) : [];
    const index = list.findIndex(a => a.id === id);
    if (index >= 0) {
      list[index] = record;
    } else {
      list.unshift(record);
    }
    localStorage.setItem(LOCAL_STORAGE_APPLICATIONS_KEY, JSON.stringify(list));
    return record;
  }

  const path = `users/${userId}/applications/${id}`;
  try {
    const docRef = doc(db, 'users', userId, 'applications', id);
    await setDoc(docRef, {
      ...record,
      updatedAt: serverTimestamp()
    });
    return record;
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
    return record;
  }
}

export async function deleteTrackedApplication(userId: string | null, id: string): Promise<void> {
  if (!userId) {
    const local = localStorage.getItem(LOCAL_STORAGE_APPLICATIONS_KEY);
    if (local) {
      const list = JSON.parse(local).filter((a: UserApplication) => a.id !== id);
      localStorage.setItem(LOCAL_STORAGE_APPLICATIONS_KEY, JSON.stringify(list));
    }
    return;
  }

  const path = `users/${userId}/applications/${id}`;
  try {
    await deleteDoc(doc(db, 'users', userId, 'applications', id));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}
