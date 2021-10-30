import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "./axios/";
import React, { useEffect, useState } from "react";
import { StyleSheet, View, ActivityIndicator } from "react-native";
import Colors from "./constants/Colors";

import AuthScreen from "./screens/AuthScreen";

import TodoScreen from "./screens/TodoScreen";
import useHttp from "./hooks/useHttp";

export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [screen, setScreen] = useState(null);

  // const loginHandler = () => {
  //   setValue(true);
  // };

  const changeScreenHandler = (screenName) => {
    setScreen(screenName);
  };

  const { sendRequest } = useHttp();

  useEffect(() => {
    const handleSuccess = () => {
      setScreen("todo");
    };
    const handleFailure = (err) => {
      console.log(err);
      // AsyncStorage.removeItem("userData");
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
    // getUser().then((token) => {
    //   // console.log(token);
    //   if (token) {
    //     axios
    //       .get("/user/validate", { token })
    //       .then((res) => {
    //         setScreen("todo");
    //       })
    //       .catch((err) => {
    //         console.log(err.message);
    //         // AsyncStorage.removeItem("userData");
    //         setScreen("login");
    //       })
    //       .finally(() => {
    //         setIsLoading(false);
    //       });
    //***************************** */
    //   } else {
    //     setScreen("signup");
    //     setIsLoading(false);
    //   }
    // });
  }, []);

  // return value === true ? (
  //   <TodoScreen />
  // ) : (
  //   <AuthScreen handler={loginHandler} />
  // );
  let componentRendered = null;

  if (!isLoading && screen) {
    if (screen === "login") {
      componentRendered = <AuthScreen onScreenChange={changeScreenHandler} />;
    } else if (screen === "signup") {
      componentRendered = (
        <AuthScreen signup onScreenChange={changeScreenHandler} />
      );
    } else {
      componentRendered = <TodoScreen />;
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
