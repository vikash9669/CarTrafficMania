// import React, { useState, useRef, useEffect } from 'react';
// import {
//   View,
//   ImageBackground,
//   StyleSheet,
//   Image,
//   TouchableOpacity,
//   Text,
//   StatusBar,
//   TextInput,
//   KeyboardAvoidingView,
//   Platform,
//   Linking,
//   Keyboard,
//   ActivityIndicator,
//   Modal
// } from 'react-native';
// import CheckBox from 'react-native-check-box';
// import { useSelector, useDispatch } from 'react-redux';
// import { signInAsGuest } from '../Features/gameSlice';
// import AsyncStorage from '@react-native-async-storage/async-storage';

// const GuestSignIn = ({ navigation }) => {
//   const [isChecked, setIsChecked] = useState(true);
//   const [name, setName] = useState('');
//   const inputRef = useRef(null);
//   const [flip, setFlip] = useState(false);
//   const [keyboardOpen, setKeyboardOpen] = useState(false);
//   const [showAlert, setShowAlert] = useState(false);
//   const [alertText, setAlertText] = useState('');
//   const dispatch = useDispatch();
//   const { guestSignInLoading, guestSignInData, guestSignInSuccess, guestSignInError } = useSelector(state => state.game);

//   useEffect(() => {
//     const keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', () => {
//       setKeyboardOpen(true);
//     });
//     const keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', () => {
//       setKeyboardOpen(false);
//     });

//     return () => {
//       keyboardDidShowListener.remove();
//       keyboardDidHideListener.remove();
//     };
//   }, []);

//   const handleNameImagePress = () => {
//     setFlip(!flip);
//     if (inputRef.current) {
//       inputRef.current.focus();
//     }
//   };

//   const GuestLogIn = () => {
//     console.log("guestLogIn Pressed");
//     if (isChecked) {
//       dispatch(signInAsGuest({ playerName: name, isChecked: isChecked }))
//     }
//   };

//   const storeGuestId = async (guestId) => {
//     try {
//       await AsyncStorage.setItem('guestId', guestId);
//       navigation.navigate("Home", { guestId: guestId, isGmailPage: false });
//     } catch (error) {
//       console.error('Error storing guest ID:', error);
//     }
//   };
//   const openPrivacyPolicy = () => {
//     const url = "../../assets/privacy and policy.pdf"; // Replace with your PDF URL
//     Linking.openURL(url);
//   };
//   const closeModel = () => {
//     // Reset the game state if needed
//     setShowAlert(false);
//     setName('');
//   };
//   useEffect(() => {
//     if (guestSignInSuccess) {
//       storeGuestId(guestSignInData.user.guestId);
//     }
//     if(guestSignInError){
//       setAlertText('Something Went Wrong');
//       setShowAlert(true);
//     }
//   }, [guestSignInSuccess, guestSignInLoading, guestSignInData, guestSignInError]);

//   return (
//     <KeyboardAvoidingView
//       behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
//       style={styles.container}
//       keyboardVerticalOffset={keyboardOpen ? -150 : 0}
//     >
//       <StatusBar translucent backgroundColor="transparent" />
//       <ImageBackground
//         source={require('../../assets/img/mainbackground.png')}
//         style={styles.backgroundImage}
//       >
//         <View style={styles.bgContainer}>
//           <Image
//             source={require('../../assets/img/wave.png')}
//             style={styles.wave}
//           />
//         </View>
//         <View style={styles.nameImageContainer}>
//           {flip || keyboardOpen ? (
//             <TextInput
//               ref={inputRef}
//               placeholder="Enter your Name"
//               placeholderTextColor="white"
//               style={[styles.inputField, styles.inputFieldFocused]}
//               value={name}
//               onChangeText={(text) => setName(text)}
//             />
//           ) : (
//             <TouchableOpacity onPress={handleNameImagePress}>
//               <Image
//                 source={require('../../assets/img/Name.png')}
//                 style={styles.nameImage}
//               />
//             </TouchableOpacity>
//           )}
//         </View>
//         <View style={styles.privacyContainer}>
//           <Text
//             style={styles.privacyText}
//             onPress={openPrivacyPolicy}
//           >
//             <CheckBox
//               isChecked={isChecked}
//               onClick={() => setIsChecked(!isChecked)}
//               rightText="Privacy Policy"
//               rightTextStyle={{ fontSize: 19, color: 'white', fontWeight: 'bold', textAlign: 'center', marginBottom: 2 }}
//               checkedCheckBoxColor="white"
//               uncheckedCheckBoxColor="red"
//             />
//           </Text>
//         </View>
//         {guestSignInLoading && (
//           <View style={styles.loaderContainer}>
//             <ActivityIndicator size="large" color="white" />
//           </View>
//         )}
//           {showAlert && (
//           <Modal
//             animationType="fade"
//             transparent={true}
//             visible={showAlert}
//             onRequestClose={() => setShowAlert(false)}
//           >
//             <View style={styles.modalContainer}>
//               <View style={styles.modalContent}>
//                 <Text style={styles.alertText}>{alertText}</Text>
//                 <TouchableOpacity onPress={closeModel}>
//                   <Image
//                     source={require('../../assets/img/cross.png')}
//                     style={styles.crossIcon}
//                   />
//                 </TouchableOpacity>
//               </View>
//             </View>
//           </Modal>
//         )}
//         {name.trim() !== '' && !guestSignInLoading && !keyboardOpen && isChecked && (
//           <TouchableOpacity onPress={GuestLogIn} style={styles.buttonContainer2}>
//             <Image
//               source={require('../../assets/img/Continue.png')}
//               style={styles.buttonGoogle}
//             />
//           </TouchableOpacity>
//         )}
//       </ImageBackground>
//     </KeyboardAvoidingView>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//   },
//   backgroundImage: {
//     flex: 1,
//     resizeMode: 'cover',
//     justifyContent: 'center',
//   },
//   bgContainer: {
//     position: 'absolute',
//     top: 0,
//     left: 0,
//     right: 0,
//     bottom: 0,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   wave: {
//     width: 440,
//     height: 460,
//     marginTop: 500,
//     opacity: 0.6,
//   },
//   nameImageContainer: {
//     position: 'absolute',
//     top: '62%', // Adjust this percentage as needed for equal spacing
//     left: '50%',
//     marginLeft: -120,
//   },
//   nameImage: {
//     height: 50,
//     width: 240,
//     resizeMode: 'cover',
//     zIndex: 1,
//   },
//   inputField: {
//     width: 240,
//     height: 50,
//     fontSize: 20,
//     color: 'white',
//     fontWeight: 'bold',
//     textAlign: 'center',
//     backgroundColor: 'red',
//     zIndex: 0,
//     borderWidth: 3,
//     borderColor: 'white',
//     borderRadius: 20,
//   },
//   inputFieldFocused: {
//     zIndex: 1,
//     transform: [{ rotateY: '18deg' }],
//   },
//   privacyContainer: {
//     alignItems: 'center',
//     marginTop: '96%',
//   },
//   privacyText: {
//     fontSize: 20,
//     color: 'white',
//     fontWeight: 'bold',
//     textAlign: 'center',
//     marginBottom: -10,
//     marginTop: 30,
//     marginLeft: -25,
//   },
//   buttonContainer2: {
//     position: 'absolute',
//     bottom: 170,
//     alignSelf: 'center',
//   },
//   buttonGoogle: {
//     height: 50,
//     width: 240,
//     marginLeft: -19,
//     marginBottom: -70,
//   },
//   loaderContainer: {
//     ...StyleSheet.absoluteFillObject,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   modalContainer: {
//     flex: 1,
//     backgroundColor: 'rgba(0, 0, 0, 0.5)',
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   modalContent: {
//     backgroundColor: 'white',
//     padding: 20,
//     borderRadius: 10,
//     alignItems: 'center',
//   },
//   alertText: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     marginBottom: 20,
//     textAlign: 'center',
//   },
//   crossIcon: {
//     width: 20,
//     height: 20,
//     resizeMode: 'contain',
//     marginTop: 10,
//   },
// });

// export default GuestSignIn;
