import React,{useState, useEffect} from 'react';
import { View, ImageBackground, StyleSheet, Text, Image, TouchableOpacity } from 'react-native';
import { useSelector } from "react-redux";
import AsyncStorage from "@react-native-async-storage/async-storage";

const Score = ({navigation, route}) => {
  const guestId = route.params.guestId;
  const[score,setScore] = useState("0")
  const {
    gameOverData,
    gameOverSuccess,
  } = useSelector((state) => state.game);

  const retrieveScore = async () => {
    try {
      const highScore = await AsyncStorage.getItem("highScore");
      if (highScore !== null) {
       setScore(highScore);
        console.log("Retrieved highScore:", highScore);
      } else {

        console.log("No High score stored.");
      }
    } catch (error) {
      console.error("Error retrieving High Score:", error);
    }
  };

  useEffect(() => {
    retrieveScore();
    if(gameOverSuccess){
      setScore(gameOverData.score);
    }else {
      setScore("00");
    }
  }, []);

  const navigateToHome = () => {
    navigation.navigate("Home",{guestId:guestId});
  };

  return (
    <View style={styles.container}>
    <ImageBackground
      source={require('../../assets/img/mainbackground.png')}
      style={styles.backgroundImage}
    >
      <View style={styles.box}>
     
        <Image
          source={require('../../assets/img/Scorerank.png')}
          style={styles.Delete1}
        />
        
        <Text style={styles.scoreText}>{`Score:-${score}`}</Text>
    
        <TouchableOpacity onPress={navigateToHome}>
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
    position: 'relative',
  },
  Delete1: {
    height: 50,
    width: 240,
    marginLeft: 10,
    marginBottom: 40,
  },
  scoreText: {
    position: 'absolute',
    top: 187, 
    left: 110, 
    color: 'white',
    fontSize: 25,
    
  },
  Setting2Image: {
    height: 45,
    width: 70,
    marginBottom: -90, // Adjusted to move to the bottom
    position: 'absolute',
    bottom: 10,
    right: -30,
    marginLeft: 70,
  },
});

export default Score; 