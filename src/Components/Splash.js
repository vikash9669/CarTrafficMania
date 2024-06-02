import React, { useEffect, useState } from "react";
import {
  View,
  ImageBackground,
  StyleSheet,
  Image,
  TouchableOpacity,
  Modal,
  Text,
  ActivityIndicator,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useSelector, useDispatch } from "react-redux";
import { signInAsGuest } from '../Features/gameSlice';

const Splash = ({ navigation }) => {
  const dispatch = useDispatch();
  const {
    guestSignInLoading,
    guestSignInData,
    guestSignInSuccess,
    guestSignInError,
  } = useSelector((state) => state.game);
  const [showAlert, setShowAlert] = useState(false);
  const [alertText, setAlertText] = useState("");

  const closeModel = () => {
    // Reset the game state if needed
    setShowAlert(false);
  };

  const navigateToGoogleSignIn = () => {
    navigation.navigate("googleSignIn");
  };

  const retrieveGuestId = async () => {
    try {
      const guestId = await AsyncStorage.getItem("guestId");
      if (guestId !== null) {
        navigation.navigate("Home", { guestId: guestId });
        console.log("Retrieved guest ID:", guestId);
      } else {
        // No guest ID found
        console.log("No guest ID stored.");
      }
    } catch (error) {
      console.error("Error retrieving guest ID:", error);
    }
  };
  const storeGuestId = async (guestId) => {
    try {
      await AsyncStorage.setItem("guestId", guestId);
      navigation.navigate("Home", { isGmailPage: false });
    } catch (error) {
      setAlertText("Something Went Wrong");
      setShowAlert(true);
      console.error("Error storing guest ID:", error);
    }
  };
  const navigateToGuest = () => {
    console.log("guestLogIn Pressed");

    dispatch(signInAsGuest());
  };

  useEffect(() => {
    retrieveGuestId();
  }, []);

  useEffect(() => {
    if (guestSignInSuccess  && guestSignInData) {
      console.log(guestSignInData.user.guestId,'guest signin data')
      storeGuestId(guestSignInData?.user.guestId);
    }
    if (guestSignInError) {
      setAlertText("Something Went Wrong");
      setShowAlert(true);
    }
  }, [
    guestSignInSuccess,
    guestSignInLoading,
    guestSignInData,
    guestSignInError,
  ]);

  return (
    <View style={styles.container}>
      <ImageBackground
        source={require("../../assets/img/mainbackground.png")}
        style={styles.backgroundImage}
      >
        <View style={styles.bgContainer}>
          <Image
            source={require("../../assets/img/wave.png")}
            style={styles.wave}
          />
        </View>
        {guestSignInLoading && (
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
                    source={require("../../assets/img/cross.png")}
                    style={styles.crossIcon}
                  />
                </TouchableOpacity>
              </View>
            </View>
          </Modal>
        )}
        <TouchableOpacity
          onPress={navigateToGuest}
          style={styles.buttonContainer1}
        >
          <Image
            source={require("../../assets/img/rishi12.png")}
            style={styles.buttonGuest}
          />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={navigateToGoogleSignIn}
          style={styles.buttonContainer2}
        >
          <Image
            source={require("../../assets/img/GoogleNew.png")}
            style={styles.buttonGoogle}
          />
        </TouchableOpacity>
        <View style={styles.logoContainer}>
          <Image
            source={require("../../assets/img/agnitologo.png")}
            style={styles.logo}
          />
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
    resizeMode: "cover",
    justifyContent: "center",
  },
  bgContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
  },
  wave: {
    width: 440,
    height: 460,
    marginTop: 500,
    opacity: 0.6,
  },
  buttonContainer1: {
    position: "absolute",
    bottom: 250, // Adjust as needed
    alignSelf: "center",
  },
  buttonGuest: {
    height: 50,
    width: 240,
  },
  buttonContainer2: {
    position: "absolute",
    bottom: 150, // Adjust as needed
    alignSelf: "center",
  },
  buttonGoogle: {
    height: 50,
    width: 240,
    marginLeft: -19,
  },
  logoContainer: {
    justifyContent: "flex-end",
    alignItems: "center",
    marginBottom: -650,
  },
  logo: {
    width: 130,
    height: 75,
    marginTop: 100,
    resizeMode: "contain", // Adjusted to maintain aspect ratio
    borderRadius: 10,
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

export default Splash;
