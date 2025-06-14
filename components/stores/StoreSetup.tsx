import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';

interface StoreSetupProps {
  onStoreCreated: (storeData: any) => Promise<boolean>;
  isLoading?: boolean;
}

const STORE_CATEGORIES = [
  'Grocery',
  'Electronics',
  'Clothing',
  'Books',
  'Home & Garden',
  'Sports',
  'Health & Beauty',
  'Food & Beverages',
  'Automotive',
  'Other',
];

export default function StoreSetup({ onStoreCreated, isLoading = false }: StoreSetupProps) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    address: '',
    city: '',
    category: 'Other',
    phone: '',
    email: '',
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Store name is required';
    }

    if (!formData.address.trim()) {
      newErrors.address = 'Store address is required';
    }

    if (!formData.city.trim()) {
      newErrors.city = 'City is required';
    }

    if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Valid email is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    const storeData = {
      name: formData.name.trim(),
      description: formData.description.trim() || undefined,
      address: formData.address.trim(),
      city: formData.city.trim(),
      category: formData.category,
      phone: formData.phone.trim() || undefined,
      email: formData.email.trim() || undefined,
    };

    await onStoreCreated(storeData);
  };

  const updateField = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <KeyboardAvoidingView 
      className="flex-1 bg-gray-50"
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      {/* Header */}
      <View className="px-6 py-6 bg-white border-b border-gray-200">
        <View className="items-center mb-4">
          <View className="w-16 h-16 bg-blue-100 rounded-full items-center justify-center mb-3">
            <Ionicons name="storefront" size={32} color="#3b82f6" />
          </View>
          <Text className="text-gray-900 text-2xl font-bold text-center">
            Set up your store
          </Text>
          <Text className="text-gray-600 text-center mt-2">
            Complete your store profile to start selling
          </Text>
        </View>
      </View>

      <ScrollView className="flex-1 px-6 py-6">
        {/* Store Name */}
        <View className="mb-6">
          <Text className="text-gray-700 font-medium mb-2">Store Name *</Text>
          <TextInput
            value={formData.name}
            onChangeText={(value) => updateField('name', value)}
            placeholder="Enter your store name"
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
          <Text className="text-gray-700 font-medium mb-2">Store Description</Text>
          <TextInput
            value={formData.description}
            onChangeText={(value) => updateField('description', value)}
            placeholder="Describe what your store sells"
            multiline
            numberOfLines={3}
            className="bg-white border border-gray-300 rounded-xl px-4 py-3 text-gray-900"
            style={{ textAlignVertical: 'top' }}
          />
        </View>

        {/* Address */}
        <View className="mb-6">
          <Text className="text-gray-700 font-medium mb-2">Store Address *</Text>
          <TextInput
            value={formData.address}
            onChangeText={(value) => updateField('address', value)}
            placeholder="Enter your store address"
            className={`bg-white border rounded-xl px-4 py-3 text-gray-900 ${
              errors.address ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {errors.address ? (
            <Text className="text-red-500 text-sm mt-1">{errors.address}</Text>
          ) : null}
        </View>

        {/* City */}
        <View className="mb-6">
          <Text className="text-gray-700 font-medium mb-2">City *</Text>
          <TextInput
            value={formData.city}
            onChangeText={(value) => updateField('city', value)}
            placeholder="Enter your city"
            className={`bg-white border rounded-xl px-4 py-3 text-gray-900 ${
              errors.city ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {errors.city ? (
            <Text className="text-red-500 text-sm mt-1">{errors.city}</Text>
          ) : null}
        </View>

        {/* Category */}
        <View className="mb-6">
          <Text className="text-gray-700 font-medium mb-2">Store Category</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View className="flex-row space-x-3">
              {STORE_CATEGORIES.map((category) => (
                <TouchableOpacity
                  key={category}
                  onPress={() => updateField('category', category)}
                  className={`px-4 py-3 rounded-xl ${
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

        {/* Contact Information */}
        <View className="mb-6">
          <Text className="text-gray-700 font-medium mb-2">Phone Number</Text>
          <TextInput
            value={formData.phone}
            onChangeText={(value) => updateField('phone', value)}
            placeholder="+1 (555) 123-4567"
            keyboardType="phone-pad"
            className="bg-white border border-gray-300 rounded-xl px-4 py-3 text-gray-900"
          />
        </View>

        <View className="mb-8">
          <Text className="text-gray-700 font-medium mb-2">Email Address</Text>
          <TextInput
            value={formData.email}
            onChangeText={(value) => updateField('email', value)}
            placeholder="store@example.com"
            keyboardType="email-address"
            autoCapitalize="none"
            className={`bg-white border rounded-xl px-4 py-3 text-gray-900 ${
              errors.email ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {errors.email ? (
            <Text className="text-red-500 text-sm mt-1">{errors.email}</Text>
          ) : null}
        </View>

        {/* Submit Button */}
        <TouchableOpacity
          onPress={handleSubmit}
          disabled={isLoading}
          className={`rounded-xl py-4 items-center ${
            isLoading ? 'bg-gray-300' : 'bg-blue-500'
          }`}
        >
          <Text className="text-white font-bold text-lg">
            {isLoading ? 'Creating Store...' : 'Create Store'}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
