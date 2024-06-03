import React, { useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import * as Linking from "expo-linking";
import { Provider } from "react-redux";
import { store } from "./src/App/Store";
// ==================================================================

import Splash from "./src/Components/Splash";
import googleSignIn from "./src/Components/GmailSignIn";
import Home from "./src/Components/Home";
import Profile from "./src/Components/Profile";
import Score from "./src/Components/Score";
import Setting from "./src/Components/Setting";
import Game from "./src/Components/Game";
import GameOver from "./src/Components/GameOver";
import { MuteProvider } from "./MuteContext";

const Stack = createStackNavigator();
const prefix = Linking.createURL("/");


const App = ({ navigation }) => {
  const linking = {
    prefixes: ["https://game.CarTrafficMania.com", prefix],
    config: {
      screens: {
        Home: "Home",
      },
    },
  };

  console.log("this is linking url: " + linking);
  useEffect(() => {
    const handleDeepLink = (event) => {
      const data = Linking.parse(event.url);
      console.log(data);
      if(data?.guestId){
        navigation.navigate("Home", { isGmailPage: true, guestId: data?.guestId });

      }
    };

    // Listen for incoming links from both cold and warm starts
    Linking.addEventListener("url", handleDeepLink);

    Linking.getInitialURL().then((url) => {
      if (url) {
        handleDeepLink({ url });
      }
    });

    return () => {
      Linking.removeEventListener("url", handleDeepLink);
    };
  }, []);

  return (
    <Provider store={store}>
      <MuteProvider>
        <NavigationContainer linking={linking}>
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
              name="GameOver"
              component={GameOver}
              options={{ headerShown: false }}
            />
          </Stack.Navigator>
        </NavigationContainer>
      </MuteProvider>
    </Provider>
  );
};

export default App;
