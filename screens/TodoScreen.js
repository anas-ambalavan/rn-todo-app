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

import axios from "../axios/";
import useHttp from "../hooks/useHttp";

const TodoScreen = (props) => {
  const [activeTab, setActiveTab] = useState("All");

  const [items, setItems] = useState([]);
  // const [filteredItems, setFilteredItems] = useState(items);
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

  const { sendRequest } = useHttp(props.getToken);

  const deleteItem = (id) => {
    const handleSuccess = () => {
      setItems((prevItems) => {
        return prevItems.filter((item) => item.id !== id);
      });
    };
    sendRequest(`/todos/delete/${id}`, null, "delete", handleSuccess);
    // props.getToken().then((token) => {
    //   axios
    //     .delete(
    //       `/todos/delete/${id}`,

    //       { token }
    //     )
    //     .then((res) => {
    //       // console.log(res);
    //       setItems((prevItems) => {
    //         return prevItems.filter((item) => item.id !== id);
    //       });
    //     })
    //     .catch((err) => {
    //       Alert.alert(
    //         "An error occured",
    //         err.response.data.message || err.message,
    //         [{ text: "Okay" }]
    //       );
    //     });
    // });
  };

  // Submit the users edits to the overall items state
  const saveEditItem = (id, text) => {
    console.log(text);
    const handleSuccess = () => {
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
    // props.getToken().then((token) => {
    //   axios
    //     .put(
    //       `/todos/update/${id}`,
    //       {
    //         text,
    //       },
    //       { token }
    //     )
    //     .then((res) => {
    //       // console.log(res);
    //       setItems((prevItems) => {
    //         return prevItems.map((item) =>
    //           item.id === editItemDetail.id
    //             ? { ...item, text: editItemDetail.text }
    //             : item
    //         );
    //       });
    //       // Flip edit status back to false
    //       editStatusChange(!editStatus);
    //     })
    //     .catch((err) => {
    //       Alert.alert(
    //         "An error occured",
    //         err.response.data.message || err.message,
    //         [{ text: "Okay" }]
    //       );
    //     });
    // });
  };

  // Event handler to capture users text input as they edit an item
  const handleEditChange = (text) => {
    // console.log(text);
    editItemDetailChange({ id: editItemDetail.id, text: text });
  };

  // console.log(props.getToken());

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
      props.getToken().then((token) => {
        axios
          .post(
            "/todos/add",
            {
              text,
              completed: false,
            },
            { token }
          )
          .then((res) => {
            console.log(res);
            setItems((prevItems) => {
              return [{ ...res.data, id: res.data._id }, ...prevItems];
            });
          })
          .catch((err) => {
            Alert.alert(
              "An error occured",
              err.response.data.message || err.message,
              [{ text: "Okay" }]
            );
          });
      });
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
    props.getToken().then((token) => {
      const isCompleted = items.find((item) => item.id === id).completed;
      axios
        .put(
          `/todos/update/${id}`,
          {
            completed: !isCompleted,
          },
          { token }
        )
        .then((res) => {
          // console.log(res);
          setItems((prevItems) =>
            prevItems.map((item) => {
              if (item.id === id) {
                const updatedItem = { ...item, completed: !item.completed };
                return updatedItem;
              }
              return item;
            })
          );
        })
        .catch((err) => {
          Alert.alert(
            "An error occured",
            err.response.data.message || err.message,
            [{ text: "Okay" }]
          );
        });
    });
  };

  useEffect(() => {
    // setItems([
    //   {
    //     id: 1,
    //     text: "Milk",
    //     completed: false,
    //   },
    //   {
    //     id: 2,
    //     text: "Eggs",
    //     completed: false,
    //   },
    //   {
    //     id: 3,
    //     text: "Bread",
    //     completed: false,
    //   },
    //   {
    //     id: 4,
    //     text: "Juice",
    //     completed: false,
    //   },
    // ]);
    props.getToken().then((token) => {
      axios
        .get("/todos/fetch", { token })
        .then((res) => {
          console.log(res.data);
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
        })
        .catch((err) => {
          Alert.alert(
            "An error occured",
            err.response.data.message || err.message,
            [{ text: "Okay" }]
          );
        });
    });
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
        <HeaderTab
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          // setFilter={setFilter}
        />
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
    // flex: 1,
    // backgroundColor: "#fff",
    alignItems: "center",
    marginTop: 40,
    // justifyContent: "center",
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
