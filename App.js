import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import * as Linking from 'expo-linking';
import { Provider } from 'react-redux';
import { store } from './src/App/Store';
// ==================================================================

import Splash from "./src/Components/Splash";
import googleSignIn from "./src/Components/GmailSignIn";
import Home from "./src/Components/Home";
import Profile from "./src/Components/Profile";
import Score from "./src/Components/Score";
import Setting from "./src/Components/Setting";
import Game from "./src/Components/Game";
import GameOver from "./src/Components/GameOver";

const Stack = createStackNavigator();
const linking = {
  prefixes: ['CarTrafficMania://', 'https://CarTrafficMania.CarTrafficMania.com'],
  config: {
    screens: {
      Home: 'home',
      googleSignIn: 'googleSignIn',
      // Add other screens as needed
    },
  },
};
const App = () => {
  return (
    <Provider store={store}>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Splash">
          <Stack.Screen
            name="Splash"
            component={Splash}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="googleSignIn"
            component={googleSignIn}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Home"
            component={Home}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Profile"
            component={Profile}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Score"
            component={Score}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Setting"
            component={Setting}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Game"
            component={Game}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="GameOver"
            component={GameOver}
            options={{ headerShown: false }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </Provider>
  );
};

export default App;
