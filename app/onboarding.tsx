import { router } from 'expo-router';
import React, { useRef, useState } from 'react';
import {
  StatusBar,
  Text,
  View,
} from 'react-native';
import AppIntroSlider from 'react-native-app-intro-slider';
import { OnboardingSlide } from '../components/OnboardingSlide';
import { onboardingData } from '../constants/onboardingData';
import { useAuthStore } from '../store/authStore';

export default function OnboardingScreen() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const sliderRef = useRef<AppIntroSlider>(null);
  const { setOnboardingComplete } = useAuthStore();

  const handleSkip = () => {
    handleFinish();
  };

  const handleFinish = () => {
    setOnboardingComplete(true);
    router.replace('/login');
  };

  const renderSlide = ({ item }: { item: any }) => (
    <OnboardingSlide item={item} />
  );

  const renderNextButton = () => (
    <View className="btn-primary items-center justify-center mx-6 h-14">
      <Text className="text-white font-semibold text-base">
        {currentIndex === onboardingData.length - 1 ? 'Get Started' : 'Next'}
      </Text>
    </View>
  );

  const renderSkipButton = () => (
    <View className="px-6 py-3 mx-4">
      <Text className="text-neutral-500 font-medium text-base">Skip</Text>
    </View>
  );

  const renderDoneButton = () => (
    <View className="btn-primary items-center justify-center mx-6 h-14">
      <Text className="text-white font-semibold text-base">Get Started</Text>
    </View>
  );

  return (
    <View className="flex-1">
      <StatusBar barStyle="light-content" />
      <AppIntroSlider
        ref={sliderRef}
        data={onboardingData}
        renderItem={renderSlide}
        onSlideChange={(index) => setCurrentIndex(index)}
        onDone={handleFinish}
        onSkip={handleSkip}
        showSkipButton={true}
        showNextButton={true}
        showDoneButton={true}
        renderNextButton={renderNextButton}
        renderSkipButton={renderSkipButton}
        renderDoneButton={renderDoneButton}
        dotStyle={{
          backgroundColor: 'rgba(0, 0, 0, 0.1)',
          width: 8,
          height: 8,
          borderRadius: 4,
          marginHorizontal: 4,
        }}
        activeDotStyle={{
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          width: 20,
          height: 8,
          borderRadius: 4,
          marginHorizontal: 4,
        }}
        bottomButton={true}
      />
    </View>
  );
}
