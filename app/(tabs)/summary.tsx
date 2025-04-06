import { StyleSheet, Image, TouchableOpacity, View, Text, Alert, Touchable, ScrollView, FlatList } from 'react-native';
import { useEffect, useState } from 'react';
import { sqlDeleteAllBioData, sqlGetBioData, sqlGetBioDataCount, sqlGetUnuploadedBioData } from '@/utils/sqlServices';
import { collection, addDoc, writeBatch, doc, setDoc } from 'firebase/firestore';
import { db } from '@/utils/firebase';
import Spinner from 'react-native-loading-spinner-overlay';
import ModalComponent from '@/components/ModalComponent';
import NetInfo from "@react-native-community/netinfo";
import { BioDataFormUpload } from '@/utils/types';
import { setupDatabase } from '@/utils/database';


export default function Summary() {
  const [totalCount, setTotalCount] = useState(0);
  const date = new Date();
  const [isLoading, setIsLoading] = useState(false);
  const [operationIsSuccess, setOperationIsSuccess] = useState<boolean>(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [isConnected, setIsConnected] = useState<boolean | null>(null);
  const [showList, setShowList] = useState(false); 
  const [dataList, setDataList] = useState<BioDataFormUpload[]>([]); 

  useEffect(() => {

    //check for network
    const unsubscribe = NetInfo.addEventListener((state) => {
      setIsConnected(state.isConnected);
    });

    // const loadData = async () => {
    //   try {
    //     // const db = getDatabase(); // ✅ Now safe
    //     // const result = await getAllAsync(`SELECT * FROM BioData`);
    //     const result = await sqlGetBioData();
    //     setTotalCount(result.length);
    //   } catch (error) {
    //     console.error("Failed to load data:", error);
    //   }
    // };

    // loadData();

    datalist()

    // fetchData();
    return () => unsubscribe();
  }, []);

  //get the biodata from the local database to be displayed
  const datalist = async () => {
    const data = await sqlGetBioData();
    setTotalCount(data.length);
    setDataList(data);
  }
  // const fetchData = async () => {
  //   setTotalCount(await sqlGetBioDataCount());
  // };

  const formatDate = (date: Date) => {
    const options: Intl.DateTimeFormatOptions = {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    };
    return date.toLocaleDateString(undefined, options);
  };

  // const uploadBioDataToFirebase = async () => {
    
  //   if (!isConnected) {
  //     setIsLoading(false)
  //     Alert.alert('No Internet Connection', 'Please check your network connection and try again later.');
  //     return;
  //   }

  //   try {
  //     const bioDataRecords = await sqlGetUnuploadedBioData()

  //     if (bioDataRecords.length === 0) {
  //       const deleteSuccess = await sqlDeleteAllBioData();
  //       if (deleteSuccess) {
  //         console.log('Local database cleared after upload.');
  //         await datalist()
  //         setOperationIsSuccess(true)
  //         setIsLoading(false)
  //       } else {
  //         console.warn('Failed to clear local database.');
  //         setOperationIsSuccess(false) 
  //         setIsLoading(false)
  //         return
  //       }
  //       setModalVisible(true);
  //       return;
  //     }

  //     let batch = writeBatch(db);
  //     const collectionRef = collection(db, 'BioData');
  //     let batchCount = 0;

  //     for (const record of bioDataRecords) {
  //       const docRef = doc(collectionRef); 
  //       batch.set(docRef, record);
  
  //       batchCount++;
  
  //       if (batchCount === 500) {
  //         await batch.commit();
  //         batch = writeBatch(db); 
  //         batchCount = 0;
  //       }
  //     }

  //     if (batchCount > 0) {
  //       await batch.commit();
  //     }

  //     const deleteSuccess = await sqlDeleteAllBioData();
  //     console.log('Data uploaded successfully to Firebase!: ', deleteSuccess);
  //     if (deleteSuccess) {
  //       console.log('Local database cleared after upload.');
  //       await datalist()
  //       setOperationIsSuccess(true)
  //     } else {
  //       console.warn('Failed to clear local database.');
  //       setOperationIsSuccess(false) 
  //     }
  //   } catch (error) {
  //     console.error('Error uploading data:', error);
  //     setOperationIsSuccess(false)
  //   }

  //   setIsLoading(false)
  //   setModalVisible(true);

  // };

  const uploadBioDataToFirebase = async () => {
      setIsLoading(true)

    if (!isConnected) {
      setIsLoading(false);
      Alert.alert('No Internet Connection', 'Please check your network connection and try again later.');
      return;
    }
  
    try {
      const bioDataRecords = await sqlGetUnuploadedBioData();
      // const bioDataRecords = await sqlGetBioData();
  
      if (bioDataRecords.length === 0) {
        const deleteSuccess = await sqlDeleteAllBioData();
        if (deleteSuccess) {
          console.log('Local database cleared after upload.');
          await datalist();
          setOperationIsSuccess(true);
          setIsLoading(false);
        } else {
          console.warn('Failed to clear local database.');
          setOperationIsSuccess(false);
          setIsLoading(false);
          return;
        }
        setModalVisible(true);
        return;
      }
  
      const collectionRef = collection(db, 'BioData');
  
      for (const record of bioDataRecords) {
        // if (record.isUploaded === true || record.isUploaded == 1) {
          // Skip the record if it has already been uploaded
          // console.log('Record already uploaded:', record);
        // }else{
          const docRef = doc(collectionRef);
          await setDoc(docRef, record); // Upload one record at a time
        // }
      }
  
      // After uploading all records, delete the local data
      const deleteSuccess = await sqlDeleteAllBioData();
      console.log('Data uploaded successfully to Firebase!');
      if (deleteSuccess) {
        console.log('Local database cleared after upload.');
        await datalist();
        setOperationIsSuccess(true);
      } else {
        console.warn('Failed to clear local database.');
        setOperationIsSuccess(false);
      }
    } catch (error) {
      console.error('Error uploading data:', error);
      setOperationIsSuccess(false);
    }
  
    setIsLoading(false);
    setModalVisible(true);
  };
  

  const confirmUpload = () => {
    Alert.alert(
      'Confirm Upload',
      'Are you sure you want to upload all offline data?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Yes', onPress: uploadBioDataToFirebase }
      ]
    );
  };

  return (
    <View style={styles.container}>
      {/* Summary */}
      <View style={styles.summarySection}>
        <TouchableOpacity onPress={() => setShowList(!showList)} activeOpacity={0.4}>
          <View style={styles.row}>
            <Image
              source={require("../../assets/img/upload_img.png")}
              style={styles.icon}
            />
            <View style={styles.info}>
              <Text style={styles.label}>Total upload</Text>
              <Text style={styles.count}>{totalCount}</Text>
            </View>
            <Text style={styles.date}>{formatDate(date)}</Text>
          </View>
        </TouchableOpacity>


        {/* <ScrollView style={styles.containerScroll}> */}
          {
            showList &&
            <FlatList
              data={dataList}
              keyExtractor={(item, ind) => ind.toString()}
              renderItem={({ item }) => (
                <View style={styles.secondRow}>
                  <Image
                    source={{ uri: item.passportPhoto }}
                    style={styles.avatar}
                  />
                  <View style={styles.info}>
                    <Text style={styles.label}>Name</Text>
                    <Text style={styles.count}>{item.firstName + " " + item.lastName}</Text>
                  </View>
                  <Text style={styles.date}>{item.gender}</Text>
                </View>
              )}
            />
          }
          
      </View>

      {/* Footer */}
      <TouchableOpacity style={[styles.button, totalCount === 0 && styles.disabledButton]} onPress={confirmUpload} disabled={totalCount === 0}>
        <Text style={[styles.buttonText, totalCount === 0 && styles.disabledText]} >Upload offline data</Text>
      </TouchableOpacity>




      <Spinner
        visible={isLoading}
        // textContent={"Loading..."}
        textStyle={{ color: "#fff" }}
        overlayColor="rgba(0, 0, 0, 0.5)"
      />
      <ModalComponent
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        success={operationIsSuccess}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 50,
    borderWidth: 2,
    borderColor: "#ccc",
  },
  containerScroll: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
    alignSelf: "center",
    width: "100%",
    marginTop: 4, 
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 16,
  },
  summarySection: {
    marginTop: 50,
    flex: 1,
  },
  disabledButton: {
    backgroundColor: '#ccc', // Change to gray when disabled
  },
  disabledText: {
    color: '#888', // Dim the text when disabled
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  icon: {
    width: 40,
    height: 40,
    marginRight: 12,
  },
  info: {
    flex: 1,
  },
  secondRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    gap: 6
  },
  label: {
    fontSize: 14,
    color: '#666',
  },
  count: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
  },
  date: {
    fontSize: 14,
    color: '#999',
  },
  button: {
    backgroundColor: '#4caf50',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '700',
  },
});
