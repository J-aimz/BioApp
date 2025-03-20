import React, { useState, useMemo, useCallback } from "react";
import {
  TextInput,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Modal,
  KeyboardTypeOptions,
  Platform,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Ionicons } from "@expo/vector-icons";
import AntDesign from "@expo/vector-icons/AntDesign";

type InputFieldProps = {
  label?: string;
  placeholder?: string;
  value?: string;
  onChangeText?: (text: string) => void;
  dataType?: "text" | "number" | "email" | "date" | "dropdown";
  options?: string[];
  style?: object;
  secureTextEntry?: boolean;
  error?: string;
  disabled?: boolean;
};

const InputField: React.FC<InputFieldProps> = ({
  label,
  placeholder = "",
  value = "",
  onChangeText = () => {},
  dataType = "text",
  options = [],
  style,
  secureTextEntry = false,
  error,
  disabled = false,
}) => {
  const [isDatePickerVisible, setDatePickerVisible] = useState(false);
  const [isDropdownVisible, setDropdownVisible] = useState(false);
  const [filterText, setFilterText] = useState("");

  const keyboardType: KeyboardTypeOptions = useMemo(() => {
    switch (dataType) {
      case "number":
        return "numeric";
      case "email":
        return "email-address";
      default:
        return "default";
    }
  }, [dataType]);

  const filteredOptions = useMemo(
    () =>
      options.filter((opt) =>
        opt.toLowerCase().includes(filterText.trim().toLowerCase())
      ),
    [options, filterText]
  );

  const handleDateChange = useCallback(
    (event: any, selectedDate?: Date) => {
      setDatePickerVisible(false);
      if (selectedDate) {
        const formattedDate = selectedDate.toISOString().split("T")[0];
        onChangeText(formattedDate);
      }
    },
    [onChangeText]
  );

  const handleDropdownSelect = useCallback(
    (item: string) => {
      onChangeText(item);
      setDropdownVisible(false);
    },
    [onChangeText]
  );

  const handleTextChange = useCallback(
    (text: string) => {
      let processedText = text;
      if (dataType === "text" ) {
        if (label === "Address"){
          processedText = text;
        } 
        // else if (label === "votersCard"){
        //   processedText = text.replace(/-/g, ""); 
        //   processedText = processedText.match(/.{1,4}/g)?.join("-") || ""; 
        // }
        // else {
        //   processedText = text.replace(/[^a-zA-Z ]/g, ""); 
        // }
      } 
      else if (dataType === "number") {
        processedText = text.replace(/[^0-9]/g, "");
      }
      onChangeText(processedText);
    },
    [dataType, label, onChangeText] 
  );


  return (
    <View style={[styles.container, style]}>
      {label && <Text style={styles.label}>{label}</Text>}

      <TouchableOpacity
        style={[
          styles.inputContainer,
          error && styles.inputError,
          disabled && styles.disabledInput,
        ]}
        onPress={() => {
          if (!disabled) {
            if (dataType === "date") setDatePickerVisible(true);
            if (dataType === "dropdown") setDropdownVisible(true);
          }
        }}
        activeOpacity={0.7}
      >
        <TextInput
          style={[styles.input, disabled && styles.disabledText]}
          placeholder={placeholder}
          value={value}
          onChangeText={
            dataType === "dropdown"
              ? setFilterText
              : handleTextChange
          }
          keyboardType={keyboardType}
          secureTextEntry={secureTextEntry}
          editable={!disabled && dataType !== "date" && dataType !== "dropdown"}
          accessibilityLabel={label}
        />

        {/* Icons */}
        {dataType === "date" && (
          <Ionicons
            name="calendar-outline"
            size={18}
            color={disabled ? "#aaa" : "black"}
          />
        )}
        {dataType === "dropdown" && (
          <AntDesign
            name="down"
            size={18}
            color={disabled ? "#aaa" : "black"}
            onPress={() => !disabled && setDropdownVisible(true)}
          />
        )}
      </TouchableOpacity>

      {/* Error Message */}
      {error && <Text style={styles.errorText}>{error}</Text>}

      {/* Date Picker */}
      {dataType === "date" && isDatePickerVisible && (
        <DateTimePicker
          value={value ? new Date(value) : new Date()}
          mode="date"
          display={Platform.OS === "ios" ? "spinner" : "default"}
          onChange={handleDateChange}
        />
      )}

      {/* Dropdown Modal */}
      {dataType === "dropdown" && isDropdownVisible && (
        <Modal
          visible={isDropdownVisible}
          animationType="slide"
          transparent
          onRequestClose={() => setDropdownVisible(false)}
        >
          <View style={styles.dropdownContainer}>
            {/* <TextInput
              style={styles.dropdownSearch}
              placeholder="Search..."
              value={filterText}
              onChangeText={setFilterText}
              accessibilityLabel="Dropdown search"
            /> */}
            {filteredOptions.length > 0 ? (
              <FlatList
                data={filteredOptions}
                keyExtractor={(item, index) => `${item}-${index}`}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={styles.dropdownItem}
                    onPress={() => handleDropdownSelect(item)}
                  >
                    <Text>{item}</Text>
                  </TouchableOpacity>
                )}
                initialNumToRender={10}
                getItemLayout={(data, index) => ({
                  length: 50,
                  offset: 50 * index,
                  index,
                })}
              />
            ) : (
              <Text style={styles.noResultsText}>No results found</Text>
            )}
          </View>
        </Modal>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { marginBottom: 15 },
  label: { fontSize: 14, color: "#666", marginBottom: 5 },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    paddingHorizontal: 10,
  },
  input: { flex: 1, paddingVertical: 10, fontSize: 16 },
  inputError: { borderColor: "red" },
  errorText: { color: "red", fontSize: 12, marginTop: 5 },
  disabledInput: { backgroundColor: "#f0f0f0", borderColor: "#f5f5f5" },
  disabledText: { color: "#aaa" },
  dropdownContainer: {
    flex: 1,
    backgroundColor: "#fff",
    marginTop: "50%",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
  },
  dropdownSearch: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    paddingHorizontal: 10,
    marginBottom: 10,
    fontSize: 16,
  },
  dropdownItem: {
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  noResultsText: {
    textAlign: "center",
    color: "#666",
    marginTop: 20,
  },
});

export default InputField;
