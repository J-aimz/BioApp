import { BioDataForm } from "./types";
import AsyncStorage from "@react-native-async-storage/async-storage";

const STORAGE_KEY_TWO = "form_data_list_two";

export async function getFromLocalStorage(): Promise<BioDataForm[]> {
  try {
    const data = await AsyncStorage.getItem(STORAGE_KEY_TWO);
    
    // Log only if crashlytics is available
    console.log("Success getting data from local storage with data: " + data);
    
    return data ? JSON.parse(data) : [];
  } catch (err) {
    console.error(err);
    
    return [];
  }
}

export async function saveToLocalStorage(value: BioDataForm): Promise<boolean> {
  try {
    const existingData = await getFromLocalStorage();
    const updatedData = [...existingData, value];
    await AsyncStorage.setItem(STORAGE_KEY_TWO, JSON.stringify(updatedData));
    
    console.log("Success saving data to local storage with data: " + JSON.stringify(value));
    
    return true;
  } catch (err) {
    console.error(err);
    return false;
  }
}
