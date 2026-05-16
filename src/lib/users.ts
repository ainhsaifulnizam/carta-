import type { User } from "firebase/auth";
import { doc, getDoc, serverTimestamp, setDoc, updateDoc } from "firebase/firestore";
import { db } from "./firebase";

export type AccountType = "individual" | "organisation";

export type AppUser = {
  uid: string;
  email: string | null;
  displayName: string | null;
  accountType: AccountType;
  onboardingCompleted: boolean;
  emailVerified: boolean;
  createdAt: unknown;
  updatedAt: unknown;
};

export type UserOnboardingProfile = {
  accountType: AccountType;
  profile: Record<string, unknown>;
};

export type CreateUserProfileInput = {
  user: User;
  accountType: AccountType;
  displayName?: string | null;
};

export async function createUserProfileIfMissing({
  user,
  accountType,
  displayName
}: CreateUserProfileInput): Promise<void> {
  const userRef = doc(db, "users", user.uid);
  const existing = await getDoc(userRef);

  if (existing.exists()) {
    await updateDoc(userRef, {
      emailVerified: user.emailVerified,
      updatedAt: serverTimestamp()
    });
    return;
  }

  await setDoc(userRef, {
    uid: user.uid,
    email: user.email,
    displayName: displayName ?? user.displayName ?? null,
    accountType,
    onboardingCompleted: false,
    emailVerified: user.emailVerified,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  });
}

export async function saveUserOnboardingProfile(
  user: User,
  { accountType, profile }: UserOnboardingProfile
): Promise<void> {
  const userRef = doc(db, "users", user.uid);

  await setDoc(
    userRef,
    {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName ?? null,
      accountType,
      onboardingCompleted: true,
      emailVerified: user.emailVerified,
      profile,
      updatedAt: serverTimestamp()
    },
    { merge: true }
  );
}
