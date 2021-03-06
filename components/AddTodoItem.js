import React, { useState } from "react";
import {
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Colors from "../constants/Colors";

const AddTodoItem = ({ addItem }) => {
  const [text, setText] = useState("");

  const onChange = (textValue) => setText(textValue);

  return (
    <View style={styles.addItemContainer}>
      <TextInput
        style={styles.input}
        placeholder="Add item"
        onChangeText={onChange}
        value={text}
      />
      <TouchableOpacity
        onPress={() => {
          addItem(text);
          setText("");
        }}
      >
        <Ionicons
          name={
            Platform.OS === "ios"
              ? "ios-add-circle-sharp"
              : "md-add-circle-sharp"
          }
          size={30}
        />
      </TouchableOpacity>
    </View>
  );
};

export default AddTodoItem;

const styles = StyleSheet.create({
  addItemContainer: {
    width: "100%",
    marginVertical: 20,
    flexDirection: "row",
    marginHorizontal: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  input: {
    width: "80%",
    borderWidth: 1,
    borderColor: Colors.secondary,
    borderRadius: 15,
    height: 40,
    padding: 8,
    margin: 5,
  },
});
