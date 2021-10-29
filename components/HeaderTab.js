import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

import Colors from "../constants/Colors";
import ButtonCmp from "./UI/ButtonCmp";

const HeaderTab = (props) => {
  return (
    <View style={styles.headerContainer}>
      <ButtonCmp
        text="All"
        btnColor={Colors.primary}
        textColor={Colors.accent}
        activeTab={props.activeTab}
        setActiveTab={props.setActiveTab}
      />
      <ButtonCmp
        text="Completed"
        btnColor={Colors.accent}
        textColor={Colors.primary}
        activeTab={props.activeTab}
        setActiveTab={props.setActiveTab}
      />
      <ButtonCmp
        text="Not Completed"
        btnColor={Colors.accent}
        textColor={Colors.primary}
        activeTab={props.activeTab}
        setActiveTab={props.setActiveTab}
      />
    </View>
  );
};

export default HeaderTab;

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: "row",
    alignSelf: "center",
  },
});
