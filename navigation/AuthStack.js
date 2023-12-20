import AsyncStorage from "@react-native-async-storage/async-storage";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useEffect, useState } from "react";
import LoginScreen from "../screens/LoginScreen";
import OnBoardingScreen from "../screens/OnBoardingScreen";
import RegisterScreen from "../screens/RegisterScreen";

const Stack = createNativeStackNavigator();

const AuthStack = () => {
    const [isFirstTime, setIsFirstTime] = useState(null);

    useEffect(() => {
        checkFirstTimeUser();
    }, []);

    const checkFirstTimeUser = async () => {
        try {
            const isFirstTimeUser = await AsyncStorage.getItem(
                "isFirstTimeUser"
            );
            if (isFirstTimeUser === null) {
                await AsyncStorage.setItem("isFirstTimeUser", "false");
                setIsFirstTime(true);
            } else {
                setIsFirstTime(false);
            }
        } catch (error) {
            console.error(error);
        }
    };

    if (isFirstTime === null) {
        return null;
    }

    return (
        <Stack.Navigator>
            {isFirstTime ? (
                <Stack.Screen
                    name="OnBoardingScreen"
                    component={OnBoardingScreen}
                    options={{ headerShown: false }}
                />
            ) : null}
            <Stack.Screen
                name="LoginScreen"
                component={LoginScreen}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="RegisterScreen"
                component={RegisterScreen}
                options={{ headerShown: false }}
            />
        </Stack.Navigator>
    );
};

export default AuthStack;
