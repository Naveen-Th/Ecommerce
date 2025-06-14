import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  Alert,
  Modal,
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import StoreSetup from '../../../components/stores/StoreSetup';
import { useAuthStore } from '../../../store/authStore';
import { useStoreManagement } from '../../../store/storeManagement';
import { supabase } from '../../../utils/supabase';

export default function StoreProfileScreen() {
  const { userProfile, signOut } = useAuthStore();
  const {
    currentStore,
    isLoadingStore,
    fetchStore,
    createNewStore,
  } = useStoreManagement();

  const [showStoreSetup, setShowStoreSetup] = useState(false);

  const loadStoreData = React.useCallback(async () => {
    if (!userProfile?.id) return;

    try {
      await fetchStore(userProfile.id);
    } catch (error) {
      console.error('Error loading store:', error);
    }
  }, [userProfile?.id, fetchStore]);

  useEffect(() => {
    loadStoreData();
  }, [loadStoreData]);

  const handleStoreCreated = async (storeData: any) => {
    const success = await createNewStore(storeData);
    if (success) {
      Alert.alert('Success', 'Your store has been created successfully!');
      setShowStoreSetup(false);
    } else {
      Alert.alert('Error', 'Failed to create store. Please try again.');
    }
    return success;
  };

  const handleStoreDetails = () => {
    if (currentStore) {
      // Navigate to store details edit screen (could be implemented later)
      Alert.alert('Store Details', 'Store details editing will be implemented here.');
    } else {
      setShowStoreSetup(true);
    }
  };

  const handleSignOut = async () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Sign Out',
          style: 'destructive',
          onPress: async () => {
            await supabase.auth.signOut();
            signOut();
            router.replace('/onboarding');
          },
        },
      ]
    );
  };

  const profileOptions: {
    icon: string;
    title: string;
    subtitle?: string;
    action: () => void;
  }[] = [
    { 
      icon: 'storefront-outline', 
      title: currentStore ? 'Store Details' : 'Set up Store', 
      subtitle: currentStore ? currentStore.name : 'Complete your store setup',
      action: handleStoreDetails 
    },
    { icon: 'location-outline', title: 'Store Location', action: () => {} },
    { icon: 'time-outline', title: 'Operating Hours', action: () => {} },
    { icon: 'card-outline', title: 'Payment Settings', action: () => {} },
    { icon: 'notifications-outline', title: 'Notifications', action: () => {} },
    { icon: 'help-circle-outline', title: 'Help & Support', action: () => {} },
    { icon: 'settings-outline', title: 'Settings', action: () => {} },
  ];

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="bg-white px-6 py-6 border-b border-gray-100">
        <Text className="text-gray-900 text-2xl font-bold">Profile</Text>
      </View>

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Store Address Section */}
        <View className="bg-white mt-4 px-6 py-6">
          <Text className="text-gray-900 text-lg font-bold mb-4">Store Address</Text>
          <View className="flex-row items-center">
            <Ionicons name="location" size={20} color="#6b7280" />
            <Text className="text-gray-700 ml-3 flex-1">
              {currentStore?.address || userProfile?.store_address || 'Gubbi'}
            </Text>
          </View>
        </View>

        {/* Profile Options */}
        <View className="bg-white mt-4">
          {profileOptions.map((option, index) => (
            <TouchableOpacity
              key={index}
              onPress={option.action}
              className="flex-row items-center px-6 py-4 border-b border-gray-50 last:border-b-0"
            >
              <View className="w-12 h-12 bg-gray-50 rounded-full items-center justify-center mr-4">
                <Ionicons name={option.icon as any} size={22} color="#6b7280" />
              </View>
              <View className="flex-1">
                <Text className="text-gray-900 font-semibold text-base">{option.title}</Text>
                {option.subtitle && (
                  <Text className="text-gray-500 text-sm mt-1">{option.subtitle}</Text>
                )}
              </View>
              <Ionicons name="chevron-forward" size={18} color="#9ca3af" />
            </TouchableOpacity>
          ))}
        </View>

        {/* Sign Out */}
        <View className="px-6 py-8 pb-28">
          <TouchableOpacity
            onPress={handleSignOut}
            className="bg-white rounded-2xl px-6 py-4 flex-row items-center justify-center border border-red-200"
          >
            <Ionicons name="log-out-outline" size={20} color="#ef4444" />
            <Text className="text-red-500 font-semibold ml-2 text-base">Sign Out</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Store Setup Modal */}
      <Modal
        visible={showStoreSetup}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowStoreSetup(false)}
      >
        <View className="flex-1 bg-gray-50">
          {/* Modal Header */}
          <View className="flex-row items-center justify-between px-6 py-4 bg-white border-b border-gray-200">
            <TouchableOpacity onPress={() => setShowStoreSetup(false)}>
              <Ionicons name="close" size={24} color="#374151" />
            </TouchableOpacity>
            <Text className="text-gray-900 text-lg font-bold">Set up Store</Text>
            <View style={{ width: 24 }} />
          </View>
          
          <StoreSetup
            onStoreCreated={handleStoreCreated}
            isLoading={isLoadingStore}
          />
        </View>
      </Modal>
    </SafeAreaView>
  );
}
