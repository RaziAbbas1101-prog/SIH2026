import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { seedPlatforms } from './utils/seedPlatforms';
import { db, testConnection } from './firebase';
import { collection, getCountFromServer } from 'firebase/firestore';

async function initApp() {
  // Mount immediately to ensure fast first render
  const rootElement = document.getElementById('root');
  if (rootElement) {
    createRoot(rootElement).render(
      <StrictMode>
        <App />
      </StrictMode>,
    );
  }

  // Validate Firestore connection per Firebase skill
  testConnection();

  // Background seed check if database is empty or needs update
  try {
    const colRef = collection(db, 'platforms');
    const count = await getCountFromServer(colRef);
    if (count.data().count < 20) {
      await seedPlatforms();
    }
  } catch (err) {
    console.warn('Firestore seeding check skipped (using fallback memory store if offline):', err);
  }
}

initApp();
