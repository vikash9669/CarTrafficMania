import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import {submitScore} from '../Features/gameSlice'
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Image,
  Text
} from "react-native";

const GameOver = ({ mainMenu, resetGame, score, guestId }) => {
  // const guestId = route.params.guestId;
console.log("ye score ha",score,guestId);
  const dispatch  = useDispatch();

  const storeHighScore = async (score) => {
    try {
      const highScore = await AsyncStorage.getItem("highScore");
      const parsedHighScore = highScore ? Number(highScore) : 0;

      if (score >= parsedHighScore) {
        await AsyncStorage.setItem("highScore", String(score));
        console.log("New high score stored:", score);
      } else {
        console.log("Score is not higher than the current high score. Not stored.");
      }
    } catch (error) {
      console.error("Error handling high score:", error);
    }
  };

  useEffect(() =>{
    storeHighScore(score)
    dispatch(submitScore({
      guestId: guestId,
      score: score
  }))
  },[score, guestId, dispatch]);  

  const handleRestartPress = () => {
    resetGame(); // Calling the resetGame function passed as a prop
  };
  const handleMainMenuPress = () => {
    console.log(guestId)
    mainMenu(guestId); // Calling the MainMenu function passed as a prop
  };

  console.log(score,"ye score ha");
  return (
    <View style={styles.container}>
    <View style={styles.box}>
      <View style={styles.carLogoContainer}>
        <Text style={styles.Score}>{`Your Score: ${score}`}</Text>
        <Image
          source={require("../../assets/img/GameOver.png")}
          style={styles.carLogo1}
        />
      </View>
      <TouchableOpacity
        onPress={handleRestartPress}
        style={styles.buttonContainer1}
      >
        <Image
          source={require("../../assets/img/Restart.png")}
          style={styles.Race}
        />
      </TouchableOpacity>
      
      
      <TouchableOpacity
        onPress={handleMainMenuPress}
        style={styles.buttonContainer2}
      >
        <Image
          source={require("../../assets/img/MainMenu.png")}
          style={styles.Profile}
        />
      </TouchableOpacity>
    </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  box: {
    width: 320,
    height: 520,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    alignSelf: "center",
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
    marginTop: 120,
  },

  carLogoContainer: {
    justifyContent: "flex-end",
    alignItems: "center",
    marginBottom: -72,
    position: "absolute",
  },
  scoreImage: {
     height: 50,
    width: 240,
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
    width: 350,
    height: 200,
    marginTop: 200,
    resizeMode: "contain",
    marginBottom: 367,
    marginLeft: 1,
  },

  buttonContainer1: {
    position: "absolute",
    bottom: 150, // Adjust as needed
    alignSelf: "center",
  },
  Race: {
    height: 50,
    width: 240,
    marginLeft: 24,
  },
  buttonContainer2: {
    position: "absolute",
    bottom: 70, // Adjust as needed
    alignSelf: "center",
  },
  Profile: {
    height: 50,
    width: 240,
    marginLeft: 9,
  },
  Score12: {
    height: 50,
    width: 240,
    marginTop: -250,
  },
  Score:{
    flex: 1,
    position: 'absolute',
    top: 170, 
    left: 90, 
    color: 'white',
    fontSize: 25,
    
  }
});

export default GameOver;
