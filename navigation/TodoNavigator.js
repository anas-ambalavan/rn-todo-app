import React from "react";
import { createStackNavigator } from "@react-navigation/stack";

import Colors from "../constants/Colors";
import TodoScreen from "../screens/TodoScreen";
import AuthScreen from "../screens/AuthScreen";

const TodoStackNavigator = createStackNavigator();

export const TodoNavigator = () => {
  return (
    <TodoStackNavigator.Navigator>
      <TodoStackNavigator.Screen name="todo" component={TodoScreen} />
    </TodoStackNavigator.Navigator>
  );
};

const AuthStackNavigator = createStackNavigator();

export const AuthNavigator = () => {
  return (
    <AuthStackNavigator.Navigator>
      <AuthStackNavigator.Screen name="Auth" component={AuthScreen} />
    </AuthStackNavigator.Navigator>
  );
};
