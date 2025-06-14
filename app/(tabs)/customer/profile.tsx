import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React from 'react';
import {
  Alert,
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useAuthStore } from '../../../store/authStore';
import { supabase } from '../../../utils/supabase';

export default function CustomerProfileScreen() {
  const { userProfile, signOut } = useAuthStore();

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

  const profileOptions = [
    { icon: 'person-outline', title: 'Edit Profile', action: () => {} },
    { icon: 'location-outline', title: 'Manage Addresses', action: () => {} },
    { icon: 'card-outline', title: 'Payment Methods', action: () => {} },
    { icon: 'notifications-outline', title: 'Notifications', action: () => {} },
    { icon: 'help-circle-outline', title: 'Help & Support', action: () => {} },
    { icon: 'settings-outline', title: 'Settings', action: () => {} },
  ];

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <View className="px-6 py-4 bg-white border-b border-gray-200">
        <Text className="text-gray-900 text-2xl font-bold">Profile</Text>
      </View>

      <ScrollView className="flex-1">
        {/* Profile Header */}
        <View className="bg-white px-6 py-6 border-b border-gray-200">
          <View className="flex-row items-center">
            <View className="w-16 h-16 bg-purple-100 rounded-full items-center justify-center mr-4">
              <Text className="text-purple-600 text-xl font-bold">
                {userProfile?.full_name?.[0]?.toUpperCase() || 'C'}
              </Text>
            </View>
            <View className="flex-1">
              <Text className="text-gray-900 text-xl font-bold">
                {userProfile?.full_name || 'Customer'}
              </Text>
              <Text className="text-gray-500">{userProfile?.email}</Text>
              <Text className="text-gray-500">{userProfile?.phone}</Text>
            </View>
            <TouchableOpacity>
              <Ionicons name="chevron-forward" size={20} color="#9ca3af" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Profile Options */}
        <View className="bg-white mt-4">
          {profileOptions.map((option, index) => (
            <TouchableOpacity
              key={index}
              onPress={option.action}
              className="flex-row items-center px-6 py-4 border-b border-gray-100"
            >
              <View className="w-10 h-10 bg-gray-100 rounded-full items-center justify-center mr-4">
                <Ionicons name={option.icon as any} size={20} color="#6b7280" />
              </View>
              <Text className="flex-1 text-gray-900 font-medium">{option.title}</Text>
              <Ionicons name="chevron-forward" size={16} color="#9ca3af" />
            </TouchableOpacity>
          ))}
        </View>

        {/* Sign Out */}
        <View className="px-6 py-6">
          <TouchableOpacity
            onPress={handleSignOut}
            className="bg-red-50 rounded-2xl px-6 py-4 flex-row items-center justify-center"
          >
            <Ionicons name="log-out-outline" size={20} color="#ef4444" />
            <Text className="text-red-500 font-semibold ml-2">Sign Out</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
