import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import {
    SafeAreaView,
    ScrollView,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

const orders = [
  {
    id: 1,
    storeName: 'Fresh Mart',
    customerName: 'John Doe',
    address: '123 Main St, City',
    amount: '$25.50',
    status: 'delivered',
    date: '2024-01-15',
    distance: '2.5 km',
  },
  {
    id: 2,
    storeName: 'Tech World',
    customerName: 'Jane Smith',
    address: '456 Oak Ave, City',
    amount: '$89.99',
    status: 'picked_up',
    date: '2024-01-16',
    distance: '1.8 km',
  },
];

export default function DeliveryOrdersScreen() {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered': return 'text-green-600 bg-green-100';
      case 'picked_up': return 'text-blue-600 bg-blue-100';
      case 'ready_for_pickup': return 'text-orange-600 bg-orange-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'delivered': return 'Delivered';
      case 'picked_up': return 'Picked Up';
      case 'ready_for_pickup': return 'Ready for Pickup';
      default: return 'Unknown';
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <View className="px-6 py-4 bg-white border-b border-gray-200">
        <Text className="text-gray-900 text-2xl font-bold">My Orders</Text>
      </View>

      <ScrollView className="flex-1 px-6 py-4">
        {orders.map((order) => (
          <TouchableOpacity
            key={order.id}
            className="bg-white rounded-2xl p-4 mb-4 shadow-sm border border-gray-100"
          >
            <View className="flex-row items-center justify-between mb-3">
              <Text className="text-gray-900 text-lg font-bold">{order.storeName}</Text>
              <View className={`px-3 py-1 rounded-full ${getStatusColor(order.status)}`}>
                <Text className={`text-sm font-medium ${getStatusColor(order.status).split(' ')[0]}`}>
                  {getStatusText(order.status)}
                </Text>
              </View>
            </View>
            
            <View className="space-y-2 mb-3">
              <View className="flex-row items-center">
                <Ionicons name="person" size={16} color="#6b7280" />
                <Text className="text-gray-600 ml-2">{order.customerName}</Text>
              </View>
              <View className="flex-row items-center">
                <Ionicons name="location" size={16} color="#6b7280" />
                <Text className="text-gray-600 ml-2 flex-1">{order.address}</Text>
              </View>
              <View className="flex-row items-center">
                <Ionicons name="map" size={16} color="#6b7280" />
                <Text className="text-gray-600 ml-2">{order.distance}</Text>
              </View>
            </View>
            
            <View className="flex-row items-center justify-between">
              <Text className="text-gray-500 text-sm">{order.date}</Text>
              <Text className="text-gray-900 font-bold text-lg">{order.amount}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}
