"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { useAuth } from "./auth";
import {
  subscribeUserProfile,
  subscribeHoldings,
  subscribeDeposits,
  type UserProfile,
  type Holding,
  type Deposit,
} from "./user-data";

type UserDataValue = {
  uid: string | null;
  profile: UserProfile | null;
  holdings: Holding[];
  deposits: Deposit[];
  loadingProfile: boolean;
  loadingHoldings: boolean;
  loadingDeposits: boolean;
};

const UserDataContext = createContext<UserDataValue | undefined>(undefined);

export function UserDataProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const uid = user?.uid ?? null;

  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [holdings, setHoldings] = useState<Holding[]>([]);
  const [deposits, setDeposits] = useState<Deposit[]>([]);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [loadingHoldings, setLoadingHoldings] = useState(true);
  const [loadingDeposits, setLoadingDeposits] = useState(true);

  useEffect(() => {
    if (!uid) {
      setProfile(null);
      setHoldings([]);
      setDeposits([]);
      return;
    }
    setLoadingProfile(true);
    setLoadingHoldings(true);
    setLoadingDeposits(true);

    const unsubProfile = subscribeUserProfile(uid, (p) => {
      setProfile(p);
      setLoadingProfile(false);
    });
    const unsubHoldings = subscribeHoldings(uid, (h) => {
      setHoldings(h);
      setLoadingHoldings(false);
    });
    const unsubDeposits = subscribeDeposits(uid, (d) => {
      setDeposits(d);
      setLoadingDeposits(false);
    });

    return () => {
      unsubProfile();
      unsubHoldings();
      unsubDeposits();
    };
  }, [uid]);

  const value: UserDataValue = {
    uid,
    profile,
    holdings,
    deposits,
    loadingProfile,
    loadingHoldings,
    loadingDeposits,
  };

  return (
    <UserDataContext.Provider value={value}>
      {children}
    </UserDataContext.Provider>
  );
}

export function useUserData(): UserDataValue {
  const ctx = useContext(UserDataContext);
  if (!ctx) {
    throw new Error("useUserData doit être utilisé dans <UserDataProvider>");
  }
  return ctx;
}
