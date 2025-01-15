import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';

import { HomeScreen } from '../screens/HomeScreen';
import { LoginScreen } from '../screens/LoginScreen';
import { SignupScreen } from '../screens/SignupScreen';
import { HomeScreenUser } from '../screens/HomeScreenUser';

export type RootStackParamList = {
  Home:  { userId: number, isAdmin: number };
  HomeScreenUser : { userId: number, isAdmin: number };
  Login: undefined;
  Signup: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export function StackNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login" screenOptions={{ headerShown: false }}>
        <Stack.Screen 
          name="Login"
          component={LoginScreen}
          options={{ title: 'Login' }}
        />
        <Stack.Screen 
          name="Signup"
          component={SignupScreen}
          options={{ title: 'Signup' }}
        />
        <Stack.Screen 
          name="Home"
          component={HomeScreen}
          options={{ title: 'Home' }}
        />
        <Stack.Screen 
          name="HomeScreenUser"
          component={HomeScreenUser}
          options={{ title: 'Home User' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
