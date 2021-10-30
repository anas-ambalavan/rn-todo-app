import { useCallback } from "react";
import { Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

import axios from "../axios";

function useHttp(useToken = true) {
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
  };

  const sendRequest = useCallback(function (
    url,
    data,
    method,
    successFunction,
    failureFunction = defaultFailureFn,
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
          failureFunction(err);
        })
        .finally(() => {
          finallyFunction();
        });
      if (!token) {
        renderFunction();
      }
    };

    if (useToken) {
      getToken().then((token) => {
        requestFn(token);
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
