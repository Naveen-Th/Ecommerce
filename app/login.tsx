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
import { useAuthStore } from '../store/authStore';
import { supabase } from '../utils/supabase';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  const { setUser, setSession, setUserProfile, setLoading: setAuthLoading } = useAuthStore();

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    setLoading(true);
    setAuthLoading(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (error) {
        Alert.alert('Error', error.message);
        return;
      }

      if (data.user && data.session) {
        setUser(data.user);
        setSession(data.session);
        
        // Fetch user profile
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', data.user.id)
          .single();

        if (profile) {
          setUserProfile(profile);
          
          // Navigate based on role
          switch (profile.role) {
            case 'customer':
              router.replace('/(tabs)/customer');
              break;
            case 'store':
              router.replace('/(tabs)/store' as any);
              break;
            case 'delivery_boy':
              router.replace('/(tabs)/delivery' as any);
              break;
            default:
              router.replace('/(tabs)/customer');
          }
        }
      }
    } catch (error) {
      Alert.alert('Error', 'An unexpected error occurred');
      console.error('Login error:', error);
    } finally {
      setLoading(false);
      setAuthLoading(false);
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
        >
          <View className="flex-1 justify-center px-6 py-12">
            {/* Header */}
            <View className="items-center mb-12">
              <View className="w-20 h-20 bg-neutral-900 rounded-2xl items-center justify-center mb-8">
                <Ionicons name="storefront" size={32} color="white" />
              </View>
              <Text className="text-neutral-900 text-3xl font-bold text-center mb-2">
                Welcome Back
              </Text>
              <Text className="text-neutral-500 text-base text-center">
                Sign in to continue shopping
              </Text>
            </View>

            {/* Form */}
            <View className="space-y-6">
              <View>
                <Text className="text-neutral-900 text-sm font-medium mb-3">Email Address</Text>
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
                <Text className="text-neutral-900 text-sm font-medium mb-3">Password</Text>
                <View className="input-field flex-row items-center">
                  <TextInput
                    value={password}
                    onChangeText={setPassword}
                    placeholder="Enter your password"
                    placeholderTextColor="#a3a3a3"
                    secureTextEntry={!showPassword}
                    className="text-neutral-900 text-base flex-1"
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

              {/* Login Button */}
              <TouchableOpacity
                onPress={handleLogin}
                disabled={loading}
                className="btn-primary items-center justify-center h-14 mt-8"
              >
                {loading ? (
                  <ActivityIndicator color="white" />
                ) : (
                  <Text className="text-white text-base font-semibold">
                    Sign In
                  </Text>
                )}
              </TouchableOpacity>

              {/* Forgot Password */}
              <TouchableOpacity className="mt-6">
                <Text className="text-neutral-500 text-center font-medium">
                  Forgot your password?
                </Text>
              </TouchableOpacity>

              {/* Sign Up Link */}
              <View className="flex-row justify-center items-center mt-8 pt-6 border-t border-neutral-100">
                <Text className="text-neutral-500">Don&apos;t have an account? </Text>
                <Link href="/register" asChild>
                  <TouchableOpacity>
                    <Text className="text-neutral-900 font-semibold">Sign Up</Text>
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
