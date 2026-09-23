import { createContext, useContext, useState, useEffect } from 'react';
import { 
  onAuthStateChanged, 
  User, 
  signInWithPopup, 
  GoogleAuthProvider, 
  signOut,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  UserCredential
} from 'firebase/auth';
import { auth } from '../firebase';

type AuthContextType = {
  user: User | null;
  loading: boolean;
  loginGoogle: () => Promise<UserCredential>;
  loginEmail: (email: string, pass: string) => Promise<UserCredential>;
  signupEmail: (email: string, pass: string) => Promise<UserCredential>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const loginGoogle = () => signInWithPopup(auth, new GoogleAuthProvider());
  const loginEmail = (email: string, pass: string) => signInWithEmailAndPassword(auth, email, pass);
  const signupEmail = (email: string, pass: string) => createUserWithEmailAndPassword(auth, email, pass);
  const logout = () => signOut(auth);

  return (
    <AuthContext.Provider value={{ user, loading, loginGoogle, loginEmail, signupEmail, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext)!;
