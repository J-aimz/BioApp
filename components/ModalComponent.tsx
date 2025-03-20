import React from "react";
import {
  Modal,
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { ModalComponentProps } from "../utils/types";


export default function ModalComponent({
  visible,
  onClose,
  success = true,
}: ModalComponentProps) {
  const navigation = useNavigation<any>();

  const handleSuccessClose = () => {
    onClose(); 
    navigation.navigate("(tabs)");
  };

  const handleErrorClose = () => {
    onClose(); 
    // navigation.navigate("biodataForm"); 
  };


  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.content}>
          <Image
            source={
              success
                ? require("../assets/img/success_save.png") // Success Image
                : require("../assets/img/error_save.png")
            }
            style={styles.image}
          />
          {success ? (
            <>
              <Text style={styles.title}>Upload successfully</Text>
              <Text style={styles.subtitle}>Data upload submitted!</Text>
            </>
          ) : (
            <>
              <Text style={styles.title}>Upload error</Text>
              <Text style={styles.subtitle}>Please try again!</Text>
            </>
          )}
          <TouchableOpacity style={success? styles.buttonSuccess : styles.buttonFailed} onPress={ success? handleSuccessClose : handleErrorClose}>
            <Text style={styles.buttonText}>Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  content: {
    width: "90%",
    maxWidth: 350,
    backgroundColor: "white",
    borderRadius: 10,
    padding: 20,
    alignItems: "center",
  },
  image: {
    width: 80,
    height: 80,
    marginBottom: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#383838",
    marginBottom: 10,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 14,
    color: "#5E5E5E",
    textAlign: "center",
    marginBottom: 20,
  },
  buttonSuccess: {
    width: "100%",
    backgroundColor: "#139645",
    paddingVertical: 12,
    borderRadius: 5,
    alignItems: "center",
  },
  buttonFailed: {
    width: "100%",
    backgroundColor: "#D9534F",
    paddingVertical: 12,
    borderRadius: 5,
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
});
