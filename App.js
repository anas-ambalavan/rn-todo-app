import { StatusBar } from "expo-status-bar";
import React, { useState } from "react";
import { SafeAreaView, StyleSheet, Text, View } from "react-native";
import AddTodoItem from "./components/AddTodoItem";
import HeaderTab from "./components/HeaderTab";

export default function App() {
  const [activeTab, setActiveTab] = useState("All");

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      <View style={styles.container}>
        <Text style={styles.headerText}>Todo App</Text>
        <HeaderTab activeTab={activeTab} setActiveTab={setActiveTab} />
        <AddTodoItem />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    // flex: 1,
    // backgroundColor: "#fff",
    alignItems: "center",
    marginTop: 40,
    // justifyContent: "center",
  },
  headerText: {
    fontWeight: "900",
    fontSize: 20,
    marginVertical: 30,
  },
});
