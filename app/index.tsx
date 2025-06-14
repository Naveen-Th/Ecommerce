import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Text, View } from 'react-native';
import '../global.css';
import { useAuthStore } from '../store/authStore';

export default function Index() {
  const { user, userProfile, hasCompletedOnboarding, isLoading } = useAuthStore();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    // Ensure component is mounted before navigation
    setIsMounted(true);
  }, []);

  useEffect(() => {
    console.log('Auth state:', { 
      isLoading, 
      isMounted, 
      hasCompletedOnboarding, 
      hasUser: !!user, 
      hasProfile: !!userProfile 
    });
    
    if (!isLoading && isMounted) {
      if (!hasCompletedOnboarding) {
        console.log('Navigating to onboarding');
        router.replace('/onboarding');
      } else if (!user) {
        console.log('Navigating to login');
        router.replace('/login');
      } else if (userProfile) {
        // Navigate based on user role
        console.log('Navigating based on role:', userProfile.role);
        switch (userProfile.role) {
          case 'customer':
            router.replace('/(tabs)/customer' as any);
            break;
          case 'store':
            router.replace('/(tabs)/store' as any);
            break;
          case 'delivery_boy':
            router.replace('/(tabs)/delivery' as any);
            break;
          default:
            router.replace('/login');
        }
      }
    }
  }, [user, userProfile, hasCompletedOnboarding, isLoading, isMounted]);

  return (
    <View className="flex-1 bg-neutral-0 justify-center items-center">
      <View className="items-center">
        {/* Modern Loading Indicator */}
        <View className="w-16 h-16 bg-neutral-900 rounded-2xl items-center justify-center mb-6">
          <ActivityIndicator size="large" color="#ffffff" />
        </View>
        
        <Text className="text-neutral-900 text-xl font-bold mb-2">
          Setting up your experience
        </Text>
        <Text className="text-neutral-500 text-base text-center px-8">
          Please wait while we prepare everything for you
        </Text>
        
        {__DEV__ && (
          <View className="mt-8 p-4 bg-neutral-100 rounded-2xl">
            <Text className="text-neutral-700 text-sm font-medium mb-2">Debug Info:</Text>
            <Text className="text-neutral-600 text-xs">Loading: {isLoading.toString()}</Text>
            <Text className="text-neutral-600 text-xs">Mounted: {isMounted.toString()}</Text>
            <Text className="text-neutral-600 text-xs">Onboarding: {hasCompletedOnboarding.toString()}</Text>
            <Text className="text-neutral-600 text-xs">User: {user ? 'Yes' : 'No'}</Text>
          </View>
        )}
      </View>
    </View>
  );
}
