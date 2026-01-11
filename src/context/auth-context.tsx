import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import {
  type User,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  sendPasswordResetEmail,
} from "firebase/auth";
import { auth } from "@/config/firebase.config";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/config/firebase.config";
import type { User as UserType } from "@/types";
import { handleError } from "@/lib/helpers";

interface AuthContextType {
  user: User | null;
  userId: string | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuthContext must be used within AuthProvider");
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);
      setLoading(false);

      // Store user data in Firestore if user exists
      if (firebaseUser) {
        try {
          const userSnap = await getDoc(doc(db, "users", firebaseUser.uid));
          
          if (!userSnap.exists()) {
            const userData: UserType = {
              id: firebaseUser.uid,
              name: firebaseUser.displayName || firebaseUser.email?.split("@")[0] || "Anonymous",
              email: firebaseUser.email || "N/A",
              imageUrl: firebaseUser.photoURL || "",
              createdAt: serverTimestamp(),
              updatedAt: serverTimestamp(),
            };

            await setDoc(doc(db, "users", firebaseUser.uid), userData);
          } else {
            // Update existing user data
            await setDoc(
              doc(db, "users", firebaseUser.uid),
              {
                name: firebaseUser.displayName || userSnap.data().name,
                email: firebaseUser.email || userSnap.data().email,
                imageUrl: firebaseUser.photoURL || userSnap.data().imageUrl,
                updatedAt: serverTimestamp(),
              },
              { merge: true }
            );
          }
        } catch (error) {
          handleError(error, "Failed to store user data");
        }
      }
    });

    return () => unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    await signInWithEmailAndPassword(auth, email, password);
  };

  const signUp = async (email: string, password: string) => {
    await createUserWithEmailAndPassword(auth, email, password);
    // Name will be stored in Firestore via onAuthStateChanged
  };

  const signInWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    await signInWithPopup(auth, provider);
  };

  const logout = async () => {
    await signOut(auth);
  };

  const resetPassword = async (email: string) => {
    await sendPasswordResetEmail(auth, email);
  };

  const value: AuthContextType = {
    user,
    userId: user?.uid || null,
    loading,
    signIn,
    signUp,
    signInWithGoogle,
    logout,
    resetPassword,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
