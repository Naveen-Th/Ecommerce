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

export default function DeliveryProfileScreen() {
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
            router.replace('/login');
          },
        },
      ]
    );
  };

  const profileOptions = [
    { icon: 'person-outline', title: 'Edit Profile', action: () => {} },
    { icon: 'car-outline', title: 'Vehicle Details', action: () => {} },
    { icon: 'document-text-outline', title: 'Documents', action: () => {} },
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
            <View className="w-16 h-16 bg-orange-100 rounded-full items-center justify-center mr-4">
              <Text className="text-orange-600 text-xl font-bold">
                {userProfile?.full_name?.[0]?.toUpperCase() || 'D'}
              </Text>
            </View>
            <View className="flex-1">
              <Text className="text-gray-900 text-xl font-bold">
                {userProfile?.full_name || 'Delivery Partner'}
              </Text>
              <Text className="text-gray-500">{userProfile?.email}</Text>
              <Text className="text-gray-500">{userProfile?.phone}</Text>
              <View className="flex-row items-center mt-1">
                <Ionicons name="car" size={14} color="#6b7280" />
                <Text className="text-gray-500 text-sm ml-1">
                  {userProfile?.vehicle_type || 'Vehicle'}
                </Text>
              </View>
            </View>
            <TouchableOpacity>
              <Ionicons name="chevron-forward" size={20} color="#9ca3af" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Stats */}
        <View className="bg-white mt-4 px-6 py-4">
          <Text className="text-gray-900 text-lg font-bold mb-4">Performance</Text>
          <View className="flex-row justify-between">
            <View className="items-center">
              <Text className="text-gray-900 text-2xl font-bold">4.9</Text>
              <Text className="text-gray-500 text-sm">Rating</Text>
            </View>
            <View className="items-center">
              <Text className="text-gray-900 text-2xl font-bold">156</Text>
              <Text className="text-gray-500 text-sm">Deliveries</Text>
            </View>
            <View className="items-center">
              <Text className="text-gray-900 text-2xl font-bold">98%</Text>
              <Text className="text-gray-500 text-sm">On Time</Text>
            </View>
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

        {/* License Info */}
        <View className="bg-white mt-4 px-6 py-4">
          <Text className="text-gray-900 text-lg font-bold mb-4">License Information</Text>
          <View className="bg-gray-50 rounded-xl p-4">
            <View className="flex-row items-center justify-between mb-2">
              <Text className="text-gray-700 font-medium">License Number</Text>
              <Text className="text-gray-900 font-semibold">
                {userProfile?.license_number || 'Not provided'}
              </Text>
            </View>
            <View className="flex-row items-center justify-between">
              <Text className="text-gray-700 font-medium">Status</Text>
              <View className="bg-green-100 px-3 py-1 rounded-full">
                <Text className="text-green-600 text-sm font-medium">Verified</Text>
              </View>
            </View>
          </View>
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
