import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import {
    Image,
    KeyboardAvoidingView,
    Modal,
    Platform,
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { Product } from './ProductCard';

interface ProductFormProps {
  visible: boolean;
  product?: Product | null;
  onClose: () => void;
  onSave: (productData: any) => Promise<boolean>;
  isLoading?: boolean;
}

const CATEGORIES = [
  'Electronics',
  'Clothing',
  'Books',
  'Home & Garden',
  'Sports',
  'Toys',
  'Health & Beauty',
  'Food & Beverages',
  'Automotive',
  'Other',
];

export default function ProductForm({ 
  visible, 
  product, 
  onClose, 
  onSave, 
  isLoading = false 
}: ProductFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: 'Other',
    image_url: '',
    stock_quantity: '',
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name,
        description: product.description || '',
        price: product.price.toString(),
        category: product.category,
        image_url: product.image_url || '',
        stock_quantity: product.stock_quantity.toString(),
      });
    } else {
      setFormData({
        name: '',
        description: '',
        price: '',
        category: 'Other',
        image_url: '',
        stock_quantity: '',
      });
    }
    setErrors({});
  }, [product, visible]);

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Product name is required';
    }

    if (!formData.price.trim() || isNaN(Number(formData.price)) || Number(formData.price) <= 0) {
      newErrors.price = 'Valid price is required';
    }

    if (!formData.stock_quantity.trim() || isNaN(Number(formData.stock_quantity)) || Number(formData.stock_quantity) < 0) {
      newErrors.stock_quantity = 'Valid stock quantity is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) return;

    const productData = {
      name: formData.name.trim(),
      description: formData.description.trim() || undefined,
      price: Number(formData.price),
      category: formData.category,
      image_url: formData.image_url.trim() || undefined,
      stock_quantity: Number(formData.stock_quantity),
    };

    const success = await onSave(productData);
    if (success) {
      onClose();
    }
  };

  const updateField = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView 
        className="flex-1 bg-gray-50"
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        {/* Header */}
        <View className="flex-row items-center justify-between px-6 py-4 bg-white border-b border-gray-200">
          <TouchableOpacity onPress={onClose}>
            <Ionicons name="close" size={24} color="#374151" />
          </TouchableOpacity>
          <Text className="text-gray-900 text-lg font-bold">
            {product ? 'Edit Product' : 'Add Product'}
          </Text>
          <TouchableOpacity
            onPress={handleSave}
            disabled={isLoading}
            className={`px-4 py-2 rounded-xl ${
              isLoading ? 'bg-gray-300' : 'bg-blue-500'
            }`}
          >
            <Text className="text-white font-semibold">
              {isLoading ? 'Saving...' : 'Save'}
            </Text>
          </TouchableOpacity>
        </View>

        <ScrollView className="flex-1 px-6 py-4">
          {/* Product Image Preview */}
          {formData.image_url ? (
            <View className="mb-6">
              <Text className="text-gray-700 font-medium mb-2">Image Preview</Text>
              <View className="h-40 rounded-xl overflow-hidden bg-gray-100">
                <Image
                  source={{ uri: formData.image_url }}
                  className="w-full h-full"
                  resizeMode="cover"
                />
              </View>
            </View>
          ) : null}

          {/* Product Name */}
          <View className="mb-6">
            <Text className="text-gray-700 font-medium mb-2">Product Name *</Text>
            <TextInput
              value={formData.name}
              onChangeText={(value) => updateField('name', value)}
              placeholder="Enter product name"
              className={`bg-white border rounded-xl px-4 py-3 text-gray-900 ${
                errors.name ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.name ? (
              <Text className="text-red-500 text-sm mt-1">{errors.name}</Text>
            ) : null}
          </View>

          {/* Description */}
          <View className="mb-6">
            <Text className="text-gray-700 font-medium mb-2">Description</Text>
            <TextInput
              value={formData.description}
              onChangeText={(value) => updateField('description', value)}
              placeholder="Enter product description"
              multiline
              numberOfLines={3}
              className="bg-white border border-gray-300 rounded-xl px-4 py-3 text-gray-900"
              style={{ textAlignVertical: 'top' }}
            />
          </View>

          {/* Price and Stock */}
          <View className="flex-row mb-6 space-x-4">
            <View className="flex-1">
              <Text className="text-gray-700 font-medium mb-2">Price *</Text>
              <TextInput
                value={formData.price}
                onChangeText={(value) => updateField('price', value)}
                placeholder="0.00"
                keyboardType="decimal-pad"
                className={`bg-white border rounded-xl px-4 py-3 text-gray-900 ${
                  errors.price ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.price ? (
                <Text className="text-red-500 text-sm mt-1">{errors.price}</Text>
              ) : null}
            </View>

            <View className="flex-1">
              <Text className="text-gray-700 font-medium mb-2">Stock Quantity *</Text>
              <TextInput
                value={formData.stock_quantity}
                onChangeText={(value) => updateField('stock_quantity', value)}
                placeholder="0"
                keyboardType="number-pad"
                className={`bg-white border rounded-xl px-4 py-3 text-gray-900 ${
                  errors.stock_quantity ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.stock_quantity ? (
                <Text className="text-red-500 text-sm mt-1">{errors.stock_quantity}</Text>
              ) : null}
            </View>
          </View>

          {/* Category */}
          <View className="mb-6">
            <Text className="text-gray-700 font-medium mb-2">Category</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View className="flex-row space-x-2">
                {CATEGORIES.map((category) => (
                  <TouchableOpacity
                    key={category}
                    onPress={() => updateField('category', category)}
                    className={`px-4 py-2 rounded-xl ${
                      formData.category === category
                        ? 'bg-blue-500'
                        : 'bg-white border border-gray-300'
                    }`}
                  >
                    <Text
                      className={`font-medium ${
                        formData.category === category
                          ? 'text-white'
                          : 'text-gray-700'
                      }`}
                    >
                      {category}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>
          </View>

          {/* Image URL */}
          <View className="mb-6">
            <Text className="text-gray-700 font-medium mb-2">Image URL</Text>
            <TextInput
              value={formData.image_url}
              onChangeText={(value) => updateField('image_url', value)}
              placeholder="https://example.com/image.jpg"
              keyboardType="url"
              autoCapitalize="none"
              className="bg-white border border-gray-300 rounded-xl px-4 py-3 text-gray-900"
            />
            <Text className="text-gray-500 text-sm mt-1">
              Optional: Provide a URL for the product image
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </Modal>
  );
}
