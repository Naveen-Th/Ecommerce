import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import React, { useState } from 'react';
import {
    SafeAreaView,
    ScrollView,
    Switch,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { useAuthStore } from '../../../store/authStore';
import { supabase } from '../../../utils/supabase';

const todayStats = [
  { title: 'Deliveries', value: '8', icon: 'bicycle', color: '#f59e0b' },
  { title: 'Earnings', value: '$45', icon: 'wallet', color: '#10b981' },
  { title: 'Distance', value: '12km', icon: 'map', color: '#3b82f6' },
  { title: 'Rating', value: '4.9', icon: 'star', color: '#8b5cf6' },
];

const pendingOrders = [
  {
    id: 1,
    storeName: 'Fresh Mart',
    customerName: 'John Doe',
    address: '123 Main St, City',
    distance: '2.5 km',
    amount: '$25.50',
    status: 'ready_for_pickup'
  },
  {
    id: 2,
    storeName: 'Tech World',
    customerName: 'Jane Smith',
    address: '456 Oak Ave, City',
    distance: '1.8 km',
    amount: '$89.99',
    status: 'picked_up'
  },
];

export default function DeliveryDashboardScreen() {
  const { userProfile, signOut } = useAuthStore();
  const [isOnline, setIsOnline] = useState(userProfile?.is_available || false);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    signOut();
    router.replace('/login');
  };

  const toggleOnlineStatus = async () => {
    const newStatus = !isOnline;
    setIsOnline(newStatus);
    
    // Update in database
    if (userProfile) {
      await supabase
        .from('profiles')
        .update({ is_available: newStatus })
        .eq('id', userProfile.id);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ready_for_pickup': return 'text-orange-600 bg-orange-100';
      case 'picked_up': return 'text-blue-600 bg-blue-100';
      case 'delivered': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'ready_for_pickup': return 'Ready for Pickup';
      case 'picked_up': return 'Picked Up';
      case 'delivered': return 'Delivered';
      default: return 'Unknown';
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      {/* Header */}
      <LinearGradient
        colors={['#f59e0b', '#d97706']}
        className="px-6 py-4 pb-8"
      >
        <View className="flex-row items-center justify-between">
          <View>
            <Text className="text-white/80 text-sm">Welcome back</Text>
            <Text className="text-white text-xl font-bold">
              {userProfile?.full_name || 'Delivery Partner'}
            </Text>
            <Text className="text-white/80 text-sm">
              🚴 {userProfile?.vehicle_type || 'Vehicle'}
            </Text>
          </View>
          <TouchableOpacity
            onPress={handleSignOut}
            className="bg-white/20 rounded-full p-2"
          >
            <Ionicons name="log-out" size={24} color="white" />
          </TouchableOpacity>
        </View>
      </LinearGradient>

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Online Status */}
        <View className="px-6 -mt-6 mb-6">
          <View className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
            <View className="flex-row items-center justify-between">
              <View>
                <Text className="text-gray-900 text-lg font-bold">
                  {isOnline ? 'You are Online' : 'You are Offline'}
                </Text>
                <Text className="text-gray-500">
                  {isOnline ? 'Ready to receive orders' : 'Turn on to start receiving orders'}
                </Text>
              </View>
              <Switch
                value={isOnline}
                onValueChange={toggleOnlineStatus}
                trackColor={{ false: '#d1d5db', true: '#10b981' }}
                thumbColor={isOnline ? '#fff' : '#f3f4f6'}
              />
            </View>
          </View>
        </View>

        {/* Today's Stats */}
        <View className="px-6 mb-6">
          <Text className="text-gray-900 text-lg font-bold mb-4">Today&apos;s Performance</Text>
          <View className="flex-row flex-wrap justify-between">
            {todayStats.map((stat, index) => (
              <View
                key={index}
                className="w-[48%] bg-white rounded-2xl p-4 mb-3 shadow-sm border border-gray-100"
              >
                <View className="flex-row items-center justify-between mb-2">
                  <View
                    className="w-10 h-10 rounded-full items-center justify-center"
                    style={{ backgroundColor: `${stat.color}20` }}
                  >
                    <Ionicons
                      name={stat.icon as any}
                      size={20}
                      color={stat.color}
                    />
                  </View>
                </View>
                <Text className="text-gray-900 text-2xl font-bold mb-1">
                  {stat.value}
                </Text>
                <Text className="text-gray-500 text-sm">{stat.title}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Pending Orders */}
        {isOnline && (
          <View className="px-6 mb-8">
            <View className="flex-row items-center justify-between mb-4">
              <Text className="text-gray-900 text-lg font-bold">Available Orders</Text>
              <TouchableOpacity>
                <Text className="text-orange-600 font-semibold">View All</Text>
              </TouchableOpacity>
            </View>

            {pendingOrders.map((order) => (
              <TouchableOpacity
                key={order.id}
                className="bg-white rounded-2xl p-4 mb-3 shadow-sm border border-gray-100"
              >
                <View className="flex-row items-center justify-between mb-3">
                  <Text className="text-gray-900 text-lg font-bold">{order.storeName}</Text>
                  <View className={`px-3 py-1 rounded-full ${getStatusColor(order.status)}`}>
                    <Text className={`text-sm font-medium ${getStatusColor(order.status).split(' ')[0]}`}>
                      {getStatusText(order.status)}
                    </Text>
                  </View>
                </View>

                <View className="space-y-2">
                  <View className="flex-row items-center">
                    <Ionicons name="person" size={16} color="#6b7280" />
                    <Text className="text-gray-600 ml-2">{order.customerName}</Text>
                  </View>
                  <View className="flex-row items-center">
                    <Ionicons name="location" size={16} color="#6b7280" />
                    <Text className="text-gray-600 ml-2 flex-1">{order.address}</Text>
                  </View>
                  <View className="flex-row items-center justify-between">
                    <View className="flex-row items-center">
                      <Ionicons name="map" size={16} color="#6b7280" />
                      <Text className="text-gray-600 ml-2">{order.distance}</Text>
                    </View>
                    <Text className="text-gray-900 font-bold text-lg">{order.amount}</Text>
                  </View>
                </View>

                <View className="flex-row space-x-3 mt-4">
                  {order.status === 'ready_for_pickup' ? (
                    <TouchableOpacity className="flex-1 bg-orange-500 rounded-xl py-3">
                      <Text className="text-white font-semibold text-center">Accept Order</Text>
                    </TouchableOpacity>
                  ) : (
                    <>
                      <TouchableOpacity className="flex-1 bg-blue-500 rounded-xl py-3">
                        <Text className="text-white font-semibold text-center">Navigate</Text>
                      </TouchableOpacity>
                      <TouchableOpacity className="flex-1 bg-green-500 rounded-xl py-3">
                        <Text className="text-white font-semibold text-center">Mark Delivered</Text>
                      </TouchableOpacity>
                    </>
                  )}
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* Quick Actions */}
        <View className="px-6 mb-8">
          <Text className="text-gray-900 text-lg font-bold mb-4">Quick Actions</Text>
          <View className="flex-row space-x-4">
            <TouchableOpacity className="flex-1 bg-white rounded-2xl p-4 items-center shadow-sm border border-gray-100">
              <View className="bg-blue-100 rounded-full p-3 mb-3">
                <Ionicons name="map" size={24} color="#3b82f6" />
              </View>
              <Text className="text-gray-700 font-semibold text-center">Navigation</Text>
            </TouchableOpacity>
            <TouchableOpacity className="flex-1 bg-white rounded-2xl p-4 items-center shadow-sm border border-gray-100">
              <View className="bg-green-100 rounded-full p-3 mb-3">
                <Ionicons name="call" size={24} color="#10b981" />
              </View>
              <Text className="text-gray-700 font-semibold text-center">Support</Text>
            </TouchableOpacity>
            <TouchableOpacity className="flex-1 bg-white rounded-2xl p-4 items-center shadow-sm border border-gray-100">
              <View className="bg-purple-100 rounded-full p-3 mb-3">
                <Ionicons name="analytics" size={24} color="#8b5cf6" />
              </View>
              <Text className="text-gray-700 font-semibold text-center">Analytics</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
