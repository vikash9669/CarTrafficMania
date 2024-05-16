import React, { useState, useEffect, useRef } from 'react';
import { useWindowDimensions, PanResponder, View, Text, StyleSheet } from 'react-native';
import { Canvas, useImage, Image } from '@shopify/react-native-skia';
import GameOver from './GameOver'; // Import the GameOver component
import { Audio } from 'expo-av';

const Game = ({ navigation, route }) => {
  const soundObject = new Audio.Sound();
  const guestId = route.params.guestId;
  const { width, height } = useWindowDimensions();
  const bg = useImage(require('../../assets/img/GameBg.png'));
  const car1 = useImage(require('../../assets/img/cars/inova.png'));
  const car2 = useImage(require('../../assets/img/cars/embesder.png'));
  const car3 = useImage(require('../../assets/img/cars/hilux.png'));
  const playerCar = useImage(require('../../assets/img/cars/thar.png'));

  const carWidth = 50;
  const carHeight = 100;
  const playerCarWidth = 50;
  const playerCarHeight = 100;
  const maxPlayerCarLeft = 70;
  const maxPlayerCarRight = width - 70 - playerCarWidth;
  const initialCarSpeed = 2;
  const initialPlayerCarSpeed = 15; // Adjusted player car speed

  const [car1Y, setCar1Y] = useState(-(Math.random() * height * 0.5));
  const [car2Y, setCar2Y] = useState(car1Y - carHeight);
  const [car3Y, setCar3Y] = useState(car2Y - carHeight);
  const [playerCarY, setPlayerCarY] = useState(height - playerCarHeight - 20);
  const [playerCarX, setPlayerCarX] = useState(width / 2 - playerCarWidth / 2);
  const [roadOffset, setRoadOffset] = useState(0);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const animationRef = useRef(null);

  const carSpeed = initialCarSpeed;
  const playerCarSpeed = initialPlayerCarSpeed;
  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onPanResponderMove: (_, gestureState) => {
      const newX = Math.min(maxPlayerCarRight, Math.max(maxPlayerCarLeft, playerCarX + gestureState.dx));
      setPlayerCarX(newX);
    },
  });

  useEffect(() => {
    async function loadSound() {
      try {
        await soundObject.loadAsync(require('../../assets/jumpsound.mp3'));
      } catch (error) {
        console.error('Failed to load the sound', error);
      }
    }
    loadSound();

    return () => {
      soundObject.unloadAsync();
    };
  }, []);

  useEffect(() => {
    const animate = () => {
      if (!gameOver) {
        setCar1Y(prevY => (prevY >= height ? -(Math.random() * height * 0.5) : prevY + Math.random() * 15 * carSpeed)); // Adjusted car speed
        setCar2Y(prevY => (prevY >= height ? -(Math.random() * height * 0.5) : prevY + Math.random() * 12 * carSpeed)); // Adjusted car speed
        setCar3Y(prevY => (prevY >= height ? -(Math.random() * height * 0.5) : prevY + Math.random() * 10 * carSpeed)); // Adjusted car speed
        setRoadOffset(prevOffset => (prevOffset >= height ? 0 : prevOffset + 1));
        setScore(prevScore => prevScore + 1);
      }

      const playerCarLeft = playerCarX;
      const playerCarRight = playerCarLeft + playerCarWidth;
      const playerCarTop = playerCarY;
      const playerCarBottom = playerCarTop + playerCarHeight;

      const checkCollision = (carLeft, carRight, carTop, carBottom) =>
        playerCarLeft < carRight && playerCarRight > carLeft && playerCarTop < carBottom && playerCarBottom > carTop;

      if (
        !gameOver &&
        (checkCollision(width * 0.3 - carWidth / 2, width * 0.3 + carWidth / 2, car1Y, car1Y + carHeight) ||
          checkCollision(width * 0.7 - carWidth / 2, width * 0.7 + carWidth / 2, car2Y, car2Y + carHeight) ||
          checkCollision(width * 0.5 - carWidth / 2, width * 0.5 + carWidth / 2, car3Y, car3Y + carHeight))
      ) {
        setGameOver(true);
        cancelAnimationFrame(animationRef.current);
      }

      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(animationRef.current);
  }, [height, playerCarX, playerCarY, gameOver, car1Y, car2Y, car3Y]);

  const resetGame = () => {
    setScore(0);
    setGameOver(false);
    setCar1Y(-(Math.random() * height * 0.5));
    setCar2Y(car1Y - carHeight);
    setCar3Y(car2Y - carHeight);
  };

  const handleMainMenuPress = () => {
    navigation.navigate("Home", { guestId: guestId });
  };

  return (
    <View style={styles.container}>
      <Canvas {...panResponder.panHandlers} style={{ flex: 1 }}>
        <Image image={bg} x={0} y={roadOffset} width={width} height={height} fit="cover" />
        <Image image={bg} x={0} y={roadOffset - height} width={width} height={height} fit="cover" />
        <Image image={car1} x={width * 0.3 - carWidth / 2} y={car1Y} width={carWidth} height={carHeight} />
        <Image image={car2} x={width * 0.7 - carWidth / 2} y={car2Y} width={carWidth} height={carHeight} />
        <Image image={car3} x={width * 0.5 - carWidth / 2} y={car3Y} width={carWidth} height={carHeight} />
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
    top: 30,
    left: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  scoreText: {
    color: 'white',
    fontSize: 20,
    marginRight: 10,
  },
});

export default Game;


// ==============================
// lane changing code
// import React, { useState, useEffect, useRef } from 'react';
// import { useWindowDimensions, PanResponder, View, Text, StyleSheet } from 'react-native';
// import { Canvas, useImage, Image } from '@shopify/react-native-skia';
// import GameOver from './GameOver'; // Import the GameOver component
// import { Audio } from 'expo-av';

// const Game = ({ navigation, route }) => {
//   const soundObject = new Audio.Sound();
//   const [soundLoaded, setSoundLoaded] = useState(false);
//   const guestId = route.params.guestId;
//   const { width, height } = useWindowDimensions();
//   const bg = useImage(require('../../assets/img/road.png'));
//   const car1 = useImage(require('../../assets/img/cars/inova.png'));
//   const car2 = useImage(require('../../assets/img/cars/inova.png'));
//   const car3 = useImage(require('../../assets/img/cars/hilux.png'));
//   const playerCar = useImage(require('../../assets/img/cars/thar.png'));

//   const carWidth = 55;
//   const carHeight = 100;
//   const playerCarWidth = 55;
//   const playerCarHeight = 100;
//   const maxPlayerCarLeft = 70;
//   const maxPlayerCarRight = width - 70 - playerCarWidth;

//   const NUM_LANES = 3; // Number of lanes
//   const LANE_WIDTH = width / NUM_LANES; // Width of each lane
//   const SWIPE_THRESHOLD = LANE_WIDTH / 2; // Define a swipe threshold

//   const [car1Y, setCar1Y] = useState(-(Math.random() * height * 0.5));
//   const [car2Y, setCar2Y] = useState(-(Math.random() * height * 0.5));
//   const [car3Y, setCar3Y] = useState(-(Math.random() * height * 0.5));
//   const [playerCarX, setPlayerCarX] = useState(width / 2 - playerCarWidth / 2);
//   const [currentLane, setCurrentLane] = useState(Math.floor(NUM_LANES / 2)); // Initially start at the middle lane
//   const [roadOffset, setRoadOffset] = useState(0);
//   const [score, setScore] = useState(0);
//   const [gameOver, setGameOver] = useState(false);
//   const animationRef = useRef(null);

//   const panResponder = PanResponder.create({
//     onMoveShouldSetPanResponder: (_, gestureState) => Math.abs(gestureState.dx) > Math.abs(gestureState.dy),
//     onPanResponderMove: (_, gestureState) => {
//       const newX = Math.min(maxPlayerCarRight, Math.max(maxPlayerCarLeft, playerCarX + gestureState.dx));
//       setPlayerCarX(newX);

//       // Check if the swipe gesture exceeds the threshold
//       if (Math.abs(gestureState.dx) > SWIPE_THRESHOLD) {
//         // Determine the lane based on the gesture direction
//         const laneDelta = Math.round(gestureState.dx / LANE_WIDTH);
//         switchLane(laneDelta);
//       }
//     },
//     onPanResponderRelease: (_, gestureState) => {
//       // Check if the gesture is a horizontal swipe
//       if (Math.abs(gestureState.dx) > Math.abs(gestureState.dy)) {
//         // Determine the lane based on the gesture direction
//         const laneDelta = Math.round(gestureState.dx / LANE_WIDTH);
//         switchLane(laneDelta);
//       }
//     },
//   });

//   useEffect(() => {
//     async function loadSound() {
//       try {
//         await soundObject.loadAsync(require('../../assets/jumpsound.mp3'));
//         setSoundLoaded(true);
//       } catch (error) {
//         console.error('Failed to load the sound', error);
//       }
//     }
//     loadSound();

//     return () => {
//       soundObject.unloadAsync();
//     };
//   }, []);

//   useEffect(() => {
//     async function playSound() {
//       try {
//         await soundObject.replayAsync();
//       } catch (error) {
//         console.error('Failed to play the sound', error);
//       }
//     }
//     if (soundLoaded) {
//       // Check if sound is loaded before playing
//       playSound();
//     }
//   }, [playerCarX, soundLoaded]);

//   useEffect(() => {
//     const animate = () => {
//       if (!gameOver) {
//         setCar1Y(prevY => (prevY >= height ? -(Math.random() * height * 0.5) : prevY + Math.random() * 23));
//         setCar2Y(prevY => (prevY >= height ? -(Math.random() * height * 0.5) : prevY + Math.random() * 18));
//         setCar3Y(prevY => (prevY >= height ? -(Math.random() * height * 0.5) : prevY + Math.random() * 19));
//         setRoadOffset(prevOffset => (prevOffset >= height ? 0 : prevOffset + 1));
//         setScore(prevScore => prevScore + 1);
//       }

//       const playerCarX = LANE_WIDTH * currentLane + (LANE_WIDTH - playerCarWidth) / 2;

//       const playerCarLeft = playerCarX;
//       const playerCarRight = playerCarLeft + playerCarWidth;
//       const playerCarTop = height - playerCarHeight - 20;
//       const playerCarBottom = playerCarTop + playerCarHeight;

//       const car1Left = width * 0.2 - carWidth / 2;
//       const car1Right = car1Left + carWidth;
//       const car1Top = car1Y;
//       const car1Bottom = car1Top + carHeight;

//       const car2Left = width * 0.8 - carWidth / 2;
//       const car2Right = car2Left + carWidth;
//       const car2Top = car2Y;
//       const car2Bottom = car2Top + carHeight;

//       const car3Left = width * 0.5 - carWidth / 2;
//       const car3Right = car3Left + carWidth;
//       const car3Top = car3Y;
//       const car3Bottom = car3Top + carHeight;
//       if (
//         !gameOver &&
//         ((playerCarLeft < car1Right && playerCarRight > car1Left && playerCarTop < car1Bottom && playerCarBottom > car1Top) ||
//           (playerCarLeft < car2Right && playerCarRight > car2Left && playerCarTop < car2Bottom && playerCarBottom > car2Top) ||
//           (playerCarLeft < car3Right && playerCarRight > car3Left && playerCarTop < car3Bottom && playerCarBottom > car3Top))
//       ) {
//         setGameOver(true);
//         cancelAnimationFrame(animationRef.current);
//       }

//       animationRef.current = requestAnimationFrame(animate);
//     };

//     animationRef.current = requestAnimationFrame(animate);

//     return () => cancelAnimationFrame(animationRef.current);
//   }, [height, currentLane, playerCarWidth, playerCarHeight, gameOver, car1Y, car2Y, car3Y, width]);

//   const resetGame = () => {
//     setScore(0);
//     setGameOver(false);
//     setCar1Y(-(Math.random() * height * 0.5));
//     setCar2Y(-(Math.random() * height * 0.5));
//     setCar3Y(-(Math.random() * height * 0.5));
//   };

//   const switchLane = (laneDelta) => {
//     const targetLane = currentLane + laneDelta; // Calculate the target lane

//     if (targetLane >= 0 && targetLane < NUM_LANES) {
//       setCurrentLane(targetLane);
//     }
//   };

//   const handleMainMenuPress = (guestId) => {
//     console.log('Main Menu Pressed');
//     navigation.navigate('Home', { guestId: guestId }); // Navigate to Home screen
//   };

//   return (
//     <View style={styles.container}>
//       <Canvas {...panResponder.panHandlers} style={{ flex: 1 }}>
//         <Image image={bg} x={0} y={roadOffset} width={width} height={height} fit="cover" />
//         <Image image={bg} x={0} y={roadOffset - height} width={width} height={height} fit="cover" />
//         <Image image={car1} x={width * 0.2 - carWidth / 2} y={car1Y} width={carWidth} height={carHeight} />
//         <Image image={car2} x={width * 0.8 - carWidth / 2} y={car2Y} width={carWidth} height={carHeight} />
//         <Image image={car3} x={width * 0.5 - carWidth / 2} y={car3Y} width={carWidth} height={carHeight} />
//         <Image image={playerCar} x={LANE_WIDTH * currentLane + (LANE_WIDTH - playerCarWidth) / 2} y={height - playerCarHeight - 20} width={playerCarWidth} height={playerCarHeight} />
//       </Canvas>
//       <View style={styles.scoreContainer}>
//         <Text style={styles.scoreText}>Score: {score}</Text>
//       </View>
//       {gameOver && <GameOver guestId={guestId} resetGame={resetGame} score={score} mainMenu={handleMainMenuPress} />}
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: 'black',
//   },
//   scoreContainer: {
//     position: 'absolute',
//     top: 20,
//     left: 20,
//     flexDirection: 'row',
//     alignItems: 'center',
//   },
//   scoreText: {
//     color: 'white',
//     fontSize: 20,
//     marginRight: 10,
//   },
// });

// export default Game;



// ===========================================================================
// working lane changing logic

// import React, { useState, useEffect, useRef } from 'react';
// import { useWindowDimensions, PanResponder, Alert, View, Text, StyleSheet } from 'react-native';
// import { Canvas, useImage, Image } from '@shopify/react-native-skia';
// import GameOver from './GameOver'; // Import the GameOver component
// import { Audio } from 'expo-av';
// import Chance from 'chance';

// const Game = ({ navigation, route }) => {
//   const chance = new Chance();
//   let randomNumber1 = chance.integer({ min: 1, max: 10 });
//   let randomNumber2 = chance.integer({ min: 1, max: 10 });
//   let randomNumber3 = chance.integer({ min: 1, max: 10 });

//   const soundObject = new Audio.Sound();
//   const guestId = route.params.guestId;
//   const { width, height } = useWindowDimensions();
//   const bg = useImage(require('../../assets/img/GameBg.png'));
//   const car1 = useImage(require('../../assets/img//cars/inova.png'));
//   const car2 = useImage(require('../../assets/img//cars/inova.png'));
//   const car3 = useImage(require('../../assets/img//cars/hilux.png'));
//   const playerCar = useImage(require('../../assets//img/cars/thar.png'));

//   const carWidth = 55;
//   const carHeight = 100;
//   const playerCarWidth = 55;
//   const playerCarHeight = 100;

//   const lanePositions = [
//     width * 0.3 - playerCarWidth / 2,
//     width * 0.5 - playerCarWidth / 2,
//     width * 0.7 - playerCarWidth / 2,
//   ];

//   const [car1Y, setCar1Y] = useState(-(randomNumber1 * height * 0.5));
//   const [car2Y, setCar2Y] = useState(-(randomNumber2 * height * 0.7));
//   const [car3Y, setCar3Y] = useState(-(randomNumber3 * height * 0.2));
//   const [playerCarY, setPlayerCarY] = useState(height - playerCarHeight - 20);
//   const [playerCarX, setPlayerCarX] = useState(lanePositions[1]); // Start in the middle lane
//   const [currentLane, setCurrentLane] = useState(1); // Middle lane
//   const [roadOffset, setRoadOffset] = useState(0);
//   const [score, setScore] = useState(0);
//   const [gameOver, setGameOver] = useState(false);
//   const animationRef = useRef(null);

//   const panResponder = PanResponder.create({
//     onStartShouldSetPanResponder: () => true,
//     onPanResponderRelease: (_, gestureState) => {
//       if (gestureState.dx > 50 && currentLane < 2) { // Swiping right
//         setCurrentLane(currentLane + 1);
//         setPlayerCarX(lanePositions[currentLane + 1]);
//       } else if (gestureState.dx < -50 && currentLane > 0) { // Swiping left
//         setCurrentLane(currentLane - 1);
//         setPlayerCarX(lanePositions[currentLane - 1]);
//       }
//     },
//   });

//   useEffect(() => {
//     async function loadSound() {
//       try {
//         await soundObject.loadAsync(require('../../assets/jumpsound.mp3'));
//       } catch (error) {
//         console.error('Failed to load the sound', error);
//       }
//     }
//     loadSound();
    
//     return () => {
//       soundObject.unloadAsync();
//     };
//   }, []);

//   useEffect(() => {
//     async function playSound() {
//       try {
//         await soundObject.replayAsync();
//       } catch (error) {
//         console.error('Failed to play the sound', error);
//       }
//     }
//     playSound();
//   }, []);

//   useEffect(() => {
//     const animate = () => {
//       if (!gameOver) {
//         setCar1Y(prevY => (prevY >= height ? -(randomNumber1 * height * 0.5) : prevY + randomNumber1 * 4));
//         setCar2Y(prevY => (prevY >= height ? -(randomNumber2 * height * 0.7) : prevY + randomNumber2 * 4));
//         setCar3Y(prevY => (prevY >= height ? -(randomNumber3 * height * 0.2) : prevY + randomNumber3 * 4));
//         setRoadOffset(prevOffset => (prevOffset >= height ? 0 : prevOffset + 1));
//         setScore(prevScore => prevScore + 1);
//       }

//       const playerCarLeft = playerCarX;
//       const playerCarRight = playerCarLeft + playerCarWidth;
//       const playerCarTop = playerCarY;
//       const playerCarBottom = playerCarTop + playerCarHeight;

//       const car1Left = width * 0.3 - carWidth / 2;
//       const car1Right = car1Left + carWidth;
//       const car1Top = car1Y;
//       const car1Bottom = car1Top + carHeight;

//       const car2Left = width * 0.7 - carWidth / 2;
//       const car2Right = car2Left + carWidth;
//       const car2Top = car2Y;
//       const car2Bottom = car2Top + carHeight;

//       const car3Left = width * 0.5 - carWidth / 2;
//       const car3Right = car3Left + carWidth;
//       const car3Top = car3Y;
//       const car3Bottom = car3Top + carHeight;

//       if (
//         !gameOver &&
//         ((playerCarLeft < car1Right && playerCarRight > car1Left && playerCarTop < car1Bottom && playerCarBottom > car1Top) ||
//           (playerCarLeft < car2Right && playerCarRight > car2Left && playerCarTop < car2Bottom && playerCarBottom > car2Top) ||
//           (playerCarLeft < car3Right && playerCarRight > car3Left && playerCarTop < car3Bottom && playerCarBottom > car3Top))
//       ) {
//         setGameOver(true);
//         cancelAnimationFrame(animationRef.current);
//       }

//       animationRef.current = requestAnimationFrame(animate);
//     };

//     animationRef.current = requestAnimationFrame(animate);

//     return () => cancelAnimationFrame(animationRef.current);
//   }, [height, playerCarX, playerCarY, gameOver, car1Y, car2Y, car3Y]);

//   const resetGame = () => {
//     setScore(0);
//     setGameOver(false);
//     setCar1Y(-(randomNumber1 * height * 0.3));
//     setCar2Y(-(randomNumber2 * height * 0.3));
//     setCar3Y(-(randomNumber3 * height * 0.3));
//     setCurrentLane(1); // Reset to the middle lane
//     setPlayerCarX(lanePositions[1]);
//   };

//   const handleMainMenuPress = (guestId) => {
//     console.log("Main Menu Pressed");
//     navigation.navigate("Home", { guestId: guestId }); // Navigate to Home screen
//   };

//   return (
//     <View style={styles.container}>
//       <Canvas {...panResponder.panHandlers} style={{ flex: 1 }}>
//         <Image image={bg} x={0} y={roadOffset} width={width} height={height} fit="cover" />
//         <Image image={bg} x={0} y={roadOffset - height} width={width} height={height} fit="cover" />
//         <Image image={car1} x={width * 0.3 - carWidth / 2} y={car1Y} width={carWidth} height={carHeight} />
//         <Image image={car2} x={width * 0.7 - carWidth / 2} y={car2Y} width={carWidth} height={carHeight} />
//         <Image image={car3} x={width * 0.5 - carWidth / 2} y={car3Y} width={carWidth} height={carHeight} />
//         <Image image={playerCar} x={playerCarX} y={playerCarY} width={playerCarWidth} height={playerCarHeight} />
//       </Canvas>
//       <View style={styles.scoreContainer}>
//         <Text style={styles.scoreText}>Score: {score}</Text>
//       </View>
//       {gameOver && <GameOver guestId={guestId} resetGame={resetGame} score={score} mainMenu={handleMainMenuPress} />}
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: 'black',
//   },
//   scoreContainer: {
//     position: 'absolute',
//     top: 20,
//     left: 20,
//     flexDirection: 'row',
//     alignItems: 'center',
//   },
//   scoreText: {
//     color: 'white',
//     fontSize: 20,
//     marginRight: 10,
//   },
//   livesText: {
//     color: 'white',
//     fontSize: 20,
//   },
// });

// export default Game;


// ========================================================
// working ve0ry fine


// import React, { useState, useEffect, useRef } from 'react';
// import { useWindowDimensions, PanResponder, View, Text, StyleSheet } from 'react-native';
// import { Canvas, useImage, Image } from '@shopify/react-native-skia';
// import GameOver from './GameOver'; // Import the GameOver component
// import { Audio } from 'expo-av';
// import Chance from 'chance';

// const Game = ({ navigation, route }) => {
//   const chance = new Chance();
//   let randomNumber1 = chance.integer({ min: 1, max: 10 });
//   let randomNumber2 = chance.integer({ min: 1, max: 10 });
//   let randomNumber3 = chance.integer({ min: 1, max: 10 });

//   const soundObject = new Audio.Sound();
//   const guestId = route.params.guestId;
//   const { width, height } = useWindowDimensions();
//   const bg = useImage(require('../../assets/img/GameBg.png'));
//   const car1 = useImage(require('../../assets/img//cars/inova.png'));
//   const car2 = useImage(require('../../assets/img//cars/inova.png'));
//   const car3 = useImage(require('../../assets/img//cars/hilux.png'));
//   const playerCar = useImage(require('../../assets//img/cars/thar.png'));

//   const carWidth = 55;
//   const carHeight = 100;
//   const playerCarWidth = 55;
//   const playerCarHeight = 100;

//   const lanePositions = [
//     width * 0.3 - playerCarWidth / 2,
//     width * 0.5 - playerCarWidth / 2,
//     width * 0.7 - playerCarWidth / 2,
//   ];

//   const [car1Y, setCar1Y] = useState(-(randomNumber1 * height * 0.5));
//   const [car2Y, setCar2Y] = useState(-(randomNumber2 * height * 0.7));
//   const [car3Y, setCar3Y] = useState(-(randomNumber3 * height * 0.2));
//   const [playerCarY, setPlayerCarY] = useState(height - playerCarHeight - 20);
//   const [playerCarX, setPlayerCarX] = useState(lanePositions[1]); // Start in the middle lane
//   const [currentLane, setCurrentLane] = useState(1); // Middle lane
//   const [roadOffset, setRoadOffset] = useState(0);
//   const [score, setScore] = useState(0);
//   const [gameOver, setGameOver] = useState(false);
//   const animationRef = useRef(null);

//   // Log gesture detection
//   const panResponder = PanResponder.create({
//     onStartShouldSetPanResponder: () => true,
//     onPanResponderRelease: (_, gestureState) => {
//       console.log('Gesture detected:', gestureState);
//       if (gestureState.dx > 50 && currentLane < 2) { // Swiping right
//         setCurrentLane(currentLane + 1);
//       } else if (gestureState.dx < -50 && currentLane > 0) { // Swiping left
//         setCurrentLane(currentLane - 1);
//       }
//     },
//   });

//   // Update player car X position whenever the lane changes
//   useEffect(() => {
//     setPlayerCarX(lanePositions[currentLane]);
//   }, [currentLane]);

//   useEffect(() => {
//     async function loadSound() {
//       try {
//         await soundObject.loadAsync(require('../../assets/jumpsound.mp3'));
//       } catch (error) {
//         console.error('Failed to load the sound', error);
//       }
//     }
//     loadSound();
    
//     return () => {
//       soundObject.unloadAsync();
//     };
//   }, []);

//   useEffect(() => {
//     async function playSound() {
//       try {
//         await soundObject.replayAsync();
//       } catch (error) {
//         console.error('Failed to play the sound', error);
//       }
//     }
//     playSound();
//   }, []);

//   useEffect(() => {
//     const animate = () => {
//       if (!gameOver) {
//         setCar1Y(prevY => (prevY >= height ? -(randomNumber1 * height * 0.5) : prevY + randomNumber1 * 4));
//         setCar2Y(prevY => (prevY >= height ? -(randomNumber2 * height * 0.7) : prevY + randomNumber2 * 4));
//         setCar3Y(prevY => (prevY >= height ? -(randomNumber3 * height * 0.2) : prevY + randomNumber3 * 4));
//         setRoadOffset(prevOffset => (prevOffset >= height ? 0 : prevOffset + 1));
//         setScore(prevScore => prevScore + 1);
//       }

//       const playerCarLeft = playerCarX;
//       const playerCarRight = playerCarLeft + playerCarWidth;
//       const playerCarTop = playerCarY;
//       const playerCarBottom = playerCarTop + playerCarHeight;

//       const car1Left = width * 0.3 - carWidth / 2;
//       const car1Right = car1Left + carWidth;
//       const car1Top = car1Y;
//       const car1Bottom = car1Top + carHeight;

//       const car2Left = width * 0.7 - carWidth / 2;
//       const car2Right = car2Left + carWidth;
//       const car2Top = car2Y;
//       const car2Bottom = car2Top + carHeight;

//       const car3Left = width * 0.5 - carWidth / 2;
//       const car3Right = car3Left + carWidth;
//       const car3Top = car3Y;
//       const car3Bottom = car3Top + carHeight;

//       if (
//         !gameOver &&
//         ((playerCarLeft < car1Right && playerCarRight > car1Left && playerCarTop < car1Bottom && playerCarBottom > car1Top) ||
//           (playerCarLeft < car2Right && playerCarRight > car2Left && playerCarTop < car2Bottom && playerCarBottom > car2Top) ||
//           (playerCarLeft < car3Right && playerCarRight > car3Left && playerCarTop < car3Bottom && playerCarBottom > car3Top))
//       ) {
//         setGameOver(true);
//         cancelAnimationFrame(animationRef.current);
//       }

//       animationRef.current = requestAnimationFrame(animate);
//     };

//     animationRef.current = requestAnimationFrame(animate);

//     return () => cancelAnimationFrame(animationRef.current);
//   }, [height, playerCarX, playerCarY, gameOver, car1Y, car2Y, car3Y]);

//   const resetGame = () => {
//     setScore(0);
//     setGameOver(false);
//     setCar1Y(-(randomNumber1 * height * 0.3));
//     setCar2Y(-(randomNumber2 * height * 0.3));
//     setCar3Y(-(randomNumber3 * height * 0.3));
//     setCurrentLane(1); // Reset to the middle lane
//     setPlayerCarX(lanePositions[1]);
//   };

//   const handleMainMenuPress = (guestId) => {
//     console.log("Main Menu Pressed");
//     navigation.navigate("Home", { guestId: guestId }); // Navigate to Home screen
//   };

//   return (
//     <View style={styles.container}>
//       <Canvas {...panResponder.panHandlers} style={{ flex: 1 }}>
//         <Image image={bg} x={0} y={roadOffset} width={width} height={height} fit="cover" />
//         <Image image={bg} x={0} y={roadOffset - height} width={width} height={height} fit="cover" />
//         <Image image={car1} x={width * 0.3 - carWidth / 2} y={car1Y} width={carWidth} height={carHeight} />
//         <Image image={car2} x={width * 0.7 - carWidth / 2} y={car2Y} width={carWidth} height={carHeight} />
//         <Image image={car3} x={width * 0.5 - carWidth / 2} y={car3Y} width={carWidth} height={carHeight} />
//         <Image image={playerCar} x={playerCarX} y={playerCarY} width={playerCarWidth} height={playerCarHeight} />
//       </Canvas>
//       <View style={styles.scoreContainer}>
//         <Text style={styles.scoreText}>Score: {score}</Text>
//       </View>
//       {gameOver && <GameOver guestId={guestId} resetGame={resetGame} score={score} mainMenu={handleMainMenuPress} />}
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: 'black',
//   },
//   scoreContainer: {
//     position: 'absolute',
//     top: 20,
//     left: 20,
//     flexDirection: 'row',
//     alignItems: 'center',
//   },
//   scoreText: {
//     color: 'white',
//     fontSize: 20,
//     marginRight: 10,
//   },
//   livesText: {
//     color: 'white',
//     fontSize: 20,
//   },
// });

// export default Game;



// =============================================
// working very fine
// import React, { useState, useEffect, useRef } from 'react';
// import { useWindowDimensions, PanResponder, View, Text, StyleSheet } from 'react-native';
// import { Canvas, useImage, Image } from '@shopify/react-native-skia';
// import GameOver from './GameOver'; // Import the GameOver component
// import { Audio } from 'expo-av';
// import Chance from 'chance';

// const Game = ({ navigation, route }) => {
//   const chance = new Chance();
//   let randomNumber1 = chance.integer({ min: 1, max: 10 });
//   let randomNumber2 = chance.integer({ min: 1, max: 10 });
//   let randomNumber3 = chance.integer({ min: 1, max: 10 });

//   const soundObject = new Audio.Sound();
//   const guestId = route.params.guestId;
//   const { width, height } = useWindowDimensions();
//   const bg = useImage(require('../../assets/img/GameBg.png'));
//   const car1 = useImage(require('../../assets/img//cars/inova.png'));
//   const car2 = useImage(require('../../assets/img//cars/inova.png'));
//   const car3 = useImage(require('../../assets/img//cars/hilux.png'));
//   const playerCar = useImage(require('../../assets//img/cars/thar.png'));

//   const carWidth = 45;
//   const carHeight = 80;
//   const playerCarWidth = 45;
//   const playerCarHeight = 80;

//   const lanePositions = [
//     width * 0.3 - playerCarWidth / 2,
//     width * 0.5 - playerCarWidth / 2,
//     width * 0.7 - playerCarWidth / 2,
//   ];

//   const [car1Y, setCar1Y] = useState(-(randomNumber1 * height * 0.5));
//   const [car2Y, setCar2Y] = useState(-(randomNumber2 * height * 0.7));
//   const [car3Y, setCar3Y] = useState(-(randomNumber3 * height * 0.2));
//   const [playerCarY, setPlayerCarY] = useState(height - playerCarHeight - 20);
//   const [playerCarX, setPlayerCarX] = useState(lanePositions[1]); // Start in the middle lane
//   const [currentLane, setCurrentLane] = useState(1); // Middle lane
//   const [roadOffset, setRoadOffset] = useState(0);
//   const [score, setScore] = useState(0);
//   const [gameOver, setGameOver] = useState(false);
//   const animationRef = useRef(null);

//   const SWIPE_THRESHOLD = 8; // Further lower the threshold for more sensitive swipes

//   const panResponder = PanResponder.create({
//     onStartShouldSetPanResponder: () => true,
//     onPanResponderMove: (_, gestureState) => {
//       if (Math.abs(gestureState.dx) > SWIPE_THRESHOLD) {
//         if (gestureState.dx > 0 && currentLane < 2) { // Swiping right
//           setCurrentLane(currentLane + 1);
//         } else if (gestureState.dx < 0 && currentLane > 0) { // Swiping left
//           setCurrentLane(currentLane - 1);
//         }
//       }
//     },
//     onPanResponderRelease: (_, gestureState) => {
//       if (Math.abs(gestureState.dx) > SWIPE_THRESHOLD) {
//         if (gestureState.dx > 0 && currentLane < 2) { // Swiping right
//           setCurrentLane(currentLane + 1);
//         } else if (gestureState.dx < 0 && currentLane > 0) { // Swiping left
//           setCurrentLane(currentLane - 1);
//         }
//       }
//     }
//   });

//   // Update player car X position whenever the lane changes
//   useEffect(() => {
//     setPlayerCarX(lanePositions[currentLane]);
//   }, [currentLane]);

//   useEffect(() => {
//     async function loadSound() {
//       try {
//         await soundObject.loadAsync(require('../../assets/jumpsound.mp3'));
//       } catch (error) {
//         console.error('Failed to load the sound', error);
//       }
//     }
//     loadSound();
    
//     return () => {
//       soundObject.unloadAsync();
//     };
//   }, []);

//   useEffect(() => {
//     async function playSound() {
//       try {
//         await soundObject.replayAsync();
//       } catch (error) {
//         console.error('Failed to play the sound', error);
//       }
//     }
//     playSound();
//   }, []);

//   useEffect(() => {
//     const animate = () => {
//       if (!gameOver) {
//         setCar1Y(prevY => (prevY >= height ? -(randomNumber1 * height * 0.5) : prevY + randomNumber1 * 4));
//         setCar2Y(prevY => (prevY >= height ? -(randomNumber2 * height * 0.7) : prevY + randomNumber2 * 4));
//         setCar3Y(prevY => (prevY >= height ? -(randomNumber3 * height * 0.2) : prevY + randomNumber3 * 4));
//         setRoadOffset(prevOffset => (prevOffset >= height ? 0 : prevOffset + 1));
//         setScore(prevScore => prevScore + 1);
//       }

//       const playerCarLeft = playerCarX;
//       const playerCarRight = playerCarLeft + playerCarWidth;
//       const playerCarTop = playerCarY;
//       const playerCarBottom = playerCarTop + playerCarHeight;

//       const car1Left = width * 0.3 - carWidth / 2;
//       const car1Right = car1Left + carWidth;
//       const car1Top = car1Y;
//       const car1Bottom = car1Top + carHeight;

//       const car2Left = width * 0.7 - carWidth / 2;
//       const car2Right = car2Left + carWidth;
//       const car2Top = car2Y;
//       const car2Bottom = car2Top + carHeight;

//       const car3Left = width * 0.5 - carWidth / 2;
//       const car3Right = car3Left + carWidth;
//       const car3Top = car3Y;
//       const car3Bottom = car3Top + carHeight;

//       if (
//         !gameOver &&
//         ((playerCarLeft < car1Right && playerCarRight > car1Left && playerCarTop < car1Bottom && playerCarBottom > car1Top) ||
//           (playerCarLeft < car2Right && playerCarRight > car2Left && playerCarTop < car2Bottom && playerCarBottom > car2Top) ||
//           (playerCarLeft < car3Right && playerCarRight > car3Left && playerCarTop < car3Bottom && playerCarBottom > car3Top))
//       ) {
//         setGameOver(true);
//         cancelAnimationFrame(animationRef.current);
//       }

//       animationRef.current = requestAnimationFrame(animate);
//     };

//     animationRef.current = requestAnimationFrame(animate);

//     return () => cancelAnimationFrame(animationRef.current);
//   }, [height, playerCarX, playerCarY, gameOver, car1Y, car2Y, car3Y]);

//   const resetGame = () => {
//     setScore(0);
//     setGameOver(false);
//     setCar1Y(-(randomNumber1 * height * 0.3));
//     setCar2Y(-(randomNumber2 * height * 0.3));
//     setCar3Y(-(randomNumber3 * height * 0.3));
//     setCurrentLane(1); // Reset to the middle lane
//     setPlayerCarX(lanePositions[1]);
//   };

//   const handleMainMenuPress = (guestId) => {
//     console.log("Main Menu Pressed");
//     navigation.navigate("Home", { guestId: guestId }); // Navigate to Home screen
//   };

//   return (
//     <View style={styles.container}>
//       <Canvas {...panResponder.panHandlers} style={{ flex: 1 }}>
//         <Image image={bg} x={0} y={roadOffset} width={width} height={height} fit="cover" />
//         <Image image={bg} x={0} y={roadOffset - height} width={width} height={height} fit="cover" />
//         <Image image={car1} x={width * 0.3 - carWidth / 2} y={car1Y} width={carWidth} height={carHeight} />
//         <Image image={car2} x={width * 0.7 - carWidth / 2} y={car2Y} width={carWidth} height={carHeight} />
//         <Image image={car3} x={width * 0.5 - carWidth / 2} y={car3Y} width={carWidth} height={carHeight} />
//         <Image image={playerCar} x={playerCarX} y={playerCarY} width={playerCarWidth} height={playerCarHeight} />
//       </Canvas>
//       <View style={styles.scoreContainer}>
//         <Text style={styles.scoreText}>Score: {score}</Text>
//       </View>
//       {gameOver && <GameOver guestId={guestId} resetGame={resetGame} score={score} mainMenu={handleMainMenuPress} />}
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: 'black',
//   },
//   scoreContainer: {
//     position: 'absolute',
//     top: 20,
//     left: 20,
//     flexDirection: 'row',
//     alignItems: 'center',
//   },
//   scoreText: {
//     color: 'white',
//     fontSize: 20,
//     marginRight: 10,
//   },
//   livesText: {
//     color: 'white',
//     fontSize: 20,
//   },
// });

// export default Game;

// ===================================================================================
// 15/05/2024
// working very very fine
// import React, { useState, useEffect, useRef } from 'react';
// import { useWindowDimensions, PanResponder, View, Text, StyleSheet } from 'react-native';
// import { Canvas, useImage, Image } from '@shopify/react-native-skia';
// import GameOver from './GameOver'; // Import the GameOver component
// import { Audio } from 'expo-av';
// import Chance from 'chance';

// const Game = ({ navigation, route }) => {
//   const chance = new Chance();
//   let randomNumber1 = chance.integer({ min: 1, max: 10 });
//   let randomNumber2 = chance.integer({ min: 1, max: 10 });
//   let randomNumber3 = chance.integer({ min: 1, max: 10 });

//   const soundObject = new Audio.Sound();
//   const guestId = route.params.guestId;
//   const { width, height } = useWindowDimensions();
//   const bg = useImage(require('../../assets/img/GameBg.png'));
//   const car1 = useImage(require('../../assets/img//cars/inova.png'));
//   const car2 = useImage(require('../../assets/img//cars/inova.png'));
//   const car3 = useImage(require('../../assets/img//cars/hilux.png'));
//   const playerCar = useImage(require('../../assets//img/cars/thar.png'));

//   const carWidth = 45;
//   const carHeight = 80;
//   const playerCarWidth = 45;
//   const playerCarHeight = 80;

//   const lanePositions = [
//     width * 0.3 - playerCarWidth / 2,
//     width * 0.5 - playerCarWidth / 2,
//     width * 0.7 - playerCarWidth / 2,
//   ];

//   const [car1Y, setCar1Y] = useState(-(randomNumber1 * height * 0.5));
//   const [car2Y, setCar2Y] = useState(-(randomNumber2 * height * 0.7));
//   const [car3Y, setCar3Y] = useState(-(randomNumber3 * height * 0.2));
//   const [playerCarY, setPlayerCarY] = useState(height - playerCarHeight - 20);
//   const [playerCarX, setPlayerCarX] = useState(lanePositions[1]); // Start in the middle lane
//   const [currentLane, setCurrentLane] = useState(1); // Middle lane
//   const [roadOffset, setRoadOffset] = useState(0);
//   const [score, setScore] = useState(0);
//   const [gameOver, setGameOver] = useState(false);
//   const animationRef = useRef(null);

//   const SWIPE_THRESHOLD = 9; // Further lower the threshold for more sensitive swipes

//   const panResponder = PanResponder.create({
//     onStartShouldSetPanResponder: () => true,
//     onPanResponderMove: (_, gestureState) => {
//       if (Math.abs(gestureState.dx) > SWIPE_THRESHOLD) {
//         if (gestureState.dx > 0 && currentLane < 2) { // Swiping right
//           setCurrentLane(currentLane + 1);
//         } else if (gestureState.dx < 0 && currentLane > 0) { // Swiping left
//           setCurrentLane(currentLane - 1);
//         }
//       }
//     },
//     onPanResponderRelease: (_, gestureState) => {
//       if (Math.abs(gestureState.dx) > SWIPE_THRESHOLD) {
//         if (gestureState.dx > 0 && currentLane < 2) { // Swiping right
//           setCurrentLane(currentLane + 1);
//         } else if (gestureState.dx < 0 && currentLane > 0) { // Swiping left
//           setCurrentLane(currentLane - 1);
//         }
//       }
//     }
//   });

//   // Update player car X position whenever the lane changes
//   useEffect(() => {
//     setPlayerCarX(lanePositions[currentLane]);
//   }, [currentLane]);

//   useEffect(() => {
//     async function loadSound() {
//       try {
//         await soundObject.loadAsync(require('../../assets/jumpsound.mp3'));
//       } catch (error) {
//         console.error('Failed to load the sound', error);
//       }
//     }
//     loadSound();
    
//     return () => {
//       soundObject.unloadAsync();
//     };
//   }, []);

//   useEffect(() => {
//     async function playSound() {
//       try {
//         await soundObject.replayAsync();
//       } catch (error) {
//         console.error('Failed to play the sound', error);
//       }
//     }
//     playSound();
//   }, []);

//   useEffect(() => {
//     const animate = () => {
//       if (!gameOver) {
//         setCar1Y(prevY => (prevY >= height ? -(randomNumber1 * height * 0.5) : prevY + randomNumber1 * 4));
//         setCar2Y(prevY => (prevY >= height ? -(randomNumber2 * height * 0.7) : prevY + randomNumber2 * 4));
//         setCar3Y(prevY => (prevY >= height ? -(randomNumber3 * height * 0.2) : prevY + randomNumber3 * 4));
//         setRoadOffset(prevOffset => (prevOffset >= height ? 0 : prevOffset + 1));
//         setScore(prevScore => prevScore + 1);
//       }

//       const playerCarLeft = playerCarX;
//       const playerCarRight = playerCarLeft + playerCarWidth;
//       const playerCarTop = playerCarY;
//       const playerCarBottom = playerCarTop + playerCarHeight;

//       const car1Left = width * 0.3 - carWidth / 2;
//       const car1Right = car1Left + carWidth;
//       const car1Top = car1Y;
//       const car1Bottom = car1Top + carHeight;

//       const car2Left = width * 0.7 - carWidth / 2;
//       const car2Right = car2Left + carWidth;
//       const car2Top = car2Y;
//       const car2Bottom = car2Top + carHeight;

//       const car3Left = width * 0.5 - carWidth / 2;
//       const car3Right = car3Left + carWidth;
//       const car3Top = car3Y;
//       const car3Bottom = car3Top + carHeight;

//       if (
//         !gameOver &&
//         ((playerCarLeft < car1Right && playerCarRight > car1Left && playerCarTop < car1Bottom && playerCarBottom > car1Top) ||
//           (playerCarLeft < car2Right && playerCarRight > car2Left && playerCarTop < car2Bottom && playerCarBottom > car2Top) ||
//           (playerCarLeft < car3Right && playerCarRight > car3Left && playerCarTop < car3Bottom && playerCarBottom > car3Top))
//       ) {
//         setGameOver(true);
//         cancelAnimationFrame(animationRef.current);
//       }

//       animationRef.current = requestAnimationFrame(animate);
//     };

//     animationRef.current = requestAnimationFrame(animate);

//     return () => cancelAnimationFrame(animationRef.current);
//   }, [height, playerCarX, playerCarY, gameOver, car1Y, car2Y, car3Y]);

//   const resetGame = () => {
//     setScore(0);
//     setGameOver(false);
//     setCar1Y(-(randomNumber1 * height * 0.3));
//     setCar2Y(-(randomNumber2 * height * 0.3));
//     setCar3Y(-(randomNumber3 * height * 0.3));
//     setCurrentLane(1); // Reset to the middle lane
//     setPlayerCarX(lanePositions[1]);
//   };

//   const handleMainMenuPress = (guestId) => {
//     console.log("Main Menu Pressed");
//     navigation.navigate("Home", { guestId: guestId }); // Navigate to Home screen
//   };

//   return (
//     <View style={styles.container}>
//       <Canvas {...panResponder.panHandlers} style={{ flex: 1 }}>
//         <Image image={bg} x={0} y={roadOffset} width={width} height={height} fit="cover" />
//         <Image image={bg} x={0} y={roadOffset - height} width={width} height={height} fit="cover" />
//         <Image image={car1} x={width * 0.3 - carWidth / 2} y={car1Y} width={carWidth} height={carHeight} />
//         <Image image={car2} x={width * 0.7 - carWidth / 2} y={car2Y} width={carWidth} height={carHeight} />
//         <Image image={car3} x={width * 0.5 - carWidth / 2} y={car3Y} width={carWidth} height={carHeight} />
//         <Image image={playerCar} x={playerCarX} y={playerCarY} width={playerCarWidth} height={playerCarHeight} />
//       </Canvas>
//       <View style={styles.scoreContainer}>
//         <Text style={styles.scoreText}>Score: {score}</Text>
//       </View>
//       {gameOver && <GameOver guestId={guestId} resetGame={resetGame} score={score} mainMenu={handleMainMenuPress} />}
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: 'black',
//   },
//   scoreContainer: {
//     position: 'absolute',
//     top: 20,
//     left: 20,
//     flexDirection: 'row',
//     alignItems: 'center',
//   },
//   scoreText: {
//     color: 'white',
//     fontSize: 20,
//     marginRight: 10,
//   },
//   livesText: {
//     color: 'white',
//     fontSize: 20,
//   },
// });

// export default Game;

// =====================================================
// new one with sound 
// import React, { useState, useEffect, useRef } from "react";
// import {
//   useWindowDimensions,
//   PanResponder,
//   View,
//   Text,
//   StyleSheet,
// } from "react-native";
// import { Canvas, useImage, Image } from "@shopify/react-native-skia";
// import GameOver from "./GameOver";
// import { Audio } from "expo-av";
// import Chance from "chance";

// const numberOfLanes = 3;
// const carsPerLane = 3;

// const Game = ({ navigation, route }) => {
//   const chance = new Chance();
//   const guestId = route.params.guestId;
//   const { width, height } = useWindowDimensions();

//   // Load images
//   const bg = useImage(require("../../assets/img/GameBg.png"));
//   const car1 = useImage(require("../../assets/img/cars/inova.png"));
//   const car3 = useImage(require("../../assets/img/cars/hilux.png"));
//   const playerCar = useImage(require("../../assets/img/cars/thar.png"));

//   // Car dimensions
//   const carWidth = 45;
//   const carHeight = 80;
//   const playerCarWidth = 45;
//   const playerCarHeight = 80;

//   // Lane positions
//   const lanePositions = [
//     width * 0.3 - playerCarWidth / 2,
//     width * 0.5 - playerCarWidth / 2,
//     width * 0.7 - playerCarWidth / 2,
//   ];

//   // Game state variables
//   const [cars, setCars] = useState([]);
//   const [playerCarY, setPlayerCarY] = useState(height - playerCarHeight - 20);
//   const [playerCarX, setPlayerCarX] = useState(lanePositions[1]); // Start in the middle lane
//   const [currentLane, setCurrentLane] = useState(1);
//   const [roadOffset, setRoadOffset] = useState(0);
//   const [score, setScore] = useState(0);
//   const [gameOver, setGameOver] = useState(false);
//   const animationRef = useRef(null);
//   const [carSpeedMultiplier, setCarSpeedMultiplier] = useState(1);

//   // Sound variables
//   const backgroundSound = new Audio.Sound();
//   const scoreSound = new Audio.Sound();
//   const crashSound = new Audio.Sound();
//   const carMoveSound = new Audio.Sound();

//   // ... Part 2 will continue here
//   // ... (continued from Part 1)

//   // Swipe gesture
//   const SWIPE_THRESHOLD = 50;
//   const panResponder = PanResponder.create({
//     onStartShouldSetPanResponder: () => true,
//     onPanResponderMove: (_, gestureState) => {
//       if (Math.abs(gestureState.dx) > SWIPE_THRESHOLD) {
//         if (gestureState.dx > 0 && currentLane < 2) {
//           setCurrentLane(currentLane + 1);
//           carMoveSound.replayAsync();
//         } else if (gestureState.dx < 0 && currentLane > 0) {
//           setCurrentLane(currentLane - 1);
//           carMoveSound.replayAsync();
//         }
//       }
//     },
//   });

//   useEffect(() => {
//     // Initialize cars array with random positions and lane assignments
//     const initialCars = [];
//     for (let i = 0; i < numberOfLanes * carsPerLane; i++) {
//       const lane = i % numberOfLanes;
//       const initialY = -(
//         chance.integer({ min: 1, max: 10 }) *
//         height *
//         (lane + 1) *
//         0.2
//       );
//       initialCars.push({ y: initialY, lane });
//     }
//     setCars(initialCars);

//     // Load and play background music
//     const loadSounds = async () => {
//       try {
//         await Promise.all([
//           backgroundSound.loadAsync(require("../../assets/jumpsound.mp3")),
//           scoreSound.loadAsync(require("../../assets/jumpsound.mp3")),
//           crashSound.loadAsync(require("../../assets/jumpsound.mp3")),
//           carMoveSound.loadAsync(require("../../assets/jumpsound.mp3")),
//         ]);
//         await backgroundSound.setIsLoopingAsync(true);
//         await backgroundSound.playAsync();
//       } catch (error) {
//         console.error("Failed to load sounds:", error);
//       }
//     };
//     loadSounds();

//     return () => {
//       // Unload sounds when component unmounts
//       backgroundSound.unloadAsync();
//       scoreSound.unloadAsync();
//       crashSound.unloadAsync();
//       carMoveSound.unloadAsync();
//     };
//   }, []);

//   useEffect(() => {
//     setPlayerCarX(lanePositions[currentLane]);
//   }, [currentLane]);

//   useEffect(() => {
//     // Increase car speed when score crosses a multiple of 500
//     if (score > 0 && score % 500 === 0) {
//       setCarSpeedMultiplier((prev) => prev + 0.2); // Adjust speed increment as needed
//     }
//   }, [score]);

//   // ... Part 3 will continue here
//   // ... (continued from Part 2)

//   useEffect(() => {
//     const animate = () => {
//       if (!gameOver) {
//         // Update each car's position
//         setCars((prevCars) =>
//           prevCars.map((car) => {
//             const newY =
//               car.y +
//               chance.integer({ min: 1, max: 10 }) * 4 * carSpeedMultiplier;
//             return {
//               ...car,
//               y:
//                 newY >= height
//                   ? -(
//                       chance.integer({ min: 1, max: 10 }) *
//                       height *
//                       (car.lane + 1) *
//                       0.2
//                     )
//                   : newY,
//             };
//           })
//         );
//         setRoadOffset((prevOffset) =>
//           prevOffset >= height ? 0 : prevOffset + 1
//         );
//         setScore((prevScore) => prevScore + 1);

//         // Collision detection
//         const playerCarRect = {
//           x: playerCarX,
//           y: playerCarY,
//           width: playerCarWidth,
//           height: playerCarHeight,
//         };

//         for (const car of cars) {
//           const otherCarRect = {
//             x: lanePositions[car.lane],
//             y: car.y,
//             width: carWidth,
//             height: carHeight,
//           };

//           if (rectsIntersect(playerCarRect, otherCarRect)) {
//             setGameOver(true);
//             break;
//           }
//         }
//       }

//       animationRef.current = requestAnimationFrame(animate);
//     };

//     animationRef.current = requestAnimationFrame(animate);

//     return () => cancelAnimationFrame(animationRef.current);
//   }, [height, playerCarX, playerCarY, gameOver, carSpeedMultiplier]);

//   // Helper function to check for rectangle intersection (collision)
//   const rectsIntersect = (rect1, rect2) => {
//     return (
//       rect1.x < rect2.x + rect2.width &&
//       rect1.x + rect1.width > rect2.x &&
//       rect1.y < rect2.y + rect2.height &&
//       rect1.y + rect1.height > rect2.y
//     );
//   };

//   // Reset game
//   const resetGame = () => {
//     setCarSpeedMultiplier(1);
//     setScore(0);
//     setGameOver(false);
//     setCars(
//       cars.map((car) => ({
//         ...car,
//         y: -(
//           chance.integer({ min: 1, max: 10 }) *
//           height *
//           (car.lane + 1) *
//           0.2
//         ),
//       }))
//     );
//     setCurrentLane(1);
//     setPlayerCarX(lanePositions[1]);
//   };

//   // Handle main menu press
//   const handleMainMenuPress = (guestId) => {
//     navigation.navigate("Home", { guestId: guestId });
//   };

//   // ... return (rendering the game)
// };
// // ... (rest of the code from Part 3)

// return (
//   <View style={styles.container}>
//     <Canvas {...panResponder.panHandlers} style={{ flex: 1 }}>
//       {/* Background (repeating for scrolling effect) */}
//       <Image
//         image={bg}
//         x={0}
//         y={roadOffset}
//         width={width}
//         height={height}
//         fit="cover"
//       />
//       <Image
//         image={bg}
//         x={0}
//         y={roadOffset - height}
//         width={width}
//         height={height}
//         fit="cover"
//       />

//       {/* Other cars */}
//       {cars.map((car, index) => (
//         <Image
//           key={index}
//           image={index % 3 === 0 ? car3 : car1}
//           x={lanePositions[car.lane]}
//           y={car.y}
//           width={carWidth}
//           height={carHeight}
//         />
//       ))}

//       {/* Player car */}
//       <Image
//         image={playerCar}
//         x={playerCarX}
//         y={playerCarY}
//         width={playerCarWidth}
//         height={playerCarHeight}
//       />
//     </Canvas>

//     {/* Score display */}
//     <View style={styles.scoreContainer}>
//       <Text style={styles.scoreText}>Score: {score}</Text>
//     </View>

//     {/* Game Over component */}
//     {gameOver && (
//       <GameOver
//         guestId={guestId}
//         resetGame={resetGame}
//         score={score}
//         mainMenu={handleMainMenuPress}
//       />
//     )}
//   </View>
// );

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: "black",
//   },
//   scoreContainer: {
//     position: "absolute",
//     top: 20,
//     left: 20,
//     flexDirection: "row",
//     alignItems: "center",
//   },
//   scoreText: {
//     color: "white",
//     fontSize: 20,
//     marginRight: 10,
//   },
// });

// export default Game;


// ===============================================================================
// the original game
// import React, { useState, useEffect, useRef } from 'react';
// import { useWindowDimensions, PanResponder, Alert, View, Text, StyleSheet } from 'react-native';
// import { Canvas, useImage, Image } from '@shopify/react-native-skia';
// import GameOver from './GameOver'; // Import the GameOver component
// import { Audio } from 'expo-av';
// import Chance from 'chance';

// const Game = ({navigation , route}) => {
//   const chance = new Chance();
// let randomNumber1 = chance.integer({ min: 1, max: 10 });
// let randomNumber2 = chance.integer({ min: 1, max: 10 });
// let randomNumber3 = chance.integer({ min: 1, max: 10});

//   const soundObject = new Audio.Sound();
//   const guestId = route.params.guestId;
//   const { width, height } = useWindowDimensions();
//   // const bg = useImage(require('../../assets/img/road.png'));
//   const bg = useImage(require('../../assets/img/GameBg.png'));
//   const car1 = useImage(require('../../assets/img//cars/inova.png'));
//   const car2 = useImage(require('../../assets/img//cars/inova.png'));
//   const car3 = useImage(require('../../assets/img//cars/hilux.png'));
//   const playerCar = useImage(require('../../assets//img/cars/thar.png'));

//   const carWidth = 55;
//   const carHeight = 100;
//   const playerCarWidth = 55;
//   const playerCarHeight = 100;
// const maxPlayerCarLeft = 70;
//   const maxPlayerCarRight = width - 70 - playerCarWidth;

//   const [car1Y, setCar1Y] = useState(-(randomNumber1 * height * 0.5));
//   const [car2Y, setCar2Y] = useState(-(randomNumber2 * height * 0.7));
//   const [car3Y, setCar3Y] = useState(-(randomNumber3 * height * 0.2));
//   const [playerCarY, setPlayerCarY] = useState(height - playerCarHeight - 20);
//   const [playerCarX, setPlayerCarX] = useState(width / 2 - playerCarWidth / 2);
//   const [roadOffset, setRoadOffset] = useState(0);
//   const [score, setScore] = useState(0);
//   const [gameOver, setGameOver] = useState(false);
//   const animationRef = useRef(null);

// //   const panResponder = PanResponder.create({
// //     onStartShouldSetPanResponder: () => true,
// //     onPanResponderMove: (_, gestureState) => {
// //       const newX = Math.min(width - playerCarWidth, Math.max(0, playerCarX + gestureState.dx));
// //       setPlayerCarX(newX);
// //     },
// //   });
// const panResponder = PanResponder.create({
//   onStartShouldSetPanResponder: () => true,
//   onPanResponderMove: (_, gestureState) => {
//     const newX = Math.min(maxPlayerCarRight, Math.max(maxPlayerCarLeft, playerCarX + gestureState.dx));
//     setPlayerCarX(newX);
//   },
// });
//   useEffect(() => {
//   async function loadSound() {
//     try {
//       await soundObject.loadAsync(require('../../assets/jumpsound.mp3'));
//     } catch (error) {
//       console.error('Failed to load the sound', error);
//     }
//   }
//   loadSound();

//   return () => {
//     soundObject.unloadAsync();
//   };
//   }, []);
//   useEffect(() => {
//   async function playSound() {
//     try {
//       await soundObject.replayAsync();
//     } catch (error) {
//       console.error('Failed to play the sound', error);
//     }
//   }
//   playSound();
//   }, []);
//   // playerCarX

//   useEffect(() => {
//     const animate = () => {
//       if (!gameOver) {
//         setCar1Y(prevY => (prevY >= height ? -(randomNumber1 * height * 0.5) : prevY + randomNumber1 * 4));
//         setCar2Y(prevY => (prevY >= height ? -(randomNumber2 * height * 0.7) : prevY + randomNumber2 * 4));
//         setCar3Y(prevY => (prevY >= height ? -(randomNumber3 * height * 0.2) : prevY + randomNumber3 * 4));
//         setRoadOffset(prevOffset => (prevOffset >= height ? 0 : prevOffset + 1));
//         setScore(prevScore => prevScore + 1);
//       }

//       const playerCarLeft = playerCarX;
//       const playerCarRight = playerCarLeft + playerCarWidth;
//       const playerCarTop = playerCarY;
//       const playerCarBottom = playerCarTop + playerCarHeight;

//       const car1Left = width * 0.3 - carWidth / 2;
//       const car1Right = car1Left + carWidth;
//       const car1Top = car1Y;
//       const car1Bottom = car1Top + carHeight;

//       const car2Left = width * 0.7 - carWidth / 2;
//       const car2Right = car2Left + carWidth;
//       const car2Top = car2Y;
//       const car2Bottom = car2Top + carHeight;

//       const car3Left = width * 0.5 - carWidth / 2;
//       const car3Right = car3Left + carWidth;
//       const car3Top = car3Y;
//       const car3Bottom = car3Top + carHeight;
//       if (
//         !gameOver &&
//         ((playerCarLeft < car1Right && playerCarRight > car1Left && playerCarTop < car1Bottom && playerCarBottom > car1Top) ||
//           (playerCarLeft < car2Right && playerCarRight > car2Left && playerCarTop < car2Bottom && playerCarBottom > car2Top)||
//            (playerCarLeft < car3Right && playerCarRight > car3Left && playerCarTop < car3Bottom && playerCarBottom > car3Top))
//       ) {

//           setGameOver(true);
//           cancelAnimationFrame(animationRef.current);

//       }

//       animationRef.current = requestAnimationFrame(animate);
//     };

//     animationRef.current = requestAnimationFrame(animate);

//     return () => cancelAnimationFrame(animationRef.current);
//   }, [height, playerCarX, playerCarY, gameOver, car1Y, car2Y,car3Y]);

//   const resetGame = () => {
//     setScore(0);

//     setGameOver(false);
//     setCar1Y(-(randomNumber1 * height * 0.3));
//     setCar2Y(-(randomNumber2 * height * 0.3));
//     setCar3Y(-(randomNumber3 * height * 0.3));
//   };
//   const handleMainMenuPress = (guestId) => {

//     console.log("Main Menu Pressed");
//     navigation.navigate("Home",{guestId:guestId}); // Navigate to Home screen
//   };

//   return (
//     <View style={styles.container}>
//       <Canvas {...panResponder.panHandlers} style={{ flex: 1 }}>
//         <Image image={bg} x={0} y={roadOffset} width={width} height={height} fit="cover" />
//         <Image image={bg} x={0} y={roadOffset - height} width={width} height={height} fit="cover" />
//         <Image image={car1} x={width * 0.3 - carWidth / 2} y={car1Y} width={carWidth} height={carHeight} />
//         <Image image={car2} x={width * 0.7 - carWidth / 2} y={car2Y} width={carWidth} height={carHeight} />
//         <Image image={car3} x={width * 0.5 - carWidth / 2} y={car3Y} width={carWidth} height={carHeight} />
//         <Image image={playerCar} x={playerCarX} y={playerCarY} width={playerCarWidth} height={playerCarHeight} />
//       </Canvas>
//       <View style={styles.scoreContainer}>
//         <Text style={styles.scoreText}>Score: {score}</Text>

//       </View>
//       {gameOver && <GameOver guestId={guestId} resetGame={resetGame} score={score} mainMenu={handleMainMenuPress}/>}
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: 'black',
//   },
//   scoreContainer: {
//     position: 'absolute',
//     top: 20,
//     left: 20,
//     flexDirection: 'row',
//     alignItems: 'center',
//   },
//   scoreText: {
//     color: 'white',
//     fontSize: 20,
//     marginRight: 10,
//   },
//   livesText: {
//     color: 'white',
//     fontSize: 20,
//   },
// });

// export default Game;