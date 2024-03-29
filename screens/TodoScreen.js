import React, { useEffect, useState } from "react";
import {
  FlatList,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  Alert,
  Platform,
  KeyboardAvoidingView,
  TouchableOpacity,
} from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { KeyboardAwareFlatList } from "react-native-keyboard-aware-scroll-view";
import AddTodoItem from "../components/AddTodoItem";
import HeaderTab from "../components/HeaderTab";
import TodoListItem from "../components/TodoListItem";

import useHttp from "../hooks/useHttp";
import AsyncStorage from "@react-native-async-storage/async-storage";

const TodoScreen = (props) => {
  const [activeTab, setActiveTab] = useState("All");
  const [items, setItems] = useState([]);
  const [completed, setCompleted] = useState(items);
  const [notCompleted, setNotCompleted] = useState(items);

  // Flag true if user is currently editing an item
  const [editStatus, editStatusChange] = useState(false);

  // State to capture information about the item being edited
  const [editItemDetail, editItemDetailChange] = useState({
    id: null,
    text: null,
  });
  const [checkedItems, checkedItemChange] = useState([]);

  const { sendRequest } = useHttp(true, props.onScreenChange);

  const deleteItem = (id) => {
    const handleSuccess = (res) => {
      setItems((prevItems) => {
        return prevItems.filter((item) => item.id !== id);
      });
    };
    sendRequest(`/todos/delete/${id}`, null, "delete", handleSuccess);
  };

  // Submit the users edits to the overall items state
  const saveEditItem = (id, text) => {
    const handleSuccess = (res) => {
      setItems((prevItems) => {
        return prevItems.map((item) =>
          item.id === editItemDetail.id
            ? { ...item, text: editItemDetail.text }
            : item
        );
      });
      // Flip edit status back to false
      editStatusChange(!editStatus);
    };
    sendRequest(`/todos/update/${id}`, { text }, "put", handleSuccess);
  };

  // Event handler to capture users text input as they edit an item
  const handleEditChange = (text) => {
    editItemDetailChange({ id: editItemDetail.id, text: text });
  };

  const addItem = (text) => {
    if (!text) {
      Alert.alert(
        "No item entered",
        "Please enter an item when adding to your todo list",
        [
          {
            text: "OK",
            style: "cancel",
          },
        ],
        { cancelable: true }
      );
    } else {
      const handleSuccess = (res) => {
        setItems((prevItems) => {
          return [{ ...res.data, id: res.data._id }, ...prevItems];
        });
      };
      sendRequest(
        `/todos/add`,
        { text, completed: false },
        "post",
        handleSuccess
      );
    }
  };

  // capture old items ID and text when user clicks edit
  const editItem = (id, text) => {
    editItemDetailChange({
      id,
      text,
    });
    return editStatusChange(!editStatus);
  };

  const itemChecked = (id, value) => {
    const handleSuccess = (res) => {
      setItems((prevItems) =>
        prevItems.map((item) => {
          if (item.id === id) {
            const updatedItem = { ...item, completed: value };
            console.log(updatedItem);
            return updatedItem;
          }
          return item;
        })
      );
    };
    // const isCompleted = items.find((item) => item.id === id).completed;

    sendRequest(
      `/todos/update/${id}`,
      { completed: value },
      "put",
      handleSuccess
    );
  };

  const onLogout = () => {
    AsyncStorage.removeItem("userData");
    props.onScreenChange("login");
  };

  useEffect(() => {
    const handleSuccess = (res) => {
      setItems(
        res.data.map((item) => {
          const updatedItem = {
            ...item,
            id: item._id,
          };
          delete updatedItem["_id"];
          return updatedItem;
        })
      );
    };
    sendRequest(`/todos/fetch`, null, "get", handleSuccess);
  }, []);

  useEffect(() => {
    if (items.length) {
      setCompleted(items.filter((item) => item.completed === true));
      setNotCompleted(items.filter((item) => item.completed === false));
    }
  }, [items]);

  const activeItems = () => {
    if (activeTab === "All") return items;
    if (activeTab === "Completed") return completed;
    return notCompleted;
  };
  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "android" ? 100 : 40}
    >
      {/* <View > */}
      <Text style={styles.headerText}>Todo App</Text>
      <TouchableOpacity
        onPress={() => onLogout()}
        style={{ position: "absolute", top: 20, right: 20 }}
      >
        <Text>Logout</Text>
      </TouchableOpacity>
      <HeaderTab activeTab={activeTab} setActiveTab={setActiveTab} />
      <AddTodoItem addItem={addItem} />

      {activeItems().length ? (
        <FlatList
          style={{ flex: 1 }}
          keyExtractor={(item) => item.id}
          data={activeItems()}
          renderItem={({ item }) => (
            <TodoListItem
              item={item}
              deleteItem={deleteItem}
              editItem={editItem}
              isEditing={editStatus}
              editItemDetail={editItemDetail}
              saveEditItem={saveEditItem}
              handleEditChange={handleEditChange}
              itemChecked={itemChecked}
              checkedItems={checkedItems}
            />
          )}
        />
      ) : (
        <Text style={styles.todoText}>No Todo Found</Text>
      )}
      {/* </View> */}
    </KeyboardAvoidingView>
  );
};

export default TodoScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    marginTop: 40,
  },
  headerText: {
    fontWeight: Platform.OS === "android" ? "bold" : "900",
    fontSize: 20,
    marginVertical: 30,
  },
  todoText: {
    fontSize: 14,
  },
});
