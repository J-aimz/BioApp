import React, { useState, useEffect } from "react";
import { TextInput, View, Text, StyleSheet } from "react-native";

interface VotersCardInputProps {
  value: string;
  onChangeText: (value: string) => void;
  error?: string;
  placeholder?: string;
}

const VotersCardInput: React.FC<VotersCardInputProps> = ({ value, onChangeText, error, placeholder }) => {
  const [cursorPosition, setCursorPosition] = useState(0);

  const handleTextChange = (text: string) => {
    let processedText = text.replace(/[^a-zA-Z0-9]/g, "").toUpperCase();
    processedText = processedText.match(/.{1,4}/g)?.join("-") || "";

    onChangeText(processedText);
    setCursorPosition(processedText.length);
  };

  useEffect(() => {
    setCursorPosition(value.length);
  }, [value]);

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Voter's Card Number</Text>
      <TextInput
        style={[styles.input, error ? styles.inputError : null]}
        placeholder={placeholder || "Enter voter's card number"}
        value={value}
        onChangeText={handleTextChange}
        keyboardType="default" // FIXED: Allows text and numbers
        autoCorrect={false} 
        autoCapitalize="characters"
        maxLength={24} 
        onSelectionChange={(event) => setCursorPosition(event.nativeEvent.selection.start)}
        selection={{ start: cursorPosition, end: cursorPosition }} 
      />
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { marginBottom: 15 },
  label: { fontSize: 14, color: "#666", marginBottom: 5 },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    padding: 10,
    fontSize: 16,
  },
  inputError: { borderColor: "red" },
  errorText: { color: "red", fontSize: 12, marginTop: 5 },
});

export default VotersCardInput;
