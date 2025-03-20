import { View, Text, Image, StyleSheet } from "react-native";
import { Tabs } from "expo-router";

export default function CustomHeader({showText = true}) {
  return (
    <View style={styles.header}>
      <Image
        // source={require("../../assets/img/upload_img.png")}
        source={require("../assets/img/logo.png")}
        style={styles.logo}
      />
      {
        showText && (
          <Text style={styles.title}>
            Kogi State Citizen Empowerment Scheme Data Collection
          </Text>
        )
      }
     
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderColor: "#ccc",
  },
  logo: {
    width: 40,
    height: 40,
    marginRight: 10,
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
    flexShrink: 1,
  },
});