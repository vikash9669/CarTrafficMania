import React, { useState, useEffect } from "react";
import Setting from "./Setting";
import { useMute } from "../../MuteContext";
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  View,
  ImageBackground,
  StyleSheet,
  TouchableOpacity,
  Image,
  BackHandler,
  Linking,
} from "react-native";


const Home = ({ navigation, route }) => {
  const [guestId, setGuestId] = useState('')
  const isGmailPage = route.params.isGmailPage;
  const {isMuted, setIsMuted} = useMute();
  const [openSettings, setOpenSettings] = useState(false);

  const navigateToProfile = () => {
    navigation.navigate("Profile", { isGmailPage: isGmailPage });
  };
  const navigateToScore = () => {
    navigation.navigate("Score", { guestId: guestId });
  };
  const navigateToSplash = () => {
    navigation.navigate("Splash");
  };

  const navigateToGame = () => {
    navigation.navigate("Game", { isMuted: isMuted, setIsMuted:setIsMuted });
  };
  const navigateToAgnitoGames = () => {
    Linking.openURL("https://play.google.com/store/apps/details?id=com.company.zingaat")
    .catch(err => console.error("Failed to open URL:", err));
  };

useEffect(() => {
  const storeGuestId = async (guestId) => {
    try {
      await AsyncStorage.setItem('guestId', guestId);
      setGuestId(guestId);
    } catch (error) {
      console.error('Error storing guest ID:', error);
    }
  };
  storeGuestId(route.params.guestId);
  const retrieveGuestId = async () => {
    try {
      const guestId = await AsyncStorage.getItem("guestId");
      if (guestId !== null) {
        setGuestId(guestId)
        console.log("Retrieved guest ID:", guestId);
      } else {
        // No guest ID found
        console.log("No guest ID stored.");
      }
    } catch (error) {
      console.error("Error retrieving guest ID:", error);
    }
  };

  retrieveGuestId();
},[]);

  useEffect(() => {
    const backAction = () => {
      BackHandler.exitApp(); // Exit the app when back button is pressed
      return true; // Prevent default back button behavior
    };

    // Add event listener for the back button press
    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );

    // Cleanup function to remove the event listener
    return () => backHandler.remove();
  }, []);

  

 // Toggle the mute status
 const toggleMute = async () => {
   console.log("toggle music")
  const newMuteStatus = !isMuted;
  setIsMuted(newMuteStatus);
  await AsyncStorage.setItem('isMuted', newMuteStatus.toString());
};
const handleSettings = () => {
setOpenSettings(prevState => !prevState);
};

  return (
    <View style={styles.container}>
      <ImageBackground
        source={require("../../assets/img/mainbackground.png")}
        style={styles.backgroundImage}
      >
        <View style={styles.box}>
          <View style={styles.carLogoContainer}>
            <Image
              source={require("../../assets/img/welcome12.png")}
              style={styles.carLogo}
            />
          </View>
          <View style={styles.carLogoContainer}>
            <Image
              source={require("../../assets/img/CTMlogo.png")}
              style={styles.carLogo1}
            />
          </View>
          <TouchableOpacity
            onPress={navigateToGame}
            style={styles.buttonContainer1}
          >
            <Image
              source={require("../../assets/img/Race 12.png")}
              style={styles.Race}
            />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={navigateToProfile}
            style={styles.buttonContainer2}
          >
            <Image
              source={require("../../assets/img/Profile 12.png")}
              style={styles.Profile}
            />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={navigateToScore}
            style={styles.buttonContainer3}
          >
            <Image
              source={require("../../assets/img/Score 12.png")}
              style={styles.Score}
            />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={navigateToAgnitoGames}
            style={styles.Settingicon}
          >
            <Image
              source={require("../../assets/img/Settingicon.png")}
              style={styles.SettingiconImage}
            />
          </TouchableOpacity>
          <TouchableOpacity onPress={handleSettings} style={styles.Setting2}>
            <Image
              source={require("../../assets/img/Setting2.png")}
              style={styles.Setting2Image}
            />
          </TouchableOpacity>
          {openSettings && <Setting toggleMute={toggleMute} isMuted={isMuted} navigateToSplash = {navigateToSplash}  handleSettings={handleSettings} />}
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
    height: 620,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    alignSelf: "center",
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
    marginTop: 50,
  },

  carLogoContainer: {
    justifyContent: "flex-end",
    alignItems: "center",
    marginBottom: -72,
    position: "absolute",
  },
  carLogo: {
    width: 322,
    height: 400,
    marginTop: -165,
    resizeMode: "contain",
    marginBottom: 367,
    marginLeft: 1,
  },
  carLogo1: {
    width: 450,
    height: 370,
    marginTop: 180,
    resizeMode: "contain",
    marginBottom: 367,
    marginLeft: 1,
  },
  Settingicon: {
    height: 45,
    width: 70,
    marginBottom: 10, // Adjusted to move to the bottom
    position: "absolute",
    bottom: 10,
    left: 15,
  },
  SettingiconImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  Setting2: {
    height: 45,
    width: 70,
    marginBottom: 10, // Adjusted to move to the bottom
    position: "absolute",
    bottom: 10,
    right: 15,
  },
  Setting2Image: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  buttonContainer1: {
    position: "absolute",
    bottom: 250, // Adjust as needed
    alignSelf: "center",
  },
  Race: {
    height: 50,
    width: 240,
    marginLeft: 24,
  },
  buttonContainer2: {
    position: "absolute",
    bottom: 180, // Adjust as needed
    alignSelf: "center",
  },
  Profile: {
    height: 50,
    width: 240,
    marginLeft: 9,
  },
  buttonContainer3: {
    position: "absolute",
    bottom: 110, // Adjust as needed
    alignSelf: "center",
  },
  Score: {
    height: 50,
    width: 240,
    marginLeft: -10,
  },
});

export default Home;
