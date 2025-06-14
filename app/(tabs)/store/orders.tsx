import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  RefreshControl,
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useAuthStore } from '../../../store/authStore';
import { Order, useStoreManagement } from '../../../store/storeManagement';

export default function StoreOrdersScreen() {
  const { userProfile } = useAuthStore();
  const {
    currentStore,
    orders,
    isLoadingOrders,
    ordersError,
    fetchStore,
    fetchOrders,
    updateOrderStatusAction,
  } = useStoreManagement();

  const [refreshing, setRefreshing] = useState(false);

  const loadStoreAndOrders = React.useCallback(async () => {
    if (!userProfile?.id) return;

    try {
      // If we don't have store info, fetch it first
      if (!currentStore) {
        await fetchStore(userProfile.id);
      }
    } catch (error) {
      console.error('Error loading store:', error);
    }
  }, [userProfile?.id, currentStore, fetchStore]);

  const loadOrders = React.useCallback(async () => {
    if (!currentStore?.id) return;

    try {
      await fetchOrders(currentStore.id);
    } catch (error) {
      console.error('Error loading orders:', error);
    }
  }, [currentStore?.id, fetchOrders]);

  useEffect(() => {
    loadStoreAndOrders();
  }, [loadStoreAndOrders]);

  useEffect(() => {
    if (currentStore?.id) {
      loadOrders();
    }
  }, [currentStore?.id, loadOrders]);

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadStoreAndOrders();
    if (currentStore?.id) {
      await loadOrders();
    }
    setRefreshing(false);
  };

  const handleOrderStatusUpdate = async (orderId: string, newStatus: string) => {
    const success = await updateOrderStatusAction(orderId, newStatus);
    if (!success) {
      // Handle error - could show an alert or toast
      console.error('Failed to update order status');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'preparing': return 'text-yellow-600 bg-yellow-100';
      case 'ready': return 'text-green-600 bg-green-100';
      case 'picked_up': return 'text-blue-600 bg-blue-100';
      case 'delivered': return 'text-purple-600 bg-purple-100';
      case 'confirmed': return 'text-orange-600 bg-orange-100';
      case 'pending': return 'text-gray-600 bg-gray-100';
      case 'cancelled': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending': return 'Pending';
      case 'confirmed': return 'Confirmed';
      case 'preparing': return 'Preparing';
      case 'ready': return 'Ready for Pickup';
      case 'picked_up': return 'Picked Up';
      case 'delivered': return 'Delivered';
      case 'cancelled': return 'Cancelled';
      default: return 'Unknown';
    }
  };

  const getNextAction = (status: string) => {
    switch (status) {
      case 'pending': return { text: 'Confirm Order', color: 'bg-blue-500', nextStatus: 'confirmed' };
      case 'confirmed': return { text: 'Start Preparing', color: 'bg-orange-500', nextStatus: 'preparing' };
      case 'preparing': return { text: 'Mark Ready', color: 'bg-green-500', nextStatus: 'ready' };
      case 'ready': return { text: 'Mark Picked Up', color: 'bg-blue-500', nextStatus: 'picked_up' };
      case 'picked_up': return { text: 'Track Order', color: 'bg-purple-500', nextStatus: null };
      default: return { text: 'View Details', color: 'bg-gray-500', nextStatus: null };
    }
  };

  const formatOrderItems = (order: Order) => {
    if (!order.order_items || order.order_items.length === 0) {
      return 'No items';
    }
    
    return order.order_items
      .map(item => `${item.quantity}x ${item.products.name}`)
      .join(', ');
  };

  const formatOrderTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  // Show loading if we're still fetching store info
  if (!currentStore && !ordersError) {
    return (
      <SafeAreaView className="flex-1 bg-gray-50 items-center justify-center">
        <ActivityIndicator size="large" color="#3b82f6" />
        <Text className="text-gray-600 mt-4">Loading store information...</Text>
      </SafeAreaView>
    );
  }

  // Show error if no store found
  if (!currentStore) {
    return (
      <SafeAreaView className="flex-1 bg-gray-50 items-center justify-center px-6">
        <Ionicons name="storefront-outline" size={64} color="#9ca3af" />
        <Text className="text-gray-900 text-xl font-bold mt-4 text-center">
          Store Not Found
        </Text>
        <Text className="text-gray-600 text-center mt-2 mb-6">
          Please set up your store first to view orders.
        </Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="px-6 py-6 bg-white border-b border-gray-100">
        <Text className="text-gray-900 text-2xl font-bold">Orders</Text>
        <Text className="text-gray-500 mt-1">{currentStore.name}</Text>
      </View>

      <ScrollView 
        className="flex-1 px-6 py-4"
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            colors={['#3b82f6']}
            tintColor="#3b82f6"
          />
        }
      >
        {isLoadingOrders ? (
          <View className="items-center justify-center py-8">
            <ActivityIndicator size="large" color="#3b82f6" />
            <Text className="text-gray-600 mt-2">Loading orders...</Text>
          </View>
        ) : ordersError ? (
          <View className="items-center justify-center py-8">
            <Ionicons name="alert-circle" size={48} color="#ef4444" />
            <Text className="text-gray-900 text-lg font-bold mt-2">
              Error Loading Orders
            </Text>
            <Text className="text-gray-600 text-center mt-1 mb-4">
              {ordersError}
            </Text>
            <TouchableOpacity
              onPress={loadOrders}
              className="bg-blue-500 rounded-xl px-4 py-2"
            >
              <Text className="text-white font-semibold">Try Again</Text>
            </TouchableOpacity>
          </View>
        ) : orders.length === 0 ? (
          <View className="items-center justify-center py-12">
            <View className="w-20 h-20 bg-gray-200 rounded-full items-center justify-center mb-4">
              <Ionicons name="receipt-outline" size={40} color="#9ca3af" />
            </View>
            <Text className="text-gray-900 text-xl font-bold mb-2">
              No Orders Yet
            </Text>
            <Text className="text-gray-600 text-center px-8">
              Orders from customers will appear here when they start purchasing from your store.
            </Text>
          </View>
        ) : (
          <>
            {orders.map((order) => {
              const action = getNextAction(order.status);
              
              return (
                <TouchableOpacity
                  key={order.id}
                  className="bg-white rounded-2xl p-4 mb-4 shadow-sm border border-gray-100"
                >
                  <View className="flex-row items-center justify-between mb-3">
                    <Text className="text-gray-900 text-lg font-bold">
                      Order #{order.id.slice(-8)}
                    </Text>
                    <View className={`px-3 py-1 rounded-full ${getStatusColor(order.status)}`}>
                      <Text className={`text-sm font-medium ${getStatusColor(order.status).split(' ')[0]}`}>
                        {getStatusText(order.status)}
                      </Text>
                    </View>
                  </View>

                  <View className="space-y-2 mb-3">
                    {order.profiles && (
                      <View className="flex-row items-center">
                        <Ionicons name="person" size={16} color="#6b7280" />
                        <Text className="text-gray-600 ml-2">{order.profiles.full_name}</Text>
                      </View>
                    )}
                    <View className="flex-row items-center">
                      <Ionicons name="time" size={16} color="#6b7280" />
                      <Text className="text-gray-600 ml-2">{formatOrderTime(order.created_at)}</Text>
                    </View>
                    <View className="flex-row items-start">
                      <Ionicons name="list" size={16} color="#6b7280" />
                      <Text className="text-gray-600 ml-2 flex-1">
                        {formatOrderItems(order)}
                      </Text>
                    </View>
                    <View className="flex-row items-center">
                      <Ionicons name="location" size={16} color="#6b7280" />
                      <Text className="text-gray-600 ml-2 flex-1" numberOfLines={1}>
                        {order.delivery_address}
                      </Text>
                    </View>
                  </View>

                  <View className="flex-row items-center justify-between">
                    <Text className="text-gray-900 font-bold text-xl">
                      ${order.total_amount.toFixed(2)}
                    </Text>
                    {action.nextStatus && (
                      <TouchableOpacity 
                        className={`${action.color} rounded-xl px-4 py-2`}
                        onPress={() => handleOrderStatusUpdate(order.id, action.nextStatus!)}
                      >
                        <Text className="text-white font-semibold">{action.text}</Text>
                      </TouchableOpacity>
                    )}
                  </View>
                </TouchableOpacity>
              );
            })}
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
