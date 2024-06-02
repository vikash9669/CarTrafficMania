import React, { useState, useEffect, useRef } from 'react';
import { useWindowDimensions, PanResponder, View, Text, StyleSheet, Alert } from 'react-native';
import { Canvas, useImage, Image } from '@shopify/react-native-skia';
import { Audio } from 'expo-av';
import GameOver from './GameOver'; 
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useMute } from '../../MuteContext';

const Game = ({ navigation, route  }) => {
  const {isMuted, setIsMuted} = useMute();
  // const setIsMuted = route.params.setIsMuted;
  const [guestId, setGuestId] = useState('')
  const [backgroundMusic, setBackgroundMusic] = useState(null);
  const [swipeSound, setSwipeSound] = useState(null);
  const [crashSound, setCrashSound] = useState(null);
  const { width, height } = useWindowDimensions();
  const bg = useImage(require('../../assets/img/GameBg.png'));
  const car1 = useImage(require('../../assets/img/cars/inova.png'));
  const car2 = useImage(require('../../assets/img/cars/inova.png'));
  const car3 = useImage(require('../../assets/img/cars/hilux.png'));
  const playerCar = useImage(require('../../assets/img/cars/thar.png'));

  useEffect(() => {
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


  const carWidth = 45;
  const carHeight = 80;
  const playerCarWidth = 45;
  const playerCarHeight = 80;

  const lanePositions = [
    width * 0.3 - playerCarWidth / 2,
    width * 0.5 - playerCarWidth / 2,
    width * 0.7 - playerCarWidth / 2,
  ];

  const [car1Y, setCar1Y] = useState(-(height * 0.5));
  const [car2Y, setCar2Y] = useState(-(height * 0.9));
  const [car3Y, setCar3Y] = useState(-(height * 1.3));
  const [playerCarY, setPlayerCarY] = useState(height - playerCarHeight - 20);
  const [playerCarX, setPlayerCarX] = useState(lanePositions[1]);
  const [currentLane, setCurrentLane] = useState(1);
  const [roadOffset, setRoadOffset] = useState(0);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [speed, setSpeed] = useState(8);

  const animationRef = useRef(null);

  const SWIPE_THRESHOLD = 20;

  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onPanResponderMove: (_, gestureState) => {
      if (Math.abs(gestureState.dx) > SWIPE_THRESHOLD) {
        if (gestureState.dx > 0 && currentLane < 2) {
          setCurrentLane(currentLane + 1);
          setPlayerCarX(lanePositions[currentLane + 1]);
          playSwipeSound();
        } else if (gestureState.dx < 0 && currentLane > 0) {
          setCurrentLane(currentLane - 1);
          setPlayerCarX(lanePositions[currentLane - 1]);
          playSwipeSound();
        }
      }
    },
    onPanResponderRelease: () => {},
  });

  const playSwipeSound = async () => {
    if (!isMuted && swipeSound) {
      try {
        await swipeSound.replayAsync();
      } catch (error) {
        console.error('Failed to play swipe sound', error);
      }
    }
  };

  const playCrashSound = async () => {
    if (!isMuted && crashSound) {
      try {
        await crashSound.replayAsync();
      } catch (error) {
        console.error('Failed to play crash sound', error);
      }
    }
  };

  useEffect(() => {
    const loadSounds = async () => {
      try {
        const swipe = new Audio.Sound();
        await swipe.loadAsync(require('../../assets/jumpsound.mp3'));
        setSwipeSound(swipe);

        const crash = new Audio.Sound();
        await crash.loadAsync(require('../../assets/crashSound.mp3'));
        setCrashSound(crash);

        const background = new Audio.Sound();
        await background.loadAsync(require('../../assets/backgroundMusic.mp3'));
        await background.setIsLoopingAsync(true);
        setBackgroundMusic(background);
      } catch (error) {
        console.error('Failed to load sounds', error);
      }
    };

    const loadMuteSetting = async () => {
      try {
        const muteStatus = await AsyncStorage.getItem('isMuted');
        setIsMuted(muteStatus === 'true');
      } catch (error) {
        console.error('Failed to load mute setting', error);
      }
    };

    loadSounds();
    loadMuteSetting();

    return () => {
      if (swipeSound) swipeSound.unloadAsync();
      if (crashSound) crashSound.unloadAsync();
      if (backgroundMusic) backgroundMusic.unloadAsync();
    };
  }, []);

  useEffect(() => {
    if (backgroundMusic) {
      if (isMuted) {
        backgroundMusic.stopAsync();
      } else {
        backgroundMusic.playAsync();
      }
    }
  }, [isMuted, backgroundMusic]);

  useEffect(() => {
    const animate = () => {
      if (!gameOver) {
        setCar1Y(prevY => (prevY >= height ? -(height * 0.5) : prevY + speed));
        setCar2Y(prevY => (prevY >= height ? -(height * 0.9) : prevY + speed));
        setCar3Y(prevY => (prevY >= height ? -(height * 1.3) : prevY + speed));
        setRoadOffset(prevOffset => (prevOffset >= height ? 0 : prevOffset + 1));
        setScore(prevScore => prevScore + 1);

        // Increase speed based on score
        if (score > 0 && score % 400 === 0) {
          setSpeed(speed => speed + 1);
        }
      }

      const playerCarLeft = playerCarX;
      const playerCarRight = playerCarLeft + playerCarWidth;
      const playerCarTop = playerCarY;
      const playerCarBottom = playerCarTop + playerCarHeight;

      const car1Left = width * 0.3 - carWidth / 2;
      const car1Right = car1Left + carWidth;
      const car1Top = car1Y;
      const car1Bottom = car1Top + carHeight;

      const car2Left = width * 0.5 - carWidth / 2;
      const car2Right = car2Left + carWidth;
      const car2Top = car2Y;
      const car2Bottom = car2Top + carHeight;

      const car3Left = width * 0.7 - carWidth / 2;
      const car3Right = car3Left + carWidth;
      const car3Top = car3Y;
      const car3Bottom = car3Top + carHeight;

      if (
        !gameOver &&
        ((playerCarLeft < car1Right && playerCarRight > car1Left && playerCarTop < car1Bottom && playerCarBottom > car1Top) ||
          (playerCarLeft < car2Right && playerCarRight > car2Left && playerCarTop < car2Bottom && playerCarBottom > car2Top) ||
          (playerCarLeft < car3Right && playerCarRight > car3Left && playerCarTop < car3Bottom && playerCarBottom > car3Top))
      ) {
        setGameOver(true);
        playCrashSound();
        if (backgroundMusic) backgroundMusic.stopAsync();
        cancelAnimationFrame(animationRef.current);
      }

      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(animationRef.current);
  }, [height, playerCarX, playerCarY, gameOver, car1Y, car2Y, car3Y, speed, score, backgroundMusic]);

  const resetGame = async () => {
    setScore(0);
    setGameOver(false);
    setSpeed(8); // Reset speed to initial value of 8
    setCar1Y(-(height * 0.5));
    setCar2Y(-(height * 0.9));
    setCar3Y(-(height * 1.3));
    setCurrentLane(1);
    setPlayerCarX(lanePositions[1]);

    if (backgroundMusic && !isMuted) {
      await backgroundMusic.replayAsync();
    }
  };

  const handleMainMenuPress = () => {
    console.log('Main Menu Pressed');
    navigation.navigate('Home', { guestId: guestId });
  };
 
  return (
    <View style={styles.container}>
      <Canvas {...panResponder.panHandlers} style={{ flex: 1 }}>
        <Image image={bg} x={0} y={roadOffset} width={width} height={height} fit="cover" />
        <Image image={bg} x={0} y={roadOffset - height} width={width} height={height} fit="cover" />
        <Image image={car1} x={width * 0.3 - carWidth / 2} y={car1Y} width={carWidth} height={carHeight} />
        <Image image={car2} x={width * 0.5 - carWidth / 2} y={car2Y} width={carWidth} height={carHeight} />
        <Image image={car3} x={width * 0.7 - carWidth / 2} y={car3Y} width={carWidth} height={carHeight} />
        <Image image={playerCar} x={playerCarX} y={playerCarY} width={playerCarWidth} height={playerCarHeight} />
      </Canvas>
      <View style={styles.scoreContainer}>
        <Text style={styles.scoreText}>Score: {score}</Text>
    
      </View>
      {gameOver && <GameOver guestId={guestId} resetGame={resetGame} score={score} mainMenu={handleMainMenuPress} />}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
  scoreContainer: {
    position: 'absolute',
    top: 20,
    left: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  scoreText: {
    color: 'white',
    fontSize: 20,
    marginRight: 10,
  },
  muteButton: {
    backgroundColor: 'gray',
    padding: 10,
    borderRadius: 5,
  },
  muteButtonText: {
    color: 'white',
    fontSize: 16,
  },
});

export default Game;
