import React, { useEffect, useState } from "react";
import { StyleSheet, View, ActivityIndicator } from "react-native";

import Colors from "./constants/Colors";
import AuthScreen from "./screens/AuthScreen";
import TodoScreen from "./screens/TodoScreen";
import useHttp from "./hooks/useHttp";

export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [screen, setScreen] = useState(null);

  const changeScreenHandler = (screenName) => {
    setScreen(screenName);
  };

  const { sendRequest } = useHttp();

  useEffect(() => {
    const handleSuccess = () => {
      setScreen("todo");
    };
    const handleFailure = (err) => {
      setScreen("login");
    };
    const handleFinally = () => {
      setIsLoading(false);
    };
    const handleAuthScreen = () => {
      setScreen("signup");
      setIsLoading(false);
    };
    sendRequest(
      `/user/validate`,
      null,
      "get",
      handleSuccess,
      handleFailure,
      handleFinally,
      handleAuthScreen
    );
  }, []);

  let componentRendered = null;

  if (!isLoading && screen) {
    if (screen === "login") {
      componentRendered = <AuthScreen onScreenChange={changeScreenHandler} />;
    } else if (screen === "signup") {
      componentRendered = (
        <AuthScreen signup onScreenChange={changeScreenHandler} />
      );
    } else {
      componentRendered = <TodoScreen onScreenChange={changeScreenHandler} />;
    }
  }

  return (
    <>
      {isLoading && (
        <View style={styles.screen}>
          <ActivityIndicator size="large" color={Colors.primary} />
        </View>
      )}
      {componentRendered}
    </>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
