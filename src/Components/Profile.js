import React, { useEffect, useState, useRef } from "react";
import { updateGuestUserName } from "../Features/gameSlice";
import AsyncStorage from "@react-native-async-storage/async-storage";

import {
  View,
  ImageBackground,
  StyleSheet,
  Text,
  Image,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  Modal,
} from "react-native";
import { useSelector, useDispatch } from "react-redux";

const Profile = ({ navigation, route }) => {
  const dispatch = useDispatch();
  const [guestId, setGuestId] = useState(route.params.guestId);
  const isGmailPage = route.params.isGmailPage;
  const { guestSignInSuccess } = useSelector((state) => state.game);
  const { emailSignInData, emailSignInSuccess } = useSelector(
    (state) => state.game
  );
  const {
    updateGuestNameLoading,
    updateGuestNameSuccess,
    updateGuestNameData,
    updateGuestNameError,
  } = useSelector((state) => state.game);
  const [user, setUser] = useState("");
  const [updatedUser, setUpdatedUser] = useState("");
  const [flip, setflip] = useState(false);
  const inputRef = useRef(null);
  const [showAlert, setShowAlert] = useState(false);
  const [alertText, setAlertText] = useState("");

  const retrieveGuestId = async () => {
    try {
      const guestId = await AsyncStorage.getItem("guestId");
      if (guestId !== null) {
        setUser(guestId.slice(0, 15));
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

  useEffect(() => {
    setUser(guestId.slice(0, 15));
    if (updateGuestNameSuccess) {
      setGuestId(updateGuestNameData.guestId);
      setUser(updateGuestNameData.guestId.slice(0, 15));
    } else if (emailSignInSuccess) {
      setUser(emailSignInData.email);
    } else if (guestSignInSuccess) {
      setUser(guestId.slice(0, 15));
    } else {
      setUser(null);
    }
  }, [updateGuestNameSuccess]);
  const navigateToHome = () => {
    navigation.navigate("Home", { guestId: user });
  };

  const closeModel = () => {
    // Reset the game state if needed
    setShowAlert(false);
  };

  useEffect(() =>{
    setAlertText("Something Went Wrong");
    setShowAlert(true);
  },[updateGuestNameError])

  const handleEdit = () => {
    setflip(true);
  };
  const handleSave = () => {
    dispatch(
      updateGuestUserName({
        guestId: guestId,
        newGuestId: updatedUser,
      })
    );
    console.log("dispatch called", guestId, updatedUser);
    setflip(false);
  };

  return (
    <View style={styles.container}>
      <ImageBackground
        source={require("../../assets/img/mainbackground.png")}
        style={styles.backgroundImage}
      >
        <View style={styles.box}>
          {flip ? (
            <TextInput
              ref={inputRef}
              placeholder="Enter Your Name"
              placeholderTextColor="blue"
              style={[styles.inputField, styles.inputFieldFocused]}
              value={updatedUser}
              onChangeText={(text) => setUpdatedUser(text)}
            />
          ) : (
            <>
              <Image
                source={require("../../assets/img/Black12.png")}
                style={styles.Delete1}
              />
              <Text style={styles.userText}>{`${user}`}</Text>
            </>
          )}
          {updateGuestNameLoading && (
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
          {!flip && (
            <TouchableOpacity onPress={navigateToHome}>
              <Image
                source={require("../../assets/img/Back12.png")}
                style={styles.Setting2Image}
              />
            </TouchableOpacity>
          )}

          {flip ? (
            <TouchableOpacity onPress={handleSave}>
              <Image
                source={require("../../assets/img/Save.png")}
                style={styles.SaveImage}
              />
            </TouchableOpacity>
          ) : !isGmailPage ? (
            <TouchableOpacity onPress={handleEdit}>
              <Image
                source={require("../../assets/img/Edit.png")}
                style={styles.Edit2Image}
              />
            </TouchableOpacity>
          ) : null}
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
  box: {
    width: 320,
    height: 450,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    borderBottomEndRadius: 50,
    borderTopStartRadius: 50,
    alignSelf: "center",
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },
  Delete1: {
    height: 50,
    width: 240,
    marginLeft: 10,
    marginBottom: 40,
  },
  userText: {
    position: "absolute",
    top: 187,
    left: 60,
    color: "white",
    fontSize: 25,
  },
  Setting2Image: {
    height: 45,
    width: 70,
    marginBottom: -90, // Adjusted to move to the bottom
    position: "absolute",
    bottom: 10,
    right: -30,
    marginLeft: 70,
  },
  Edit2Image: {
    height: 45,
    width: 70,
    marginBottom: -90,
    position: "absolute",
    bottom: 10,
    right: -90,
    marginLeft: 50,
  },
  SaveImage: {
    height: 45,
    width: 70,
    marginBottom: -90,
    position: "absolute",
    bottom: 10,
    right: -90,
    marginLeft: 50,
  },
  inputField: {
    width: 240,
    height: 50,
    marginTop: -90,
    fontSize: 20,
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
    backgroundColor: "#87ceeb",
    zIndex: 0,
    borderWidth: 3,
    borderColor: "white",
    borderRadius: 20,
  },
  inputFieldFocused: {
    zIndex: 1,
    transform: [{ rotateY: "18deg" }],
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

export default Profile;
