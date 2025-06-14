import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useEffect } from 'react';
import {
  ActivityIndicator,
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useAuthStore } from '../../../store/authStore';
import { useStoreManagement } from '../../../store/storeManagement';
import { supabase } from '../../../utils/supabase';

export default function StoreDashboardScreen() {
  const { userProfile, signOut } = useAuthStore();
  const {
    currentStore,
    products,
    orders,
    isLoadingStore,
    fetchStore,
    fetchProducts,
    fetchOrders,
  } = useStoreManagement();

  const loadDashboardData = React.useCallback(async () => {
    if (!userProfile?.id) return;

    try {
      // Fetch store info if not already loaded
      if (!currentStore) {
        await fetchStore(userProfile.id);
      }
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    }
  }, [userProfile?.id, currentStore, fetchStore]);

  const loadStoreData = React.useCallback(async () => {
    if (!currentStore?.id) return;

    try {
      // Load products and orders in parallel
      await Promise.all([
        fetchProducts(currentStore.id),
        fetchOrders(currentStore.id),
      ]);
    } catch (error) {
      console.error('Error loading store data:', error);
    }
  }, [currentStore?.id, fetchProducts, fetchOrders]);

  useEffect(() => {
    loadDashboardData();
  }, [loadDashboardData]);

  useEffect(() => {
    if (currentStore?.id) {
      loadStoreData();
    }
  }, [currentStore?.id, loadStoreData]);

  // Calculate stats from actual data
  const todayOrders = orders.filter(order => {
    const today = new Date();
    const orderDate = new Date(order.created_at);
    return orderDate.toDateString() === today.toDateString();
  }).length;

  const todayRevenue = orders
    .filter(order => {
      const today = new Date();
      const orderDate = new Date(order.created_at);
      return orderDate.toDateString() === today.toDateString() && 
             order.status !== 'cancelled';
    })
    .reduce((sum, order) => sum + order.total_amount, 0);

  const activeProducts = products.filter(product => product.is_active).length;

  const uniqueCustomers = new Set(orders.map(order => order.customer_id)).size;

  const statsData = [
    { title: 'Today Orders', value: todayOrders.toString(), icon: 'receipt', color: '#3b82f6' },
    { title: 'Today Revenue', value: `$${todayRevenue.toFixed(2)}`, icon: 'cash', color: '#10b981' },
    { title: 'Active Products', value: activeProducts.toString(), icon: 'cube', color: '#8b5cf6' },
    { title: 'Total Customers', value: uniqueCustomers.toString(), icon: 'people', color: '#f59e0b' },
  ];

  const recentOrders = orders.slice(0, 3).map(order => ({
    id: order.id,
    customer: order.profiles?.full_name || 'Unknown Customer',
    items: order.order_items?.length || 0,
    total: order.total_amount,
    status: order.status,
  }));

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
      signOut();
      router.replace('/login');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'preparing': return 'text-yellow-600 bg-yellow-100';
      case 'ready': return 'text-green-600 bg-green-100';
      case 'delivered': return 'text-blue-600 bg-blue-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      {/* Show loading indicator if store is being loaded */}
      {isLoadingStore && !currentStore && (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#525252" />
          <Text className="text-neutral-600 mt-4">Loading store data...</Text>
        </View>
      )}
      
      {/* Main content */}
      {(!isLoadingStore || currentStore) && (
        <>
          {/* Header */}
          <View className="bg-white px-6 py-6 border-b border-gray-100">
            <View className="flex-row items-center justify-between">
              <View className="flex-1">
                <Text className="text-gray-500 text-sm font-medium">Welcome back</Text>
                <Text className="text-gray-900 text-2xl font-bold mt-1">
                  {currentStore?.name || userProfile?.store_name || 'Your Store'}
                </Text>
                <View className="flex-row items-center mt-2">
                  <Ionicons name="location" size={14} color="#6b7280" />
                  <Text className="text-gray-500 text-sm ml-1">
                    {currentStore?.address || userProfile?.store_address || 'Store Location'}
                  </Text>
                </View>
              </View>
              <TouchableOpacity
                onPress={handleSignOut}
                className="w-12 h-12 bg-gray-100 rounded-full items-center justify-center"
              >
                <Ionicons name="log-out-outline" size={20} color="#374151" />
              </TouchableOpacity>
            </View>
          </View>

          <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
            {/* Quick Actions */}
            <View className="px-6 mb-8">
              <View className="card p-6">
                <Text className="text-neutral-900 text-xl font-bold mb-6">Quick Actions</Text>
            <View className="flex-row space-x-3">
              <TouchableOpacity className="flex-1 bg-blue-50 rounded-xl p-3 items-center">
                <Ionicons name="add-circle" size={24} color="#3b82f6" />
                <Text className="text-blue-600 font-medium mt-1">Add Product</Text>
              </TouchableOpacity>
              <TouchableOpacity className="flex-1 bg-green-50 rounded-xl p-3 items-center">
                <Ionicons name="notifications" size={24} color="#10b981" />
                <Text className="text-green-600 font-medium mt-1">Orders</Text>
              </TouchableOpacity>
              <TouchableOpacity className="flex-1 bg-purple-50 rounded-xl p-3 items-center">
                <Ionicons name="analytics" size={24} color="#8b5cf6" />
                <Text className="text-purple-600 font-medium mt-1">Analytics</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Stats */}
        <View className="px-6 mb-6">
          <Text className="text-gray-900 text-lg font-bold mb-4">Todays Overview</Text>
          <View className="flex-row flex-wrap justify-between">
            {statsData.map((stat, index) => (
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

        {/* Recent Orders */}
        <View className="px-6 mb-8">
          <View className="flex-row items-center justify-between mb-4">
            <Text className="text-gray-900 text-lg font-bold">Recent Orders</Text>
            <TouchableOpacity>
              <Text className="text-green-600 font-semibold">View All</Text>
            </TouchableOpacity>
          </View>

          <View className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100">
            {recentOrders.map((order, index) => (
              <TouchableOpacity
                key={order.id}
                className={`p-4 ${index !== recentOrders.length - 1 ? 'border-b border-gray-100' : ''}`}
              >
                <View className="flex-row items-center justify-between">
                  <View className="flex-1">
                    <Text className="text-gray-900 font-semibold">
                      {order.customer}
                    </Text>
                    <Text className="text-gray-500 text-sm">
                      {order.items} items • ${order.total}
                    </Text>
                  </View>
                  <View className={`px-3 py-1 rounded-full ${getStatusColor(order.status)}`}>
                    <Text className={`text-sm font-medium ${getStatusColor(order.status).split(' ')[0]}`}>
                      {order.status}
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Store Performance */}
        <View className="px-6 mb-8">
          <Text className="text-gray-900 text-lg font-bold mb-4">Store Performance</Text>
          <View className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
            <View className="flex-row items-center justify-between mb-4">
              <Text className="text-gray-700 font-medium">Rating</Text>
              <View className="flex-row items-center">
                <Ionicons name="star" size={16} color="#fbbf24" />
                <Text className="text-gray-900 font-bold ml-1">4.8</Text>
              </View>
            </View>
            <View className="flex-row items-center justify-between mb-4">
              <Text className="text-gray-700 font-medium">This Month</Text>
              <Text className="text-gray-900 font-bold">$2,450</Text>
            </View>
            <View className="flex-row items-center justify-between">
              <Text className="text-gray-700 font-medium">Growth</Text>
              <Text className="text-green-600 font-bold">+12%</Text>
            </View>
          </View>
        </View>
      </ScrollView>
        </>
      )}
    </SafeAreaView>
  );
}
