import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  RefreshControl,
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import ProductCard, { Product } from '../../../components/stores/ProductCard';
import ProductForm from '../../../components/stores/ProductForm';
import { useAuthStore } from '../../../store/authStore';
import { useStoreManagement } from '../../../store/storeManagement';

export default function ProductsScreen() {
  const { userProfile } = useAuthStore();
  const {
    currentStore,
    products,
    isLoadingStore,
    isLoadingProducts,
    storeError,
    productsError,
    selectedProduct,
    isProductModalVisible,
    fetchStore,
    fetchProducts,
    addProduct,
    editProduct,
    removeProduct,
    toggleProductActive,
    setSelectedProduct,
    setProductModalVisible,
    clearAll,
  } = useStoreManagement();

  const [refreshing, setRefreshing] = useState(false);

  const loadStoreData = React.useCallback(async () => {
    if (!userProfile?.id) return;

    try {
      await fetchStore(userProfile.id);
    } catch (error) {
      console.error('Error loading store:', error);
    }
  }, [userProfile?.id, fetchStore]);

  const loadProducts = React.useCallback(async () => {
    if (!currentStore?.id) return;

    try {
      await fetchProducts(currentStore.id);
    } catch (error) {
      console.error('Error loading products:', error);
    }
  }, [currentStore?.id, fetchProducts]);

  useEffect(() => {
    if (userProfile?.id) {
      loadStoreData();
    }
    
    return () => {
      // Clean up when component unmounts
      clearAll();
    };
  }, [userProfile?.id, loadStoreData, clearAll]);

  useEffect(() => {
    if (currentStore?.id) {
      loadProducts();
    }
  }, [currentStore?.id, loadProducts]);

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadStoreData();
    if (currentStore?.id) {
      await loadProducts();
    }
    setRefreshing(false);
  };

  const handleAddProduct = () => {
    setSelectedProduct(null);
    setProductModalVisible(true);
  };

  const handleEditProduct = (product: Product) => {
    setSelectedProduct(product);
    setProductModalVisible(true);
  };

  const handleSaveProduct = async (productData: any) => {
    if (!currentStore?.id) return false;

    let success = false;
    if (selectedProduct) {
      // Editing existing product
      success = await editProduct(selectedProduct.id, productData);
      if (success) {
        Alert.alert('Success', 'Product updated successfully!');
      } else {
        Alert.alert('Error', 'Failed to update product. Please try again.');
      }
    } else {
      // Adding new product
      success = await addProduct(currentStore.id, productData);
      if (success) {
        Alert.alert('Success', 'Product added successfully!');
      } else {
        Alert.alert('Error', 'Failed to add product. Please try again.');
      }
    }
    return success;
  };

  const handleDeleteProduct = async (productId: string) => {
    const success = await removeProduct(productId);
    if (success) {
      Alert.alert('Success', 'Product deleted successfully!');
    } else {
      Alert.alert('Error', 'Failed to delete product. Please try again.');
    }
  };

  const handleToggleProductStatus = async (productId: string, isActive: boolean) => {
    const success = await toggleProductActive(productId, isActive);
    if (!success) {
      Alert.alert('Error', 'Failed to update product status. Please try again.');
    }
  };

  // Show loading spinner while checking for store
  if (isLoadingStore && !currentStore) {
    return (
      <SafeAreaView className="flex-1 bg-gray-50 items-center justify-center">
        <ActivityIndicator size="large" color="#3b82f6" />
        <Text className="text-gray-600 mt-4">Loading store information...</Text>
      </SafeAreaView>
    );
  }

  // Show store setup message if no store exists
  if (!currentStore && !isLoadingStore) {
    return (
      <SafeAreaView className="flex-1 bg-gray-50 items-center justify-center px-6">
        <View className="w-20 h-20 bg-blue-100 rounded-full items-center justify-center mb-6">
          <Ionicons name="storefront" size={40} color="#3b82f6" />
        </View>
        <Text className="text-gray-900 text-2xl font-bold text-center mb-4">
          Store Setup Required
        </Text>
        <Text className="text-gray-600 text-center mb-8 leading-6">
          You need to set up your store first before you can manage products. 
          Please go to your Profile and complete your store setup.
        </Text>
        <TouchableOpacity 
          onPress={() => {/* Navigation to profile will be handled by tab navigation */}}
          className="bg-blue-500 rounded-xl px-6 py-3 flex-row items-center"
        >
          <Ionicons name="person" size={20} color="white" />
          <Text className="text-white font-semibold ml-2">Go to Profile</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  // Show error if failed to load store
  if (storeError && !currentStore) {
    return (
      <SafeAreaView className="flex-1 bg-gray-50 items-center justify-center px-6">
        <Ionicons name="alert-circle" size={64} color="#ef4444" />
        <Text className="text-gray-900 text-xl font-bold mt-4 text-center">
          Error Loading Store
        </Text>
        <Text className="text-gray-600 text-center mt-2 mb-6">
          {storeError}
        </Text>
        <TouchableOpacity
          onPress={loadStoreData}
          className="bg-blue-500 rounded-xl px-6 py-3"
        >
          <Text className="text-white font-semibold">Try Again</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="px-6 py-6 bg-white border-b border-gray-100">
        <View className="flex-row items-center justify-between">
          <View>
            <Text className="text-gray-900 text-2xl font-bold">Products</Text>
            <Text className="text-gray-500 mt-1">
              {currentStore?.name} • {products.length} products
            </Text>
          </View>
          <TouchableOpacity
            onPress={handleAddProduct}
            className="bg-black rounded-xl px-4 py-2 flex-row items-center"
          >
            <Ionicons name="add" size={20} color="white" />
            <Text className="text-white font-semibold ml-1">Add</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Products List */}
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
        {isLoadingProducts ? (
          <View className="items-center justify-center py-8">
            <ActivityIndicator size="large" color="#3b82f6" />
            <Text className="text-gray-600 mt-2">Loading products...</Text>
          </View>
        ) : productsError ? (
          <View className="items-center justify-center py-8">
            <Ionicons name="alert-circle" size={48} color="#ef4444" />
            <Text className="text-gray-900 text-lg font-bold mt-2">
              Error Loading Products
            </Text>
            <Text className="text-gray-600 text-center mt-1 mb-4">
              {productsError}
            </Text>
            <TouchableOpacity
              onPress={loadProducts}
              className="bg-blue-500 rounded-xl px-4 py-2"
            >
              <Text className="text-white font-semibold">Try Again</Text>
            </TouchableOpacity>
          </View>
        ) : products.length === 0 ? (
          <View className="items-center justify-center py-12">
            <View className="w-20 h-20 bg-gray-200 rounded-full items-center justify-center mb-4">
              <Ionicons name="cube-outline" size={40} color="#9ca3af" />
            </View>
            <Text className="text-gray-900 text-xl font-bold mb-2">
              No Products Yet
            </Text>
            <Text className="text-gray-600 text-center mb-6 px-8">
              Start building your inventory by adding your first product.
            </Text>
            <TouchableOpacity
              onPress={handleAddProduct}
              className="bg-blue-500 rounded-xl px-6 py-3 flex-row items-center"
            >
              <Ionicons name="add" size={20} color="white" />
              <Text className="text-white font-semibold ml-2">Add Product</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <>
            {products.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onEdit={handleEditProduct}
                onToggleStatus={handleToggleProductStatus}
                onDelete={handleDeleteProduct}
              />
            ))}
          </>
        )}
      </ScrollView>

      {/* Product Form Modal */}
      <ProductForm
        visible={isProductModalVisible}
        product={selectedProduct}
        onClose={() => setProductModalVisible(false)}
        onSave={handleSaveProduct}
        isLoading={isLoadingProducts}
      />
    </SafeAreaView>
  );
}
