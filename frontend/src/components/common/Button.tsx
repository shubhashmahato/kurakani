import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ViewStyle } from 'react-native';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'danger';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  loading?: boolean;
  style?: ViewStyle;
}

export default function Button({
  title,
  onPress,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  loading = false,
  style,
}: ButtonProps) {
  const getBackgroundColor = () => {
    if (disabled) return '#ccc';
    switch (variant) {
      case 'primary':
        return '#075E54';
      case 'secondary':
        return '#E8E8E8';
      case 'danger':
        return '#D32F2F';
      default:
        return '#075E54';
    }
  };

  const getTextColor = () => {
    switch (variant) {
      case 'secondary':
        return '#000';
      default:
        return '#fff';
    }
  };

  const getPadding = () => {
    switch (size) {
      case 'small':
        return 8;
      case 'medium':
        return 12;
      case 'large':
        return 16;
      default:
        return 12;
    }
  };

  return (
    <TouchableOpacity
      style={[
        {
          backgroundColor: getBackgroundColor(),
          padding: getPadding(),
          borderRadius: 8,
          alignItems: 'center',
          justifyContent: 'center',
          opacity: disabled ? 0.6 : 1,
        },
        style,
      ]}
      onPress={onPress}
      disabled={disabled || loading}
    >
      <Text
        style={{
          color: getTextColor(),
          fontWeight: '600',
          fontSize: size === 'large' ? 16 : 14,
        }}
      >
        {loading ? 'Loading...' : title}
      </Text>
    </TouchableOpacity>
  );
}