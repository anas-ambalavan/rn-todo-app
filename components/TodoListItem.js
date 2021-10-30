import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import BouncyCheckBox from "react-native-bouncy-checkbox";
import Colors from "../constants/Colors";
import { width } from "../constants/Constants";

const TodoListItem = ({
  item,
  deleteItem,
  editItem,
  isEditing,
  editItemDetail,
  saveEditItem,
  handleEditChange,
  itemChecked,
  checkedItems,
}) => {
  // const checked = checkedItems.filter(
  //   (checkedItem) => checkedItem.id === item.id
  // );
  //   const [checkBoxValue, setcheckBoxValue] = useState(
  //     checked.length ? true : false
  //   );
  // console.log(checkedItemText);
  return (
    // <View style={styles.listItem}>

    <View style={styles.listItemContainer}>
      <View style={styles.listItemLeft}>
        {isEditing && editItemDetail.id === item.id ? (
          <TextInput
            placeholder="Edit Item..."
            style={styles.editItemInput}
            onChangeText={handleEditChange}
            value={editItemDetail.text}
          />
        ) : (
          <>
            <BouncyCheckBox
              iconStyle={{ borderColor: Colors.secondary, borderRadius: 8 }}
              fillColor={Colors.primary}
              onPress={(value) => {
                console.log(value);
                itemChecked(item.id, value);
                // setcheckBoxValue(checked.length ? true : false);
              }}
              isChecked={item.completed ? true : false}
            />
            <Text
              //   onPress={() => {
              //     // setcheckBoxValue(true);
              //     // console.log(checkBoxValue);
              //     itemChecked(item.id, item.text);
              //   }}
              style={[
                item.completed ? styles.checkedItemText : null,
                styles.itemText,
              ]}
            >
              {item.text}
            </Text>
          </>
        )}
      </View>
      <View
        style={[
          styles.iconContainer,
          { ...(item ? { justifyContent: "flex-end" } : "") },
        ]}
      >
        {isEditing && editItemDetail.id === item.id ? (
          <TouchableOpacity
            onPress={() => saveEditItem(item.id, editItemDetail.text)}
          >
            <Ionicons
              name={Platform.OS === "ios" ? "ios-save" : "md-save"}
              size={25}
            />
          </TouchableOpacity>
        ) : (
          !item.completed && (
            <TouchableOpacity onPress={() => editItem(item.id, item.text)}>
              <Ionicons
                name={
                  Platform.OS === "ios" ? "ios-pencil-sharp" : "md-pencil-sharp"
                }
                size={25}
              />
            </TouchableOpacity>
          )
        )}
        <TouchableOpacity
          style={{ marginLeft: 10 }}
          onPress={() => deleteItem(item.id)}
        >
          <Ionicons
            name={Platform.OS === "ios" ? "ios-trash" : "md-trash"}
            size={25}
          />
        </TouchableOpacity>
      </View>
    </View>

    // </View>
  );
};

export default TodoListItem;

const styles = StyleSheet.create({
  listItemContainer: {
    width: width * 0.8,
    padding: 15,
    backgroundColor: "#f8f8f8",
    borderBottomWidth: 1,
    borderColor: "#eee",
    borderRadius: 10,
    marginVertical: 10,
    alignSelf: "center",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  listItemLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: 70,
  },
  checkedItemText: {
    textDecorationLine: "line-through",
  },
  itemText: {
    color: Colors.primary,
  },
  editItemInput: {
    width: "80%",
  },
});
