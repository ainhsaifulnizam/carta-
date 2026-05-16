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
import { auth, googleProvider, hasFirebaseConfig } from "@/lib/firebase";
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
  firebaseReady: boolean;
  registerWithEmail: (input: RegisterWithEmailInput) => Promise<User>;
  loginWithEmail: (email: string, password: string) => Promise<User>;
  loginWithGoogle: (accountType?: AccountType) => Promise<User>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

function requireFirebaseConfig() {
  if (!hasFirebaseConfig) {
    throw new Error(
      "Firebase is not configured yet. Add your NEXT_PUBLIC_FIREBASE_* values to .env.local, restart the dev server, and enable Google sign-in in Firebase Authentication."
    );
  }
}

function friendlyFirebaseError(error: unknown) {
  const code = typeof error === "object" && error && "code" in error ? String((error as { code?: unknown }).code) : "";

  if (code.includes("operation-not-allowed")) {
    return new Error("Google sign-in is not enabled yet. In Firebase Console, open Authentication > Sign-in method and enable Google.");
  }

  if (code.includes("unauthorized-domain")) {
    return new Error("This localhost/domain is not authorized for Firebase Auth. Add it under Firebase Authentication > Settings > Authorized domains.");
  }

  if (code.includes("popup-closed-by-user")) {
    return new Error("Google sign-in was closed before it completed.");
  }

  if (code.includes("invalid-api-key") || code.includes("api-key-not-valid")) {
    return new Error("Firebase API key is invalid. Check your NEXT_PUBLIC_FIREBASE_* values in .env.local and restart the dev server.");
  }

  return error instanceof Error ? error : new Error("Firebase authentication failed.");
}

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
      firebaseReady: hasFirebaseConfig,
      async registerWithEmail({ displayName, email, password, accountType }) {
        requireFirebaseConfig();
        try {
          const credential = await createUserWithEmailAndPassword(auth, email, password);
          await updateProfile(credential.user, { displayName });
          await createUserProfileIfMissing({
            user: credential.user,
            accountType,
            displayName
          });
          await sendEmailVerification(credential.user);
          return credential.user;
        } catch (error) {
          throw friendlyFirebaseError(error);
        }
      },
      async loginWithEmail(email, password) {
        requireFirebaseConfig();
        try {
          const credential = await signInWithEmailAndPassword(auth, email, password);
          return credential.user;
        } catch (error) {
          throw friendlyFirebaseError(error);
        }
      },
      async loginWithGoogle(accountType = "individual") {
        requireFirebaseConfig();
        try {
          const credential = await signInWithPopup(auth, googleProvider);
          await createUserProfileIfMissing({
            user: credential.user,
            accountType,
            displayName: credential.user.displayName
          });
          return credential.user;
        } catch (error) {
          throw friendlyFirebaseError(error);
        }
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
