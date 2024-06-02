import React, { useEffect, useState } from 'react';
import { View, ImageBackground, StyleSheet, Image, TouchableOpacity, ActivityIndicator, Text, Modal } from 'react-native';
import { useSelector, useDispatch } from "react-redux";
import {deleteGuestAccount} from '../Features/gameSlice'
import AsyncStorage from '@react-native-async-storage/async-storage';

const Setting = ({navigateToSplash, toggleMute, handleSettings, isMuted }) => {
  // const guestId = route.params.guestId;
  // const { guestId, toggleMute } = route.params;
  const [guestId, setGuestId] = useState('');
  const [showAlert, setShowAlert] = useState(false);
  const [alertText, setAlertText] = useState('');
  const dispatch = useDispatch();
  const {
    deleteGuestAccountSuccess,
    deleteGuestAccountLoading,deleteGuestAccountError
  } = useSelector((state) => state.game);

  const {
    deleteEmailAccountSuccess,
    deleteEmailAccountLoading,deleteEmailAccountError
  } = useSelector((state) => state.game);

  const deleteId = () => {
    console.log("deleteId Pressed");
    dispatch(deleteGuestAccount({ guestId: guestId }))
    };

  const clearGuestId = async () => {
    try {
      await AsyncStorage.removeItem('guestId');
      // navigation.navigate("Splash");
      navigateToSplash();
      console.log('Guest ID cleared.');
    } catch (error) {
      console.error('Error clearing guest ID:', error);
    }

  };
  const closeModel = () => {
    // Reset the game state if needed
    setShowAlert(false);
   
  };

  const retrieveGuestId = async () => {
    try {
      const guestId = await AsyncStorage.getItem("guestId");
      console.log("Retrieved guest ID in profile page:", guestId);
      if (guestId !== null) {
        setGuestId(guestId);
        console.log("Retrieved guest ID:", guestId);
      } else {
        // No guest ID found
        console.log("No guest ID stored.");
      }
    } catch (error) {
      console.error("Error retrieving guest ID:", error);
    }
  };
 
  useEffect(()=>{
    retrieveGuestId();
  },[]);

  useEffect(()=>{
  if(deleteEmailAccountSuccess || deleteGuestAccountSuccess){
    // clearHighScore();
    clearGuestId();
  }
  if(deleteGuestAccountError){
    setAlertText('Something Went Wrong');
    setShowAlert(true);
  }
  },[deleteGuestAccountSuccess,deleteEmailAccountSuccess,deleteEmailAccountError,deleteGuestAccountError]);
  return (
    <View style={styles.container}>
      <ImageBackground
        source={require('../../assets/img/mainbackground.png')}
        style={styles.backgroundImage}
      >
         {deleteEmailAccountLoading || deleteGuestAccountLoading && (
          <View style={styles.loaderContainer}>
            <ActivityIndicator size="large" color="white" />
          </View>
        )}
        {showAlert && (
          <Modal
            animationType="fade"
            transparent={true}
            visible={showAlert}
            onRequestClose={() => setShowAlert(false)}
          >
            <View style={styles.modalContainer}>
              <View style={styles.modalContent}>
                <Text style={styles.alertText}>{alertText}</Text>
                <TouchableOpacity onPress={closeModel}>
                  <Image
                    source={require('../../assets/img/cross.png')}
                    style={styles.crossIcon}
                  />
                </TouchableOpacity>
              </View>
            </View>
          </Modal>
        )}
        <View style={styles.box}>
          <TouchableOpacity onPress={deleteId}>
            <Image
              source={require('../../assets/img/Delete 12.png')}
              style={styles.Delete1}
            />
          </TouchableOpacity>
          <TouchableOpacity onPress={toggleMute}>
            <Image
              source={!isMuted?require('../../assets/img/Mute12.png'):require('../../assets/img/unmute.png')}
              style={styles.Mute2}
            />
          </TouchableOpacity> 
         
          <TouchableOpacity onPress={handleSettings}>
            <Image
              source={require('../../assets/img/Back12.png')}
              style={styles.Setting2Image}
            />
          </TouchableOpacity>
        </View>
      </ImageBackground>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
  },
  box: {
    width: 320,
    height: 450,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderBottomEndRadius: 50,
    borderTopStartRadius: 50,
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative', // Added position relative
  },
  Delete1: {
    height:50,
    width: 240,
    marginLeft:10,
    marginBottom: 40,

  },
  Mute2: {
    height:50,
    width: 240,
    marginLeft:-10,
  },
  Setting2Image: {
        height: 45,
        width: 70,
        marginBottom: -90, // Adjusted to move to the bottom
        position: 'absolute',
        bottom: 10,
        right: -30,
        marginLeft:70,
      },
      loaderContainer: {
        ...StyleSheet.absoluteFillObject,
        justifyContent: 'center',
        alignItems: 'center',
      },
      modalContainer: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
      },
      modalContent: {
        backgroundColor: 'white',
        padding: 20,
        borderRadius: 10,
        alignItems: 'center',
      },
      alertText: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
      },
      crossIcon: {
        width: 20,
        height: 20,
        resizeMode: 'contain',
        marginTop: 10,
      },
});

export default Setting;