import React from 'react';
import { Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import LazyScreen from 'react-navigation-lazy-screen';

import type { RootStackParamList } from './type';

// Create our stack navigator
let RootStack = createStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator();

function Tabs() {
  return (
    <Tab.Navigator>
      <Tab.Screen name="TabA">
        {(props) => {
          return (
            <LazyScreen
              {...props}
              pageName="TabA"
              fallback={<Text>Loading...</Text>}
              factory={() => import('../screen/TabScreen')}
            />
          );
        }}
      </Tab.Screen>
      <Tab.Screen name="TabB">
        {(props) => {
          return (
            <LazyScreen
              {...props}
              pageName="TabB"
              fallback={<Text>Loading...</Text>}
              factory={() => import('../screen/TabScreen')}
            />
          );
        }}
      </Tab.Screen>
    </Tab.Navigator>
  );
}

const Router = () => (
  <NavigationContainer>
    {/* Screen configuration */}
    <RootStack.Navigator>
      <RootStack.Screen name="StackScreen">
        {(props) => {
          return (
            <LazyScreen
              {...props}
              pageName="Home"
              fallback={<Text>Loading...</Text>}
              factory={() => import('../screen/StackScreen')}
            />
          );
        }}
      </RootStack.Screen>
      <RootStack.Screen name="StackScreenB">
        {(props) => {
          return (
            <LazyScreen
              {...props}
              pageName="StackScreenB"
              fallback={<Text>Loading...</Text>}
              factory={() => import('../screen/StackScreen')}
            />
          );
        }}
      </RootStack.Screen>
      <RootStack.Screen name="TabS" component={Tabs} />
    </RootStack.Navigator>
  </NavigationContainer>
);

export default Router;
