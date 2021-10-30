import AsyncStorage from "@react-native-async-storage/async-storage";
import { useReducer, useCallback } from "react";
import { Alert } from "react-native";

import axios from "../axios";

// function httpReducer(state, action) {
//   if (action.type === "SEND") {
//     return {
//       data: null,
//       error: null,
//       status: "pending",
//     };
//   }

//   if (action.type === "SUCCESS") {
//     return {
//       data: action.responseData,
//       error: null,
//       status: "completed",
//     };
//   }

//   if (action.type === "ERROR") {
//     return {
//       data: null,
//       error: action.errorMessage,
//       status: "completed",
//     };
//   }

//   return state;
// }
function useHttp(useToken = true) {
  //   const [httpState, dispatch] = useReducer(httpReducer, {
  //     status: startWithPending ? "pending" : null,
  //     data: null,
  //     error: null,
  //   });

  const getToken = async () => {
    const userData = await AsyncStorage.getItem("userData");
    // console.log(userData);
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
          console.log(res);
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
    //   dispatch({ type: "SEND" });

    // dispatch({ type: "SUCCESS", responseData });
    if (useToken) {
      getToken().then((token) => {
        requestFn(token);
        //   axios({
        //     url,
        //     data,
        //     method,
        //     token,
        //   })
        //     .then((res) => {
        //       successFunction(res);
        //     })
        //     .catch((err) => {
        //       Alert.alert(
        //         "An error occured",
        //         (err.response && err.response.data.message) || err.message,
        //         [{ text: "Okay" }]
        //       );
        //     });
      });
    } else {
      requestFn();
    }
  },
  []);

  return {
    sendRequest,
    // ...httpState,
  };
}

export default useHttp;
