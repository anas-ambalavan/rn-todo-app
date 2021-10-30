import React, { useState, useReducer, useCallback, useEffect } from "react";
import {
  ScrollView,
  View,
  KeyboardAvoidingView,
  StyleSheet,
  Button,
  ActivityIndicator,
  Alert,
  Platform,
  TouchableOpacity,
  Text,
} from "react-native";
// import { LinearGradient } from "expo-linear-gradient";
// import { useDispatch } from "react-redux";
import AsyncStorage from "@react-native-async-storage/async-storage";

import Input from "../components/UI/Input";
import Card from "../components/UI/Card";
import Colors from "../constants/Colors";
import ButtonCmp from "../components/UI/ButtonCmp";
import axios from "../axios/";
// import * as authActions from "../../store/actions/auth";

const FORM_INPUT_UPDATE = "FORM_INPUT_UPDATE";

const formReducer = (state, action) => {
  if (action.type === FORM_INPUT_UPDATE) {
    const updatedValues = {
      ...state.inputValues,
      [action.input]: action.value,
    };
    const updatedValidities = {
      ...state.inputValidities,
      [action.input]: action.isValid,
    };
    let updatedFormIsValid = true;
    for (const key in updatedValidities) {
      updatedFormIsValid = updatedFormIsValid && updatedValidities[key];
    }
    return {
      formIsValid: updatedFormIsValid,
      inputValidities: updatedValidities,
      inputValues: updatedValues,
    };
  }
  return state;
};

const AuthScreen = ({ signup = false, ...props }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState();
  const [isSignup, setIsSignup] = useState(signup);
  //   const dispatch = useDispatch();

  const [formState, dispatchFormState] = useReducer(formReducer, {
    inputValues: {
      email: "",
      password: "",
    },
    inputValidities: {
      email: false,
      password: false,
    },
    formIsValid: false,
  });

  useEffect(() => {
    if (error) {
      Alert.alert("An error occured", error, [{ text: "Okay" }]);
    }
  }, [error]);

  const signUp = () => {
    axios
      .post("/user/register", {
        email: formState.inputValues.email,
        pass: formState.inputValues.password,
      })
      .then((res) => {
        saveToAsyncStorage(
          res.data.token,
          res.data.userId,
          res.data.expiryDate
        );
        props.onScreenChange("todo");
      })
      .catch((err) => {
        // console.log(err.response.data.message);
        Alert.alert(
          "An error occured",
          err.response.data.message || err.message,
          [{ text: "Okay" }]
        );
        setIsLoading(false);
      });
  };

  const login = () => {
    axios
      .post("/user/login", {
        email: formState.inputValues.email,
        pass: formState.inputValues.password,
      })
      .then((res) => {
        saveToAsyncStorage(
          res.data.token,
          res.data.userId,
          res.data.expiryDate
        );
        props.onScreenChange("todo");
      })
      .catch((err) => {
        Alert.alert(
          "An error occured",
          err.response.data.message || err.message,
          [{ text: "Okay" }]
        );
        setIsLoading(false);
      });
  };

  // console.log(formState);

  const authHandler = async () => {
    let action;
    if (isSignup) {
      signUp();
    } else {
      login();
    }
    setError(null);
    setIsLoading(true);
    try {
      //   await dispatch(action);
      // props.handler;
      // console.log("hello");
    } catch (err) {
      setError(err.message);
      setIsLoading(false);
    }
  };

  const inputChangeHandler = useCallback(
    (inputIdentifier, inputValue, inputValidity) => {
      dispatchFormState({
        type: FORM_INPUT_UPDATE,
        value: inputValue,
        isValid: inputValidity,
        input: inputIdentifier,
      });
    },
    [dispatchFormState]
  );

  const saveToAsyncStorage = (token, userId, expirationDate) => {
    AsyncStorage.setItem(
      "userData",
      JSON.stringify({
        token: token,
        userId: userId,
        expiryDate: expirationDate,
      })
    );
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS == "ios" ? "padding" : "height"}
      style={styles.screen}
    >
      <Card style={styles.authContainer}>
        <ScrollView>
          <Input
            id="email"
            label="E-Mail"
            keyboardType="email-address"
            required
            email
            autoCapitalize="none"
            errorText="Please enter a valid email address."
            onInputChange={inputChangeHandler}
            initialValue=""
          />
          <Input
            id="password"
            label="Password"
            keyboardType="default"
            secureTextEntry
            required
            minLength={5}
            autoCapitalize="none"
            errorText="Please enter a valid password."
            onInputChange={inputChangeHandler}
            initialValue=""
          />
          <View style={styles.buttonContainer}>
            {isLoading ? (
              <ActivityIndicator size="small" color={Colors.primary} />
            ) : (
              <ButtonCmp
                btnStyle="auth"
                text={isSignup ? "Sign Up" : "Login"}
                btnColor={Colors.primary}
                textColor={Colors.accent}
                activeTab={isSignup ? "Sign Up" : "Login"}
                onPress={authHandler}
              />
            )}
          </View>
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              onPress={() => {
                setIsSignup((prevState) => !prevState);
              }}
            >
              <Text style={styles.bottomText}>{`Switch to ${
                isSignup ? "Login" : "Sign Up"
              }`}</Text>
            </TouchableOpacity>
            {/* <Button
              // style={styles.button}
              title={`Switch to ${isSignup ? "Login" : "SignUp"}`}
              color={Colors.secondary}
              onPress={() => {
                setIsSignup((prevState) => !prevState);
              }}
            /> */}
          </View>
        </ScrollView>
      </Card>
      {/* </LinearGradient> */}
    </KeyboardAvoidingView>
  );
};

export const screenOptions = {
  headerTitle: "Authenticate",
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  authContainer: {
    width: "80%",
    maxWidth: 400,
    maxHeight: 400,
    padding: 20,
  },
  buttonContainer: {
    marginTop: 10,
    alignItems: "center",
  },
  bottomText: {
    color: Colors.secondary,
    fontSize: 16,
  },
});

export default AuthScreen;
