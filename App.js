import React, { useEffect, useState } from "react";
import {
  FlatList,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  Alert,
} from "react-native";
import AddTodoItem from "./components/AddTodoItem";
import HeaderTab from "./components/HeaderTab";
import TodoListItem from "./components/TodoListItem";
import TodoScreen from "./screens/TodoScreen";

export default function App() {
  return <TodoScreen />;
}

const styles = StyleSheet.create({});
