import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Colors from "../../constants/Colors";

const ButtonCmp = (props) => {
  const authBtnStyle = props.btnStyle ? { margin: 30, marginVertical: 10 } : {};
  return (
    <TouchableOpacity
      {...props}
      style={{
        ...styles.button,
        backgroundColor:
          props.activeTab === props.text ? Colors.primary : Colors.accent,
        ...authBtnStyle,
      }}
      onPress={() => {
        props.setActiveTab ? props.setActiveTab(props.text) : "";
      }}
    >
      <Text
        style={{
          color:
            props.activeTab === props.text ? Colors.accent : Colors.primary,
          fontSize: 15,
          fontWeight: Platform.OS === "android" ? "bold" : "900",
        }}
      >
        {props.text}
      </Text>
    </TouchableOpacity>
  );
};

export default ButtonCmp;

const styles = StyleSheet.create({
  button: {
    paddingVertical: 6,
    paddingHorizontal: 16,
    borderRadius: 30,
    alignItems: "center",
  },
});
