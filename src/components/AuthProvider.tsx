"use client";

import {
  User,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  sendEmailVerification,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile
} from "firebase/auth";
import {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState
} from "react";
import { auth, googleProvider } from "@/lib/firebase";
import { AccountType, createUserProfileIfMissing } from "@/lib/users";

type RegisterWithEmailInput = {
  displayName: string;
  email: string;
  password: string;
  accountType: AccountType;
};

type AuthContextValue = {
  currentUser: User | null;
  loading: boolean;
  registerWithEmail: (input: RegisterWithEmailInput) => Promise<User>;
  loginWithEmail: (email: string, password: string) => Promise<User>;
  loginWithGoogle: (accountType?: AccountType) => Promise<User>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    return onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setLoading(false);
    });
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      currentUser,
      loading,
      async registerWithEmail({ displayName, email, password, accountType }) {
        const credential = await createUserWithEmailAndPassword(auth, email, password);
        await updateProfile(credential.user, { displayName });
        await createUserProfileIfMissing({
          user: credential.user,
          accountType,
          displayName
        });
        await sendEmailVerification(credential.user);
        return credential.user;
      },
      async loginWithEmail(email, password) {
        const credential = await signInWithEmailAndPassword(auth, email, password);
        return credential.user;
      },
      async loginWithGoogle(accountType = "individual") {
        const credential = await signInWithPopup(auth, googleProvider);
        await createUserProfileIfMissing({
          user: credential.user,
          accountType,
          displayName: credential.user.displayName
        });
        return credential.user;
      },
      async logout() {
        await signOut(auth);
      },
      async resetPassword(email) {
        await sendPasswordResetEmail(auth, email);
      }
    }),
    [currentUser, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}
