import { Ionicons } from '@expo/vector-icons';
import { Link, router } from 'expo-router';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useAuthStore, UserRole } from '../store/authStore';
import { createUserProfile, supabase } from '../utils/supabase';

const roleOptions = [
  { key: 'customer', label: 'Customer', icon: 'person' as const, description: 'Shop from local stores' },
  { key: 'store', label: 'Store Owner', icon: 'storefront' as const, description: 'Sell your products' },
  { key: 'delivery_boy', label: 'Delivery Partner', icon: 'bicycle' as const, description: 'Deliver orders' },
];

export default function RegisterScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [selectedRole, setSelectedRole] = useState<UserRole>('customer');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  // Role-specific fields
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [storeName, setStoreName] = useState('');
  const [storeAddress, setStoreAddress] = useState('');
  const [storeDescription, setStoreDescription] = useState('');
  const [storeCategory, setStoreCategory] = useState('');
  const [vehicleType, setVehicleType] = useState('');
  const [licenseNumber, setLicenseNumber] = useState('');
  
  const { setUser, setSession, setLoading: setAuthLoading } = useAuthStore();

  const validateInputs = () => {
    if (!email || !password || !confirmPassword || !fullName || !phone) {
      Alert.alert('Error', 'Please fill in all required fields');
      return false;
    }

    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return false;
    }

    if (password.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters');
      return false;
    }

    // Role-specific validation
    if (selectedRole === 'customer' && (!address || !city)) {
      Alert.alert('Error', 'Please fill in address and city');
      return false;
    }

    if (selectedRole === 'store' && (!storeName || !storeAddress || !storeCategory)) {
      Alert.alert('Error', 'Please fill in store details');
      return false;
    }

    if (selectedRole === 'delivery_boy' && (!vehicleType || !licenseNumber)) {
      Alert.alert('Error', 'Please fill in vehicle and license details');
      return false;
    }

    return true;
  };

  const handleRegister = async () => {
    if (!validateInputs()) return;

    setLoading(true);
    setAuthLoading(true);

    try {
      // Create auth user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: email.trim(),
        password,
      });

      if (authError) {
        Alert.alert('Error', authError.message);
        return;
      }

      if (authData.user) {
        // Prepare profile data based on role
        let profileData: any = {
          full_name: fullName,
          phone,
          role: selectedRole,
        };

        if (selectedRole === 'customer') {
          profileData = {
            ...profileData,
            address,
            city,
          };
        } else if (selectedRole === 'store') {
          profileData = {
            ...profileData,
            store_name: storeName,
            store_address: storeAddress,
            store_description: storeDescription,
            store_category: storeCategory,
          };
        } else if (selectedRole === 'delivery_boy') {
          profileData = {
            ...profileData,
            vehicle_type: vehicleType,
            license_number: licenseNumber,
            is_available: true,
          };
        }

        // Create user profile
        const { error: profileError } = await createUserProfile(
          authData.user.id,
          email.trim(),
          selectedRole,
          profileData
        );

        if (profileError) {
          Alert.alert('Error', 'Failed to create profile: ' + profileError.message);
          return;
        }

        // Set auth state
        setUser(authData.user);
        if (authData.session) {
          setSession(authData.session);
        }

        Alert.alert(
          'Success',
          'Account created successfully! Please check your email to verify your account.',
          [
            {
              text: 'OK',
              onPress: () => router.replace('/login'),
            },
          ]
        );
      }
    } catch (error) {
      Alert.alert('Error', 'An unexpected error occurred');
      console.error('Registration error:', error);
    } finally {
      setLoading(false);
      setAuthLoading(false);
    }
  };

  const renderRoleSpecificFields = () => {
    switch (selectedRole) {
      case 'customer':
        return (
          <>
            <View>
              <Text className="text-neutral-900 text-sm font-medium mb-3">Address *</Text>
              <View className="input-field">
                <TextInput
                  value={address}
                  onChangeText={setAddress}
                  placeholder="Enter your address"
                  placeholderTextColor="#a3a3a3"
                  className="text-neutral-900 text-base"
                  multiline
                />
              </View>
            </View>
            <View>
              <Text className="text-neutral-900 text-sm font-medium mb-3">City *</Text>
              <View className="input-field">
                <TextInput
                  value={city}
                  onChangeText={setCity}
                  placeholder="Enter your city"
                  placeholderTextColor="#a3a3a3"
                  className="text-neutral-900 text-base"
                />
              </View>
            </View>
          </>
        );

      case 'store':
        return (
          <>
            <View>
              <Text className="text-neutral-900 text-sm font-medium mb-3">Store Name *</Text>
              <View className="input-field">
                <TextInput
                  value={storeName}
                  onChangeText={setStoreName}
                  placeholder="Enter store name"
                  placeholderTextColor="#a3a3a3"
                  className="text-neutral-900 text-base"
                />
              </View>
            </View>
            <View>
              <Text className="text-neutral-900 text-sm font-medium mb-3">Store Address *</Text>
              <View className="input-field">
                <TextInput
                  value={storeAddress}
                  onChangeText={setStoreAddress}
                  placeholder="Enter store address"
                  placeholderTextColor="#a3a3a3"
                  className="text-neutral-900 text-base"
                  multiline
                />
              </View>
            </View>
            <View>
              <Text className="text-neutral-900 text-sm font-medium mb-3">Store Category *</Text>
              <View className="input-field">
                <TextInput
                  value={storeCategory}
                  onChangeText={setStoreCategory}
                  placeholder="e.g., Grocery, Electronics, Fashion"
                  placeholderTextColor="#a3a3a3"
                  className="text-neutral-900 text-base"
                />
              </View>
            </View>
            <View>
              <Text className="text-neutral-900 text-sm font-medium mb-3">Store Description</Text>
              <View className="input-field">
                <TextInput
                  value={storeDescription}
                  onChangeText={setStoreDescription}
                  placeholder="Describe your store"
                  placeholderTextColor="#a3a3a3"
                  className="text-neutral-900 text-base"
                  multiline
                />
              </View>
            </View>
          </>
        );

      case 'delivery_boy':
        return (
          <>
            <View>
              <Text className="text-neutral-900 text-sm font-medium mb-3">Vehicle Type *</Text>
              <View className="input-field">
                <TextInput
                  value={vehicleType}
                  onChangeText={setVehicleType}
                  placeholder="e.g., Bike, Scooter, Car"
                  placeholderTextColor="#a3a3a3"
                  className="text-neutral-900 text-base"
                />
              </View>
            </View>
            <View>
              <Text className="text-neutral-900 text-sm font-medium mb-3">License Number *</Text>
              <View className="input-field">
                <TextInput
                  value={licenseNumber}
                  onChangeText={setLicenseNumber}
                  placeholder="Enter license number"
                  placeholderTextColor="#a3a3a3"
                  className="text-neutral-900 text-base"
                />
              </View>
            </View>
          </>
        );

      default:
        return null;
    }
  };

  return (
    <View className="flex-1 bg-neutral-0">
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View className="flex-1 justify-center px-6 py-12">
            {/* Header */}
            <View className="items-center mb-12">
              <View className="w-20 h-20 bg-neutral-900 rounded-2xl items-center justify-center mb-8">
                <Ionicons name="person-add" size={32} color="white" />
              </View>
              <Text className="text-neutral-900 text-3xl font-bold text-center mb-2">Create Account</Text>
              <Text className="text-neutral-500 text-base text-center">
                Join our delivery network
              </Text>
            </View>

            {/* Role Selection */}
            <View className="mb-8">
              <Text className="text-neutral-900 text-sm font-medium mb-4">Select Account Type</Text>
              <View className="space-y-3">
                {roleOptions.map((role) => (
                  <TouchableOpacity
                    key={role.key}
                    onPress={() => setSelectedRole(role.key as UserRole)}
                    className={`flex-row items-center p-4 rounded-2xl border ${
                      selectedRole === role.key
                        ? 'bg-neutral-900 border-neutral-900'
                        : 'bg-neutral-50 border-neutral-200'
                    }`}
                  >
                    <View
                      className={`w-12 h-12 rounded-full items-center justify-center mr-3 ${
                        selectedRole === role.key ? 'bg-white/20' : 'bg-neutral-100'
                      }`}
                    >
                      <Ionicons
                        name={role.icon}
                        size={24}
                        color={selectedRole === role.key ? 'white' : '#525252'}
                      />
                    </View>
                    <View className="flex-1">
                      <Text className={`text-base font-semibold ${
                        selectedRole === role.key ? 'text-white' : 'text-neutral-900'
                      }`}>{role.label}</Text>
                      <Text className={`text-sm ${
                        selectedRole === role.key ? 'text-white/70' : 'text-neutral-500'
                      }`}>{role.description}</Text>
                    </View>
                    <View
                      className={`w-5 h-5 rounded-full border-2 ${
                        selectedRole === role.key
                          ? 'bg-white border-white'
                          : 'border-neutral-300'
                      }`}
                    >
                      {selectedRole === role.key && (
                        <View className="w-1 h-1 bg-neutral-900 rounded-full m-auto mt-1" />
                      )}
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Form */}
            <View className="space-y-6">
              <View>
                <Text className="text-neutral-900 text-sm font-medium mb-3">Full Name *</Text>
                <View className="input-field">
                  <TextInput
                    value={fullName}
                    onChangeText={setFullName}
                    placeholder="Enter your full name"
                    placeholderTextColor="#a3a3a3"
                    className="text-neutral-900 text-base"
                  />
                </View>
              </View>

              <View>
                <Text className="text-neutral-900 text-sm font-medium mb-3">Email Address *</Text>
                <View className="input-field">
                  <TextInput
                    value={email}
                    onChangeText={setEmail}
                    placeholder="Enter your email"
                    placeholderTextColor="#a3a3a3"
                    autoCapitalize="none"
                    keyboardType="email-address"
                    className="text-neutral-900 text-base"
                  />
                </View>
              </View>

              <View>
                <Text className="text-neutral-900 text-sm font-medium mb-3">Phone Number *</Text>
                <View className="input-field">
                  <TextInput
                    value={phone}
                    onChangeText={setPhone}
                    placeholder="Enter your phone number"
                    placeholderTextColor="#a3a3a3"
                    keyboardType="phone-pad"
                    className="text-neutral-900 text-base"
                  />
                </View>
              </View>

              <View>
                <Text className="text-neutral-900 text-sm font-medium mb-3">Password *</Text>
                <View className="input-field flex-row items-center">
                  <TextInput
                    value={password}
                    onChangeText={setPassword}
                    placeholder="Enter your password"
                    placeholderTextColor="#a3a3a3"
                    secureTextEntry={!showPassword}
                    className="text-neutral-900 text-base flex-1"
                    autoCorrect={false}
                    autoCapitalize="none"
                    textContentType="oneTimeCode"
                    keyboardType="default"
                    spellCheck={false}
                  />
                  <TouchableOpacity
                    onPress={() => setShowPassword(!showPassword)}
                    className="ml-3 p-1"
                  >
                    <Ionicons
                      name={showPassword ? 'eye-off' : 'eye'}
                      size={20}
                      color="#a3a3a3"
                    />
                  </TouchableOpacity>
                </View>
              </View>

              <View>
                <Text className="text-neutral-900 text-sm font-medium mb-3">Confirm Password *</Text>
                <View className="input-field flex-row items-center">
                  <TextInput
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                    placeholder="Confirm your password"
                    placeholderTextColor="#a3a3a3"
                    secureTextEntry={!showConfirmPassword}
                    className="text-neutral-900 text-base flex-1"
                    autoCorrect={false}
                    autoCapitalize="none"
                    textContentType="oneTimeCode"
                    keyboardType="default"
                    spellCheck={false}
                  />
                  <TouchableOpacity
                    onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="ml-3 p-1"
                  >
                    <Ionicons
                      name={showConfirmPassword ? 'eye-off' : 'eye'}
                      size={20}
                      color="#a3a3a3"
                    />
                  </TouchableOpacity>
                </View>
              </View>

              {/* Role-specific fields */}
              {renderRoleSpecificFields()}

              {/* Register Button */}
              <TouchableOpacity
                onPress={handleRegister}
                disabled={loading}
                className="btn-primary items-center justify-center h-14 mt-8"
              >
                {loading ? (
                  <ActivityIndicator color="white" />
                ) : (
                  <Text className="text-white text-base font-semibold">
                    Create Account
                  </Text>
                )}
              </TouchableOpacity>

              {/* Sign In Link */}
              <View className="flex-row justify-center items-center mt-8 pt-6 border-t border-neutral-100">
                <Text className="text-neutral-500">Already have an account? </Text>
                <Link href="/login" asChild>
                  <TouchableOpacity>
                    <Text className="text-neutral-900 font-semibold">Sign In</Text>
                  </TouchableOpacity>
                </Link>
              </View>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}
