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
    items: ['Apples', 'Bread', 'Milk'],
    total: 25.50,
    status: 'delivered',
    date: '2024-01-15',
  },
  {
    id: 2,
    storeName: 'Tech World',
    items: ['Wireless Headphones'],
    total: 89.99,
    status: 'in_transit',
    date: '2024-01-16',
  },
];

export default function CustomerOrdersScreen() {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered': return 'text-green-600 bg-green-100';
      case 'in_transit': return 'text-blue-600 bg-blue-100';
      case 'preparing': return 'text-yellow-600 bg-yellow-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'delivered': return 'Delivered';
      case 'in_transit': return 'In Transit';
      case 'preparing': return 'Preparing';
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
            
            <Text className="text-gray-600 mb-2">
              {order.items.join(', ')}
            </Text>
            
            <View className="flex-row items-center justify-between">
              <Text className="text-gray-500 text-sm">{order.date}</Text>
              <Text className="text-gray-900 font-bold">${order.total}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}
