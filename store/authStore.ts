import AsyncStorage from '@react-native-async-storage/async-storage';
import { Session, User } from '@supabase/supabase-js';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

export type UserRole = 'customer' | 'store' | 'delivery_boy';

export interface UserProfile {
  id: string;
  email: string;
  role: UserRole;
  full_name: string;
  phone?: string;
  avatar_url?: string;
  created_at: string;
  updated_at: string;
  // Customer specific fields
  address?: string;
  city?: string;
  // Store specific fields
  store_name?: string;
  store_address?: string;
  store_description?: string;
  store_category?: string;
  // Delivery boy specific fields
  vehicle_type?: string;
  license_number?: string;
  is_available?: boolean;
}

interface AuthState {
  user: User | null;
  session: Session | null;
  userProfile: UserProfile | null;
  isLoading: boolean;
  hasCompletedOnboarding: boolean;
  setUser: (user: User | null) => void;
  setSession: (session: Session | null) => void;
  setUserProfile: (profile: UserProfile | null) => void;
  setLoading: (loading: boolean) => void;
  setOnboardingComplete: (complete: boolean) => void;
  signOut: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      session: null,
      userProfile: null,
      isLoading: true,
      hasCompletedOnboarding: false,
      setUser: (user) => set({ user }),
      setSession: (session) => set({ session }),
      setUserProfile: (userProfile) => set({ userProfile }),
      setLoading: (isLoading) => set({ isLoading }),
      setOnboardingComplete: (hasCompletedOnboarding) => set({ hasCompletedOnboarding }),
      signOut: () => set({ 
        user: null, 
        session: null, 
        userProfile: null,
        hasCompletedOnboarding: false 
      }),
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        hasCompletedOnboarding: state.hasCompletedOnboarding,
        userProfile: state.userProfile,
      }),
    }
  )
);
