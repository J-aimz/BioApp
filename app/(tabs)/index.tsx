import { StyleSheet, Image, TouchableOpacity, View, Text } from 'react-native';

import { Link, useRouter } from 'expo-router';

export default function TabOneScreen() {

  const router = useRouter();

  return (
    <View style={styles.container}>
    <Image
      source={require("../../assets/img/upload_img.png")}
      style={styles.icon}
    />
    <Text style={styles.description}>
      Click the button below to upload data
    </Text>
    <Link href="/biodataForm" asChild>
      <TouchableOpacity style={styles.uploadButton}>
        <Text style={styles.uploadButtonText}>Upload Data</Text>
      </TouchableOpacity>
    </Link>
  </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
  },
  icon: {
    width: 100,
    height: 100,
    marginBottom: 20,
  },
  description: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 20,
  },
  uploadButton: {
    backgroundColor: "#048324",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  uploadButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
