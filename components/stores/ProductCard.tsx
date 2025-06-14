import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import {
    Alert,
    Image,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

export interface Product {
  id: string;
  store_id: string;
  name: string;
  description?: string;
  price: number;
  category: string;
  image_url?: string;
  stock_quantity: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

interface ProductCardProps {
  product: Product;
  onEdit: (product: Product) => void;
  onToggleStatus: (productId: string, isActive: boolean) => void;
  onDelete: (productId: string) => void;
}

export default function ProductCard({ 
  product, 
  onEdit, 
  onToggleStatus, 
  onDelete 
}: ProductCardProps) {
  const handleDelete = () => {
    Alert.alert(
      'Delete Product',
      `Are you sure you want to delete "${product.name}"?`,
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => onDelete(product.id),
        },
      ],
    );
  };

  const handleToggleStatus = () => {
    const action = product.is_active ? 'deactivate' : 'activate';
    Alert.alert(
      `${action.charAt(0).toUpperCase() + action.slice(1)} Product`,
      `Are you sure you want to ${action} "${product.name}"?`,
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: action.charAt(0).toUpperCase() + action.slice(1),
          onPress: () => onToggleStatus(product.id, !product.is_active),
        },
      ],
    );
  };

  return (
    <View className="bg-white rounded-2xl p-4 mb-4 shadow-sm border border-gray-100">
      <View className="flex-row">
        {/* Product Image */}
        <View className="w-20 h-20 rounded-xl bg-gray-100 mr-4 overflow-hidden">
          {product.image_url ? (
            <Image
              source={{ uri: product.image_url }}
              className="w-full h-full"
              resizeMode="cover"
            />
          ) : (
            <View className="w-full h-full bg-gray-200 items-center justify-center">
              <Ionicons name="image-outline" size={24} color="#9ca3af" />
            </View>
          )}
        </View>

        {/* Product Info */}
        <View className="flex-1">
          <View className="flex-row items-center justify-between mb-1">
            <Text className="text-gray-900 text-lg font-bold flex-1" numberOfLines={1}>
              {product.name}
            </Text>
            <View className={`ml-2 px-2 py-1 rounded-full ${
              product.is_active 
                ? 'bg-green-100' 
                : 'bg-red-100'
            }`}>
              <Text className={`text-xs font-medium ${
                product.is_active 
                  ? 'text-green-600' 
                  : 'text-red-600'
              }`}>
                {product.is_active ? 'Active' : 'Inactive'}
              </Text>
            </View>
          </View>

          {product.description && (
            <Text className="text-gray-600 text-sm mb-2" numberOfLines={2}>
              {product.description}
            </Text>
          )}

          <View className="flex-row items-center justify-between mb-2">
            <Text className="text-gray-900 font-bold text-xl">
              ${product.price.toFixed(2)}
            </Text>
            <View className="flex-row items-center">
              <Ionicons name="cube-outline" size={14} color="#6b7280" />
              <Text className="text-gray-600 text-sm ml-1">
                {product.stock_quantity} in stock
              </Text>
            </View>
          </View>

          <View className="flex-row items-center">
            <View className="bg-blue-100 rounded-lg px-2 py-1 mr-2">
              <Text className="text-blue-600 text-xs font-medium">
                {product.category}
              </Text>
            </View>
          </View>
        </View>
      </View>

      {/* Action Buttons */}
      <View className="flex-row mt-4 space-x-3">
        <TouchableOpacity
          onPress={() => onEdit(product)}
          className="flex-1 bg-blue-500 rounded-xl py-3 flex-row items-center justify-center"
        >
          <Ionicons name="pencil" size={16} color="white" />
          <Text className="text-white font-semibold ml-2">Edit</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={handleToggleStatus}
          className={`flex-1 rounded-xl py-3 flex-row items-center justify-center ${
            product.is_active 
              ? 'bg-orange-500' 
              : 'bg-green-500'
          }`}
        >
          <Ionicons 
            name={product.is_active ? "pause" : "play"} 
            size={16} 
            color="white" 
          />
          <Text className="text-white font-semibold ml-2">
            {product.is_active ? 'Deactivate' : 'Activate'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={handleDelete}
          className="flex-1 bg-red-500 rounded-xl py-3 flex-row items-center justify-center"
        >
          <Ionicons name="trash" size={16} color="white" />
          <Text className="text-white font-semibold ml-2">Delete</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
