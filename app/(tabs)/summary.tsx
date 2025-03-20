import { StyleSheet, Image, TouchableOpacity, View, Text, Alert } from 'react-native';
import { useEffect, useState } from 'react';
import { sqlDeleteAllBioData, sqlGetBioData, sqlGetBioDataCount, sqlGetUnuploadedBioData } from '@/utils/sqlServices';
import { collection, addDoc, writeBatch, doc } from 'firebase/firestore';
import { db } from '@/utils/firebase';
import Spinner from 'react-native-loading-spinner-overlay';
import ModalComponent from '@/components/ModalComponent';
import NetInfo from "@react-native-community/netinfo";


export default function TabTwoScreen() {
  const [totalCount, setTotalCount] = useState(0);
  const date = new Date();
  const [isLoading, setIsLoading] = useState(false);
  const [operationIsSuccess, setOperationIsSuccess] = useState<boolean>(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [isConnected, setIsConnected] = useState<boolean | null>(null);


  useEffect(() => {
    const fetchData = async () => {
      setTotalCount(await sqlGetBioDataCount());
    };

    //check for network
    const unsubscribe = NetInfo.addEventListener((state) => {
      setIsConnected(state.isConnected);
    });


    fetchData();
    return () => unsubscribe();
  }, []);

  // useEffect(() => {
  //   const fetchData = async () => {
  //     const count = await sqlGetBioDataCount();
  //     console.log("Setting totalCount:", count); 
  //     setTotalCount(count);
  //   };
  
  //   fetchData();
  // }, []);
  

  const formatDate = (date: Date) => {
    const options: Intl.DateTimeFormatOptions = {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    };
    return date.toLocaleDateString(undefined, options);
  };

  const uploadBioDataToFirebase = async () => {
    setIsLoading(true)
    
    if (!isConnected) {
      setIsLoading(false)
      Alert.alert('No Internet Connection', 'Please check your network connection and try again later.');
      return;
    }

    try {
      const bioDataRecords = await sqlGetUnuploadedBioData()

      if (bioDataRecords.length === 0) {
        setTotalCount(0);
        setOperationIsSuccess(true)
        // Alert.alert('No Data', 'There are no records to upload.');
        setModalVisible(true);
        setIsLoading(false)
        return;
      }

      let batch = writeBatch(db);
      const collectionRef = collection(db, 'BioData');
      let batchCount = 0;

      for (const record of bioDataRecords) {
        const docRef = doc(collectionRef); 
        batch.set(docRef, record);
  
        batchCount++;
  
        if (batchCount === 500) {
          await batch.commit();
          batch = writeBatch(db); 
          batchCount = 0;
        }

       
      }

      if (batchCount > 0) {
        await batch.commit();
      }

      const deleteSuccess = await sqlDeleteAllBioData();
      if (deleteSuccess) {
        console.log('Local database cleared after upload.');
        setTotalCount(0);
        setOperationIsSuccess(true)
      } else {
        console.warn('Failed to clear local database.');
        setOperationIsSuccess(false) 
      }
    } catch (error) {
      console.error('Error uploading data:', error);
      setOperationIsSuccess(false)
    }

    setIsLoading(false)
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
