import { StatusBar } from "expo-status-bar";
import {
  Alert,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Image,
  Text,
  View,
} from "react-native";

import { BioDataForm, BioDataFormUpload } from "@/utils/types";
import { useEffect, useMemo, useState } from "react";
import * as Device from "expo-device";
import * as ImagePicker from "expo-image-picker";
import { setupDatabase } from "@/utils/database";
import * as ScreenOrientation from 'expo-screen-orientation';
import NetInfo from "@react-native-community/netinfo";
import * as FileSystem from "expo-file-system";
import { statesData } from "@/assets/data/statesdata";
import { localGovernmentAreas } from "@/assets/data/lga";
import { bioDataSchema } from "@/utils/zodValidation";
import {
  isVoterCardUnique,
  sqlDeleteAllBioData,
  sqlDeleteDatabase,
  sqlGetBioData,
  sqlSaveBioData,
} from "@/utils/sqlServices";
import { collection, addDoc, getDoc } from "firebase/firestore";
import { db } from "@/utils/firebase";
import ModalComponent from "@/components/ModalComponent";
import Spinner from "react-native-loading-spinner-overlay";
import InputField from "@/components/inputField";
import { skillsData } from "@/assets/data/skillsData";

export default function BiodataFormScreen() {
  const [formData, setFormData] = useState<BioDataForm>({
    firstName: "",
    lastName: "",
    otherNames: "",
    dateOfBirth: "",
    stateOfOrigin: "",
    lga: "",
    ward: "",
    address: "",
    contact: "",
    passportPhoto: "",
    votersCard: "",
    nin: "",
    email: "",
    gender: "",
    selectedSkillCategory: "", 
    selectedSkill: "",
    meansOfIdentification: "",
    otherMeansOfIdentification: "",
    IdCardPhoto: "",
  });

  const [operationIsSuccess, setOperationIsSuccess] = useState<boolean>(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedLgaName, setSelectedLgaName] = useState<string>("");
  const [isConnected, setIsConnected] = useState<boolean | null>(null);

  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedSkill, setSelectedSkill] = useState("");

  const [errors, setErrors] = useState<BioDataForm>({
    firstName: "",
    lastName: "",
    otherNames: "",
    dateOfBirth: "",
    stateOfOrigin: "",
    lga: "",
    ward: "",
    address: "",
    contact: "",
    passportPhoto: "",
    votersCard: "",
    nin: "",
    email: "",
    gender: "",
    selectedSkillCategory: "", 
    selectedSkill: "",
    meansOfIdentification: "",
    otherMeansOfIdentification: "",
    IdCardPhoto: "",
  });
  const [isTablet, setIsTablet] = useState(false);


  useEffect(() => {
    setupDatabase();

    const checkDeviceType = async () => {
      //get device type
      const deviceType = await Device.getDeviceTypeAsync();
      setIsTablet(deviceType === Device.DeviceType.TABLET);
    };

    //check for network
    const unsubscribe = NetInfo.addEventListener((state) => {
      setIsConnected(state.isConnected);
    });

    //lock screen to portrait
    const lockToPortrait = async () => {
      await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT_UP);
    };

    lockToPortrait();

    checkDeviceType();
    return () => unsubscribe();
  
  }, []);



  //Get all options feilds
  const allStates = useMemo(() => statesData.map((s) => s.state.name), []);
  const lgaNames = useMemo(() => {
    return localGovernmentAreas.state.lgas.map((lga) => lga.name);
  }, []);
  const wardNames = useMemo(() => {
    return (
      localGovernmentAreas.state.lgas
        .find((lga) => lga.name === selectedLgaName)
        ?.wards.map((ward) => ward.name) || []
    );
  }, [selectedLgaName]);

  const categoryOptions = useMemo(
    () => skillsData.map(({ category }) => ({ label: category, value: category })),
    // () => skillsData.map(({ category }) => category),
    []
  );

  const skillOptions = useMemo(
    () => skillsData.find(({ category }) => category === selectedCategory)?.skills || [],
    [selectedCategory]
  );

  //   const isTablet = Device.deviceType === Device.DeviceType.TABLET;

  const handleInputChange = (field: keyof typeof formData, value: string) => {
    let processedValue = value;
    setFormData((prevData) => ({ ...prevData, [field]: processedValue }));
  };
  

  const handleUpload = async (imageType: string) => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Permission Required",
        "Camera access is required to take a photo."
      );
      return;
    }
    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.6,
      base64: true,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      const base64 = await FileSystem.readAsStringAsync(result.assets[0].uri, {
        encoding: "base64",
      });
      setFormData((prevData) => ({
        ...prevData,
        [imageType]: `data:image/jpeg;base64,${base64}`,
      }));
    }
  };

  const validateVoterCardUniqueness = async (voterCard: string): Promise<boolean> => {
    return await isVoterCardUnique(voterCard)
  }

  const validateOptions = () => {
    let isValid = true; 

    if (!wardNames.includes(formData.ward)) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        ward: "Please select a valid ward from the LGA",
      }));
      isValid = false;
    }
    if (!skillOptions.map(skill => skill.label).includes(formData.selectedSkill)) {
      console.log(skillOptions.map(skill => skill.value));
      console.log(formData.selectedSkill);
      setErrors((prevErrors) => ({
        ...prevErrors,
        selectedSkill: "Please select a valid skill for the category",
      }));
      isValid = false;
    }

    return isValid;
  }

  const handleSubmition = async (formData: BioDataForm) => {
    setLoading(true);

    setErrors(() => ({
      firstName: "",
      lastName: "",
      otherNames: "",
      dateOfBirth: "",
      stateOfOrigin: "",
      lga: "",
      ward: "",
      address: "",
      contact: "",
      passportPhoto: "",
      votersCard: "",
      nin: "",
      email: "",
      gender: "",
      selectedSkillCategory: "", 
      selectedSkill: "",
      meansOfIdentification: "",
      otherMeansOfIdentification: "",
      IdCardPhoto: "",
    }));

    try {
      const validationResult = bioDataSchema.safeParse(formData);

      const voterCardValidation = await validateVoterCardUniqueness(formData.votersCard); 

      if (!validationResult.success) {
        setErrors((prevErrors) => ({
          ...prevErrors,
          ...Object.fromEntries(
            validationResult.error.errors.map((err) => [
              err.path[0],
              err.message,
            ])
          ),
        }));

        Alert.alert("Validation Error", "Please fill all required fields");
        setLoading(false);

        return;
      }

      // // voter card validation
      if (!voterCardValidation) {
        setErrors((prevErrors) => ({
          ...prevErrors,
          votersCard: "Voter's card already exists",
        }));

        Alert.alert("Validation Error", "Please fill all required fields");
        setLoading(false);

        return;
      }

      //validate selected skill and categoy, lgas and wards and set the errors
      if (!validateOptions()){
        Alert.alert("Validation Error", "Please fill all required fields");
        setLoading(false);

        return
      }


      let isUploaded = false;

      //first validate if user is online
      if (isConnected) {
        const timeoutDuration = 8000;
        const onlineSavePromise = saveToFirebase({
          ...formData,
          isUploaded: true,
        });
        const timeoutPromise = new Promise((_, reject) =>
          setTimeout(
            () => reject(new Error("Request timed out")),
            timeoutDuration
          )
        );
  
        try {
          await Promise.race([onlineSavePromise, timeoutPromise]);
          isUploaded = true;
        } catch (error) {
          isUploaded = false;
          console.warn("Online save failed or timed out, saving locally.");
        }
      }
     
      const offlineSave = await handleSaveOffline({
        ...formData,
        isUploaded,
      });
    

      console.log(offlineSave);
      if (!offlineSave) {
        Alert.alert("Fail", "Failed to save data please try again");
        setLoading(false);
        setOperationIsSuccess(false);
      } else {
        setFormData(() => ({
          firstName: "",
          lastName: "",
          otherNames: "",
          dateOfBirth: "",
          stateOfOrigin: "",
          lga: "",
          ward: "",
          address: "",
          contact: "",
          passportPhoto: "",
          votersCard: "",
          nin: "",
          email: "",
          gender: "",
          selectedSkillCategory: "", 
          selectedSkill: "",
          meansOfIdentification: "",
          otherMeansOfIdentification: "",
          IdCardPhoto: "",
        }));
        setLoading(false);
        setOperationIsSuccess(true);
      }
      console.log(sqlGetBioData());
      setModalVisible(true);
      return;
    } catch (error) {
      console.log(error);
      setLoading(false);
      setOperationIsSuccess(false);
      setModalVisible(true);
    }
  };

  const handleSaveOffline = async (formData: BioDataFormUpload) => {
    console.log("formData");
    const maxRetries = 3;
    let attempt = 0;

    while (attempt < maxRetries) {
      try {
        await sqlSaveBioData({ ...formData });
        console.log("Data saved offline");
        return true;
      } catch (error) {
        console.error(`Attempt ${attempt + 1} failed:`, error);
        attempt++;
        if (attempt === maxRetries) return false;
      }
    }
  };

  const saveToFirebase = async (data: BioDataFormUpload, retries = 3) => {
    const collectionRef = collection(db, "BioData");
    let attempt = 0;
    while (attempt < retries) {
      try {
        const docRef = await addDoc(collectionRef, data);
        return await getDoc(docRef);
      } catch (error) {
        attempt++;
        if (attempt === retries) return null;
      }
    }
  };
  return (
    <ScrollView style={styles.container}>
      {/* image */}
      <Text style={styles.header}>Upload Data</Text>

      <View style={styles.uploadContainer}>
        <TouchableOpacity
          style={styles.uploadButton}
          onPress={() => handleUpload("passportPhoto")}
        >
          <Text style={styles.uploadText}>Click to take a photo</Text>
          <Text style={styles.uploadSubText}>
            SVG, PNG, JPG, or GIF (max. 800x400px)
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.avatarContainer}>
        {formData.passportPhoto ? (
          <Image
            source={{ uri: formData.passportPhoto }}
            style={styles.avatar}
          />
        ) : (
          <Text style={styles.avatarPlaceholder}>No photo uploaded</Text>
        )}
      </View>

      <InputField
        label="First Name"
        placeholder="Enter first name"
        value={formData.firstName}
        onChangeText={(value) => handleInputChange("firstName", value)}
        error={errors.firstName}
      />
      <InputField
        label="Last Name"
        placeholder="Enter last name"
        value={formData.lastName}
        onChangeText={(value) => handleInputChange("lastName", value)}
        error={errors.lastName}
      />
      <InputField
        label="Other Names (optional)"
        placeholder="Enter other names"
        value={formData.otherNames}
        onChangeText={(value) => handleInputChange("otherNames", value)}
        error={errors.otherNames}
      />

      <InputField
        label="State of Origin"
        placeholder="Select state of origin"
        value={formData.stateOfOrigin}
        onChangeText={(value) => handleInputChange("stateOfOrigin", value)}
        dataType="dropdown"
        style={{ marginBottom: 20 }}
        options={allStates}
        error={errors.stateOfOrigin}
      />

      <InputField
        label="Date of Birth"
        placeholder="Enter date of birth"
        value={formData.dateOfBirth}
        onChangeText={(value) => handleInputChange("dateOfBirth", value)}
        error={errors.dateOfBirth}
        dataType={"date"}
      />

      <InputField
        label="Local Government Area"
        placeholder="Enter LGA"
        value={formData.lga}
        onChangeText={(value) => {
          handleInputChange("lga", value);
          setSelectedLgaName(value);
        }}
        dataType="dropdown"
        style={{ marginBottom: 20 }}
        options={lgaNames}
        error={errors.lga}
      />

      <InputField
        label="Ward"
        placeholder="Enter ward"
        value={formData.ward}
        onChangeText={(value) => handleInputChange("ward", value)}
        dataType="dropdown"
        style={{ marginBottom: 20 }}
        options={wardNames}
        error={errors.ward}
        disabled={selectedLgaName === "" ? true : false}
      />
      <InputField
        label="Address"
        placeholder="Enter address"
        value={formData.address}
        onChangeText={(value) => handleInputChange("address", value)}
        error={errors.address}
      />

      <VotersCardInput 
        value={formData.votersCard}
        onChangeText={(value) => handleInputChange("votersCard", value)}
        error={errors.votersCard}
      />

      <InputField
        label="NIN (optional)"
        placeholder="Enter NIN"
        value={formData.nin}
        onChangeText={(value) => handleInputChange("nin", value)}
        error={errors.nin}
        dataType="number"
      />
      <InputField
        label="Email Address (optional)"
        placeholder="Enter email"
        value={formData.email}
        onChangeText={(value) => handleInputChange("email", value)}
        error={errors.email}
        dataType="email"
      />
      <InputField
        label="Phone Number"
        placeholder="Enter phone number"
        value={formData.contact}
        onChangeText={(value) => handleInputChange("contact", value)}
        error={errors.contact}
        dataType="number"
      />
      <InputField
        label="Gender"
        placeholder="Select gender"
        value={formData.gender}
        onChangeText={(value) => handleInputChange("gender", value)}
        dataType="dropdown"
        options={["Male", "Female"]}
        error={errors.gender}
      />

       {/* Select Category */}
       <InputField
        label="Select Skill Category"
        placeholder="Choose category"
        value={selectedCategory}
        onChangeText={(value) => {
          setSelectedCategory(value);
          handleInputChange("selectedSkillCategory", value);
        }}
        dataType="dropdown"
        options={categoryOptions.map((opt) => opt.label)}
        style={{ marginBottom: 20 }}
        error={errors.selectedSkillCategory}
      />

      <InputField
        label="Select Specific Skill"
        placeholder="Choose skill"
        value={selectedSkill}
        onChangeText={(value) => {
          setSelectedSkill(value);
          handleInputChange("selectedSkill", value);
        }}
        dataType="dropdown"
        options={skillOptions.map((opt) => opt.label)}
        style={{ marginBottom: 20 }}
        disabled={selectedCategory === "" ? true : false}
        error={errors.selectedSkill}
      />


      <InputField
        label="Means of Identification"
        placeholder="Enter means of identification"
        value={formData.meansOfIdentification}
        onChangeText={(value) =>
          handleInputChange("meansOfIdentification", value)
        }
        dataType="dropdown"
        style={{ marginBottom: 20 }}
        options={[
          "National ID (NIN)",
          "Driver's License",
          "International Passport",
          "Voter's Card",
          "Others",
        ]}
        error={errors.meansOfIdentification}
      />
      
      {/* Other means of identification */}
      {
        formData.meansOfIdentification === "Others" && (
          <InputField
            label="Specify Other Means of Identification"
            placeholder="Enter other means of identification"
            value={formData.otherMeansOfIdentification}
            onChangeText={(value) =>
              handleInputChange("otherMeansOfIdentification", value)
            }
            error={errors.otherMeansOfIdentification}
          />
        )
      }
     
      {/* Id image */}

      <View style={styles.uploadContainer}>
        <Text style={styles.header}>Identity card</Text>
        <TouchableOpacity
          style={styles.uploadButton}
          onPress={() => handleUpload("IdCardPhoto")}
        >
          <Text style={styles.uploadText}>Click to take a photo</Text>
          <Text style={styles.uploadSubText}>
            SVG, PNG, JPG, or GIF (max. 800x400px)
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.avatarContainer}>
        {formData.IdCardPhoto ? (
          <Image
            source={{ uri: formData.IdCardPhoto }}
            style={styles.avatarIdentificationCard}
          />
        ) : (
          <Text style={styles.avatarPlaceholder}>No photo uploaded</Text>
        )}
      </View>

      <TouchableOpacity
        style={styles.nextButton}
        onPress={() => handleSubmition(formData)}
      >
        <Text style={styles.nextButtonText}>Next</Text>
      </TouchableOpacity>

      <Spinner
        visible={loading}
        // textContent={"Loading..."}
        textStyle={{ color: "#fff" }}
        overlayColor="rgba(0, 0, 0, 0.5)"
      />
      <ModalComponent
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        success={operationIsSuccess}
      />
    </ScrollView>
  );
}
// import { StyleSheet } from "react-native";
// import * as Device from "expo-device";
import { Skill } from './../assets/data/skillsData';
import VotersCardInput from "@/components/VotersCardInput ";

const isTablet = Device.deviceType === Device.DeviceType.TABLET;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
    alignSelf: "center",
    width: "100%", 
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  uploadContainer: {
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    padding: 15,
    width: "100%", 
  },
  uploadButton: {
    alignItems: "center",
  },
  uploadText: {
    fontSize: 16,
    color: "#28a745",
    textAlign: "center",
    marginBottom: 5,
  },
  uploadSubText: {
    fontSize: 12,
    color: "#666",
    textAlign: "center",
  },
  avatarContainer: {
    alignItems: "center",
    marginVertical: 20,
    width: "100%",
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 2,
    borderColor: "#ccc",
  },
  avatarIdentificationCard: {
    width: "100%",
    height: 150,
    borderWidth: 6,
    borderColor: "#ccc",
    marginVertical: 10, 
  },
  avatarPlaceholder: {
    color: "#999",
    fontSize: 14,
  },
  formRow: {
    flexDirection: isTablet ? "row" : "column",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  inputFull: {
    width: "100%",
    marginBottom: 15,
  },
  inputThird: {
    width: isTablet ? "32%" : "100%",
    marginBottom: 15,
  },
  inputHalf: {
    width: isTablet ? "48%" : "100%",
    marginBottom: 15,
  },
  nextButton: {
    backgroundColor: "#28a745",
    borderRadius: 10,
    paddingVertical: 15,
    alignItems: "center",
    marginBottom: isTablet ? 40 : 80, 
  },
  nextButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
});