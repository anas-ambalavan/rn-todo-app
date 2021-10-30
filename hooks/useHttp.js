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
function useHttp(getToken) {
  //   const [httpState, dispatch] = useReducer(httpReducer, {
  //     status: startWithPending ? "pending" : null,
  //     data: null,
  //     error: null,
  //   });

  const sendRequest = useCallback(function (
    url,
    data,
    method,
    successFunction
  ) {
    //   dispatch({ type: "SEND" });

    // dispatch({ type: "SUCCESS", responseData });
    getToken().then((token) => {
      axios({
        url,
        data,
        method,
        token,
      })
        .then((res) => {
          successFunction(res);
        })
        .catch((err) => {
          Alert.alert(
            "An error occured",
            (err.response && err.response.data.message) || err.message,
            [{ text: "Okay" }]
          );
        });
    });
  },
  []);

  return {
    sendRequest,
    // ...httpState,
  };
}

export default useHttp;
