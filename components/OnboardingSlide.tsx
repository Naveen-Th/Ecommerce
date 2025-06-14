import React from 'react';
import {
  Dimensions,
  Image,
  Text,
  View,
} from 'react-native';

const { width } = Dimensions.get('window');

interface OnboardingSlideProps {
  item: {
    id: string;
    title: string;
    description: string;
    image: any;
    backgroundColor: string;
    titleColor: string;
    textColor: string;
  };
}

export const OnboardingSlide: React.FC<OnboardingSlideProps> = ({ item }) => {
  return (
    <View
      className="flex-1 justify-center items-center px-8 bg-neutral-0"
      style={{ width }}
    >
      <View className="flex-1 justify-center items-center">
        <View className="flex-1 justify-center items-center mb-12">
          <View className="w-80 h-80 bg-neutral-100 rounded-4xl items-center justify-center p-8">
            <Image 
              source={item.image} 
              className="w-full h-full" 
              resizeMode="contain" 
            />
          </View>
        </View>
        
        <View className="flex-1 justify-start items-center px-4 max-w-sm">
          <Text className="text-neutral-900 text-3xl font-bold text-center mb-6 leading-tight">
            {item.title}
          </Text>
          <Text className="text-neutral-600 text-lg text-center leading-7">
            {item.description}
          </Text>
        </View>
      </View>
    </View>
  );
};
