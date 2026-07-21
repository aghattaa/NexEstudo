import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  User as FirebaseUser,
  updateProfile,
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db } from '../lib/firebase';

export interface UserProfile {
  name: string;
  email: string;
  learningPreference: 'Visual' | 'Leitura' | 'Prático' | null;
  avatarUrl?: string;
}

interface UserContextType {
  user: UserProfile | null;
  firebaseUser: FirebaseUser | null;
  setUser: (user: UserProfile | null) => void;
  updateUser: (data: Partial<UserProfile>) => Promise<void>;
  isAuthenticated: boolean;
  setIsAuthenticated: (val: boolean) => void;
  logout: () => Promise<void>;
  loginWithEmail: (email: string, password: string) => Promise<void>;
  registerWithEmail: (name: string, email: string, password: string) => Promise<void>;
  authLoading: boolean;
  authError: string | null;
  setAuthError: (err: string | null) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);
  const [authError, setAuthError] = useState<string | null>(null);

  // Listen to Firebase auth state — ALWAYS resolves authLoading
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (fbUser) => {
      try {
        if (fbUser) {
          setFirebaseUser(fbUser);
          // Try to load profile from Firestore — but don't block auth if it fails
          try {
            const docRef = doc(db, 'users', fbUser.uid);
            const snap = await getDoc(docRef);
            if (snap.exists()) {
              setUser(snap.data() as UserProfile);
            } else {
              // New user profile not saved yet — use Firebase Auth display name
              setUser({
                name: fbUser.displayName || 'Estudante',
                email: fbUser.email || '',
                learningPreference: null,
              });
            }
          } catch (firestoreErr) {
            // Firestore error should NOT block login — use fallback profile
            console.warn('Firestore profile load failed, using fallback:', firestoreErr);
            setUser({
              name: fbUser.displayName || 'Estudante',
              email: fbUser.email || '',
              learningPreference: null,
            });
          }
          setIsAuthenticated(true);
        } else {
          setFirebaseUser(null);
          setUser(null);
          setIsAuthenticated(false);
        }
      } catch (err) {
        console.error('Auth state change error:', err);
        setFirebaseUser(null);
        setUser(null);
        setIsAuthenticated(false);
      } finally {
        // ALWAYS clear loading — this prevents the eternal black splash screen
        setAuthLoading(false);
      }
    });
    return unsubscribe;
  }, []);

  const loginWithEmail = async (email: string, password: string) => {
    setAuthError(null);
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (err: any) {
      console.error('Login error:', err.code, err.message);
      const msg = translateFirebaseError(err.code);
      setAuthError(msg);
      throw err;
    }
  };

  const registerWithEmail = async (name: string, email: string, password: string) => {
    setAuthError(null);
    try {
      const cred = await createUserWithEmailAndPassword(auth, email, password);
      
      // Update Firebase Auth display name
      await updateProfile(cred.user, { displayName: name });
      
      // Save profile to Firestore — best effort, don't block registration if it fails
      const profile: UserProfile = {
        name,
        email,
        learningPreference: null,
      };
      try {
        await setDoc(doc(db, 'users', cred.user.uid), profile);
      } catch (firestoreErr) {
        console.warn('Could not save profile to Firestore:', firestoreErr);
        // Still continue — user IS created in Auth
      }
      
      setUser(profile);
      // onAuthStateChanged will handle setIsAuthenticated(true)
    } catch (err: any) {
      console.error('Register error:', err.code, err.message);
      const msg = translateFirebaseError(err.code);
      setAuthError(msg);
      throw err;
    }
  };

  const updateUser = async (data: Partial<UserProfile>) => {
    const merged = user
      ? { ...user, ...data }
      : { name: '', email: '', learningPreference: null, ...data } as UserProfile;
    setUser(merged);
    if (firebaseUser) {
      try {
        await setDoc(doc(db, 'users', firebaseUser.uid), merged, { merge: true });
      } catch (err) {
        console.warn('Could not update profile in Firestore:', err);
      }
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
    } catch (err) {
      console.error('Logout error:', err);
    }
    setUser(null);
    setFirebaseUser(null);
    setIsAuthenticated(false);
  };

  return (
    <UserContext.Provider value={{
      user, firebaseUser, setUser, updateUser,
      isAuthenticated, setIsAuthenticated,
      logout, loginWithEmail, registerWithEmail,
      authLoading, authError, setAuthError,
    }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}

function translateFirebaseError(code: string): string {
  switch (code) {
    case 'auth/user-not-found':
    case 'auth/wrong-password':
    case 'auth/invalid-credential':
      return 'Email ou senha incorretos. Tente novamente.';
    case 'auth/email-already-in-use':
      return 'Este email já está cadastrado. Faça login.';
    case 'auth/weak-password':
      return 'A senha deve ter pelo menos 6 caracteres.';
    case 'auth/invalid-email':
      return 'Email inválido. Verifique e tente novamente.';
    case 'auth/too-many-requests':
      return 'Muitas tentativas. Aguarde um momento.';
    case 'auth/network-request-failed':
      return 'Erro de rede. Verifique sua conexão com a internet.';
    case 'auth/operation-not-allowed':
      return 'Login com email/senha não está ativado. Ative no Firebase Console.';
    case 'auth/user-disabled':
      return 'Esta conta foi desativada.';
    case 'auth/requires-recent-login':
      return 'Por segurança, faça login novamente.';
    default:
      return `Ocorreu um erro (${code || 'desconhecido'}). Verifique sua conexão e tente novamente.`;
  }
}
