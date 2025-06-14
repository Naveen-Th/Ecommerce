import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import {
    SafeAreaView,
    ScrollView,
    Text,
    View,
} from 'react-native';

const earningsData = [
  { period: 'Today', amount: '$45.50', orders: 8, color: '#10b981' },
  { period: 'This Week', amount: '$289.75', orders: 42, color: '#3b82f6' },
  { period: 'This Month', amount: '$1,250.00', orders: 156, color: '#8b5cf6' },
];

const recentEarnings = [
  { date: '2024-01-16', orders: 3, amount: '$18.75', tips: '$2.50' },
  { date: '2024-01-15', orders: 5, amount: '$26.25', tips: '$4.00' },
  { date: '2024-01-14', orders: 4, amount: '$22.00', tips: '$3.25' },
  { date: '2024-01-13', orders: 6, amount: '$31.50', tips: '$5.75' },
];

export default function DeliveryEarningsScreen() {
  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <View className="px-6 py-4 bg-white border-b border-gray-200">
        <Text className="text-gray-900 text-2xl font-bold">Earnings</Text>
      </View>

      <ScrollView className="flex-1 px-6 py-4">
        {/* Summary Cards */}
        <View className="mb-6">
          {earningsData.map((earning, index) => (
            <LinearGradient
              key={index}
              colors={[earning.color, `${earning.color}dd`]}
              className="rounded-2xl p-6 mb-4"
            >
              <View className="flex-row items-center justify-between">
                <View>
                  <Text className="text-white/80 text-sm font-medium">
                    {earning.period}
                  </Text>
                  <Text className="text-white text-3xl font-bold mb-1">
                    {earning.amount}
                  </Text>
                  <Text className="text-white/80 text-sm">
                    {earning.orders} deliveries completed
                  </Text>
                </View>
                <View className="bg-white/20 rounded-full p-4">
                  <Ionicons name="wallet" size={32} color="white" />
                </View>
              </View>
            </LinearGradient>
          ))}
        </View>

        {/* Recent Earnings */}
        <View className="mb-8">
          <Text className="text-gray-900 text-lg font-bold mb-4">Recent Earnings</Text>
          <View className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100">
            {recentEarnings.map((earning, index) => (
              <View
                key={index}
                className={`p-4 ${index !== recentEarnings.length - 1 ? 'border-b border-gray-100' : ''}`}
              >
                <View className="flex-row items-center justify-between mb-2">
                  <Text className="text-gray-900 font-semibold">{earning.date}</Text>
                  <Text className="text-gray-900 font-bold text-lg">
                    {earning.amount}
                  </Text>
                </View>
                <View className="flex-row items-center justify-between">
                  <Text className="text-gray-500 text-sm">
                    {earning.orders} orders
                  </Text>
                  <Text className="text-green-600 text-sm font-medium">
                    Tips: {earning.tips}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* Earnings Breakdown */}
        <View className="mb-8">
          <Text className="text-gray-900 text-lg font-bold mb-4">This Month Breakdown</Text>
          <View className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
            <View className="flex-row items-center justify-between py-3 border-b border-gray-100">
              <View className="flex-row items-center">
                <View className="bg-blue-100 rounded-full p-2 mr-3">
                  <Ionicons name="bicycle" size={16} color="#3b82f6" />
                </View>
                <Text className="text-gray-700 font-medium">Delivery Fee</Text>
              </View>
              <Text className="text-gray-900 font-bold">$980.00</Text>
            </View>
            
            <View className="flex-row items-center justify-between py-3 border-b border-gray-100">
              <View className="flex-row items-center">
                <View className="bg-green-100 rounded-full p-2 mr-3">
                  <Ionicons name="heart" size={16} color="#10b981" />
                </View>
                <Text className="text-gray-700 font-medium">Tips</Text>
              </View>
              <Text className="text-gray-900 font-bold">$198.50</Text>
            </View>
            
            <View className="flex-row items-center justify-between py-3">
              <View className="flex-row items-center">
                <View className="bg-purple-100 rounded-full p-2 mr-3">
                  <Ionicons name="star" size={16} color="#8b5cf6" />
                </View>
                <Text className="text-gray-700 font-medium">Bonuses</Text>
              </View>
              <Text className="text-gray-900 font-bold">$71.50</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
