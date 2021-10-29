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

const TodoScreen = () => {
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

  const deleteItem = (id) => {
    console.log(id);
    setItems((prevItems) => {
      return prevItems.filter((item) => item.id !== id);
    });
  };

  // Submit the users edits to the overall items state
  const saveEditItem = (id, text) => {
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
      setItems((prevItems) => {
        return [
          { id: Math.random().toLocaleString(), text: text },
          ...prevItems,
        ];
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
    setItems((prevItems) =>
      prevItems.map((item) => {
        if (item.id === id) {
          const updatedItem = { ...item, completed: !item.completed };
          return updatedItem;
        }
        return item;
      })
    );

    // const isChecked = checkedItems.filter(
    //   (checkedItem) => checkedItem.id === id
    // );
    // isChecked.length
    //   ? // remove item from checked items state (uncheck)
    //     checkedItemChange((prevItems) => {
    //       return [...prevItems.filter((item) => item.id !== id)];
    //     })
    //   : // Add item to checked items state
    //     checkedItemChange((prevItems) => {
    //       return [
    //         ...prevItems.filter((item) => item.id !== id),
    //         { id, text, completed: true },
    //       ];
    //     });
  };

  // const completed = () => {
  //   // console.log(checkedItems[]);
  //   const isChecked = checkedItems.filter(
  //     (checkedItem) => checkedItem.id === id
  //   );
  //   console.log(isChecked.length);
  //   setFilteredItems(() =>
  //     items.filter((item) => item.id === checkedItems[0]?.id)
  //   );
  // };

  // const notCompleted = () => {
  //   setFilteredItems(() => items.filter((item) => item.id !== checkedItems.id));
  // };
  // const allTodos = () => {
  //   setFilteredItems(items);
  // };

  // const setFilter = (filter) => {
  //   // setFilteredItems((prevItems) => [
  //   //   ...prevItems.filter((item) => item.id === items.id),
  //   // ]);
  //   // console.log(filteredItems.filter((item) => item.completed === true));
  //   // if (filter === "completed") {
  //   //   setCompleted((prevItems) =>
  //   //     prevItems.filter((item) => item.completed === true)
  //   //   );
  //   //   console.log("complete");
  //   // } else if (filter === "not") {
  //   //   setFilteredItems(
  //   //     filter((item) => item.completed === false),
  //   //     console.log("nocomplete")
  //   //   );
  //   // } else if (filter === "all") {
  //   //   setFilteredItems(items);
  //   // }
  //   // console.log(filter);
  // };

  useEffect(() => {
    setItems([
      {
        id: 1,
        text: "Milk",
        completed: false,
      },
      {
        id: 2,
        text: "Eggs",
        completed: false,
      },
      {
        id: 3,
        text: "Bread",
        completed: false,
      },
      {
        id: 4,
        text: "Juice",
        completed: false,
      },
    ]);
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
            // keyExtractor={(item) => item.id.toString()}
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
