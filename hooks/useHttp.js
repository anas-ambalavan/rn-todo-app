import { useCallback } from "react";
import { Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

import axios from "../axios";

function useHttp(useToken = true, switchToLogin = () => {}) {
  const getToken = async () => {
    const userData = await AsyncStorage.getItem("userData");
    if (userData) return JSON.parse(userData).token;
    return null;
  };

  const defaultFailureFn = (err) => {
    Alert.alert(
      "An error occured",
      (err.response && err.response.data.message) || err.message,
      [{ text: "Okay" }]
    );
    if (err.response && err.response.status === 401) {
      switchToLogin("login");
    }
  };

  const sendRequest = useCallback(function (
    url,
    data,
    method,
    successFunction,
    failureFunction = () => {},
    finallyFunction = () => {},
    renderFunction = () => {}
  ) {
    const requestFn = (token = null) => {
      axios({
        url,
        data,
        method,
        token: token,
      })
        .then((res) => {
          successFunction(res);
        })
        .catch((err) => {
          console.log("err");
          failureFunction();
          defaultFailureFn(err);

          // console.log(err.response.status);
        })
        .finally(() => {
          finallyFunction();
        });
    };

    if (useToken) {
      getToken().then((token) => {
        if (!token) renderFunction();
        else requestFn(token);
      });
    } else {
      requestFn();
    }
  },
  []);

  return {
    sendRequest,
  };
}

export default useHttp;
