import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
    SafeAreaView,
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';

export default function CustomerSearchScreen() {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <View className="px-6 py-4 bg-white border-b border-gray-200">
        <Text className="text-gray-900 text-2xl font-bold mb-4">Search</Text>
        <View className="bg-gray-100 rounded-2xl px-4 py-3 flex-row items-center">
          <Ionicons name="search" size={20} color="#9ca3af" />
          <TextInput
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder="Search for stores, products..."
            className="text-gray-700 ml-3 flex-1"
          />
          {searchQuery && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Ionicons name="close-circle" size={20} color="#9ca3af" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      <ScrollView className="flex-1 px-6 py-4">
        <Text className="text-gray-900 text-lg font-bold mb-4">Popular Searches</Text>
        <View className="flex-row flex-wrap">
          {['Pizza', 'Groceries', 'Electronics', 'Fashion', 'Medicine'].map((item, index) => (
            <TouchableOpacity
              key={index}
              className="bg-white rounded-full px-4 py-2 mr-2 mb-2 border border-gray-200"
            >
              <Text className="text-gray-700">{item}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
