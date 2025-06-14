import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React from 'react';
import {
  Image,
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useAuthStore } from '../../../store/authStore';
import { supabase } from '../../../utils/supabase';

const categories = [
  { id: 1, name: 'Grocery', icon: 'basket', color: '#10b981' },
  { id: 2, name: 'Electronics', icon: 'phone-portrait', color: '#3b82f6' },
  { id: 3, name: 'Fashion', icon: 'shirt', color: '#8b5cf6' },
  { id: 4, name: 'Food', icon: 'restaurant', color: '#f59e0b' },
  { id: 5, name: 'Medicine', icon: 'medical', color: '#ef4444' },
  { id: 6, name: 'Books', icon: 'book', color: '#06b6d4' },
];

const nearbyStores = [
  {
    id: 1,
    name: 'Fresh Mart',
    category: 'Grocery',
    rating: 4.5,
    distance: '0.5 km',
    deliveryTime: '20-30 min',
    image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=300&h=200&fit=crop',
  },
  {
    id: 2,
    name: 'Tech World',
    category: 'Electronics',
    rating: 4.2,
    distance: '1.2 km',
    deliveryTime: '45-60 min',
    image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=300&h=200&fit=crop',
  },
  {
    id: 3,
    name: 'Style Hub',
    category: 'Fashion',
    rating: 4.7,
    distance: '0.8 km',
    deliveryTime: '30-45 min',
    image: 'https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=300&h=200&fit=crop',
  },
];

export default function CustomerHomeScreen() {
  const { userProfile, signOut } = useAuthStore();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    signOut();
    router.replace('/login');
  };

  return (
    <SafeAreaView className="flex-1 bg-neutral-50">
      {/* Header */}
      <View className="bg-neutral-0 px-6 py-6">
        <View className="flex-row items-center justify-between">
          <View className="flex-1">
            <Text className="text-neutral-500 text-sm font-medium">Good Morning</Text>
            <Text className="text-neutral-900 text-xl font-bold mt-1">
              {userProfile?.full_name || 'Customer'}
            </Text>
            <View className="flex-row items-center mt-1">
              <Ionicons name="location" size={14} color="#737373" />
              <Text className="text-neutral-500 text-sm ml-1">
                {userProfile?.address || 'Your Location'}
              </Text>
            </View>
          </View>
          <TouchableOpacity
            onPress={handleSignOut}
            className="w-10 h-10 bg-neutral-100 rounded-xl items-center justify-center"
          >
            <Ionicons name="log-out" size={18} color="#525252" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Search Bar */}
        <View className="px-6 mb-8">
          <TouchableOpacity className="input-field flex-row items-center">
            <Ionicons name="search" size={20} color="#a3a3a3" />
            <Text className="text-neutral-400 ml-3 flex-1">Search for stores, products...</Text>
            <Ionicons name="mic" size={20} color="#a3a3a3" />
          </TouchableOpacity>
        </View>

        {/* Categories */}
        <View className="px-6 mb-8">
          <Text className="text-neutral-900 text-xl font-bold mb-6">Categories</Text>
          <View className="flex-row flex-wrap justify-between">
            {categories.map((category) => (
              <TouchableOpacity
                key={category.id}
                className="w-[30%] mb-6 items-center"
              >
                <View
                  className="w-16 h-16 rounded-2xl items-center justify-center mb-3"
                  style={{ backgroundColor: `${category.color}15` }}
                >
                  <Ionicons
                    name={category.icon as any}
                    size={24}
                    color={category.color}
                  />
                </View>
                <Text className="text-neutral-700 text-sm font-medium text-center">
                  {category.name}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Featured Banner */}
        <View className="px-6 mb-8">
          <View className="bg-neutral-900 rounded-3xl p-6">
            <Text className="text-white text-xl font-bold mb-2">
              Free Delivery 🚚
            </Text>
            <Text className="text-neutral-300 text-base mb-6">
              On orders above $25. Valid till midnight!
            </Text>
            <TouchableOpacity className="btn-secondary self-start">
              <Text className="text-neutral-900 font-semibold">Order Now</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Nearby Stores */}
        <View className="px-6 mb-8">
          <View className="flex-row items-center justify-between mb-6">
            <Text className="text-neutral-900 text-xl font-bold">Nearby Stores</Text>
            <TouchableOpacity>
              <Text className="text-neutral-600 font-medium">See All</Text>
            </TouchableOpacity>
          </View>

          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {nearbyStores.map((store) => (
              <TouchableOpacity
                key={store.id}
                className="card mr-4 overflow-hidden"
                style={{ width: 280 }}
              >
                <Image
                  source={{ uri: store.image }}
                  className="w-full h-32"
                />
                <View className="p-4">
                  <Text className="text-neutral-900 text-base font-bold mb-1">
                    {store.name}
                  </Text>
                  <Text className="text-neutral-500 text-sm mb-3">
                    {store.category}
                  </Text>
                  <View className="flex-row items-center justify-between">
                    <View className="flex-row items-center">
                      <Ionicons name="star" size={16} color="#fbbf24" />
                      <Text className="text-neutral-700 text-sm ml-1">
                        {store.rating}
                      </Text>
                    </View>
                    <Text className="text-neutral-500 text-sm">
                      {store.distance} • {store.deliveryTime}
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Quick Actions */}
        <View className="px-6 mb-8">
          <Text className="text-neutral-900 text-xl font-bold mb-6">Quick Actions</Text>
          <View className="flex-row space-x-4">
            <TouchableOpacity className="flex-1 card p-6 items-center">
              <View className="w-12 h-12 bg-green-50 rounded-2xl items-center justify-center mb-3">
                <Ionicons name="time" size={20} color="#10b981" />
              </View>
              <Text className="text-neutral-700 font-semibold text-center">
                Reorder
              </Text>
            </TouchableOpacity>
            <TouchableOpacity className="flex-1 card p-6 items-center">
              <View className="w-12 h-12 bg-blue-50 rounded-2xl items-center justify-center mb-3">
                <Ionicons name="heart" size={20} color="#3b82f6" />
              </View>
              <Text className="text-neutral-700 font-semibold text-center">
                Favorites
              </Text>
            </TouchableOpacity>
            <TouchableOpacity className="flex-1 card p-6 items-center">
              <View className="w-12 h-12 bg-purple-50 rounded-2xl items-center justify-center mb-3">
                <Ionicons name="gift" size={20} color="#8b5cf6" />
              </View>
              <Text className="text-neutral-700 font-semibold text-center">
                Offers
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
