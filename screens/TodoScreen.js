import React, { useEffect, useState } from "react";
import {
  FlatList,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  Alert,
} from "react-native";
import AddTodoItem from "../components/AddTodoItem";
import HeaderTab from "../components/HeaderTab";
import TodoListItem from "../components/TodoListItem";

import useHttp from "../hooks/useHttp";

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

  const { sendRequest } = useHttp();

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

  const itemChecked = (id) => {
    const handleSuccess = (res) => {
      setItems((prevItems) =>
        prevItems.map((item) => {
          if (item.id === id) {
            const updatedItem = { ...item, completed: !item.completed };
            return updatedItem;
          }
          return item;
        })
      );
    };
    const isCompleted = items.find((item) => item.id === id).completed;
    sendRequest(
      `/todos/update/${id}`,
      { completed: !isCompleted },
      "put",
      handleSuccess
    );
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
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      <View style={styles.container}>
        <Text style={styles.headerText}>Todo App</Text>
        <HeaderTab activeTab={activeTab} setActiveTab={setActiveTab} />
        <AddTodoItem addItem={addItem} />

        {activeItems().length ? (
          <FlatList
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
      </View>
    </SafeAreaView>
  );
};

export default TodoScreen;

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    marginTop: 40,
  },
  headerText: {
    fontWeight: "900",
    fontSize: 20,
    marginVertical: 30,
  },
  todoText: {
    fontSize: 14,
  },
});
