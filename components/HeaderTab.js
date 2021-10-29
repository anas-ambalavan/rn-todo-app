import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Colors from "../constants/Colors";

const HeaderTab = (props) => {
  return (
    <View style={styles.headerContainer}>
      <HeaderButton
        text="All"
        btnColor={Colors.primary}
        textColor={Colors.accent}
        activeTab={props.activeTab}
        setActiveTab={props.setActiveTab}
      />
      <HeaderButton
        text="Completed"
        btnColor={Colors.accent}
        textColor={Colors.primary}
        activeTab={props.activeTab}
        setActiveTab={props.setActiveTab}
      />
      <HeaderButton
        text="Not Completed"
        btnColor={Colors.accent}
        textColor={Colors.primary}
        activeTab={props.activeTab}
        setActiveTab={props.setActiveTab}
      />
    </View>
  );
};

const HeaderButton = (props) => (
  <TouchableOpacity
    style={{
      backgroundColor:
        props.activeTab === props.text ? Colors.primary : Colors.accent,
      paddingVertical: 6,
      paddingHorizontal: 16,
      borderRadius: 30,
    }}
    onPress={() => {
      props.setActiveTab(props.text);
    }}
  >
    <Text
      style={{
        color: props.activeTab === props.text ? Colors.accent : Colors.primary,
        fontSize: 15,
        fontWeight: "900",
      }}
    >
      {props.text}
    </Text>
  </TouchableOpacity>
);

export default HeaderTab;

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: "row",
    alignSelf: "center",
  },
});
