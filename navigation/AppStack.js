import { useNavigation } from "@react-navigation/native"; // Импортируем useNavigation
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import AntDesign from "react-native-vector-icons/AntDesign";

import { useEffect, useState } from "react";
import AddFolderScreen from "../screens/AddFolderScreen";
import AddReminderScreen from "../screens/AddReminderScreen";
import EditFolderScreen from "../screens/EditFolderScreen";
import EditReminderScreen from "../screens/EditReminderScreen";
import FolderDetailedScreen from "../screens/FolderDetailedScreen";
import HomeScreen from "../screens/HomeScreen";
import SettingsScreen from "../screens/SettingsScreen";
import { windowHeight, windowWidth } from "../utils/dimensions";

const InAppStack = createNativeStackNavigator();

const AppStack = () => {
    const greetings = ["What's up?", "How's your day?", "Any plans for today?"];

    const greetingsByTime = {
        morning: ["Good morning", ...greetings],
        afternoon: ["Good afternoon", ...greetings],
        evening: ["Good evening", ...greetings]
    };

    const [greeting, setGreeting] = useState("");

    useEffect(() => {
        const currentHour = new Date().getHours();
        let timeOfDayGreeting = "";

        if (currentHour >= 5 && currentHour < 12) {
            timeOfDayGreeting = "morning";
        } else if (currentHour >= 12 && currentHour < 18) {
            timeOfDayGreeting = "afternoon";
        } else {
            timeOfDayGreeting = "evening";
        }

        const randomGreeting =
            greetingsByTime[timeOfDayGreeting][
                Math.floor(
                    Math.random() * greetingsByTime[timeOfDayGreeting].length
                )
            ];

        setGreeting(randomGreeting);
    }, []);

    return (
        <InAppStack.Navigator>
            <InAppStack.Screen
                name="HomeScreen"
                component={HomeScreen}
                options={{
                    title: "",
                    headerShadowVisible: false,
                    headerRight: () => {
                        const navigation = useNavigation();
                        return (
                            <TouchableOpacity
                                style={styles.iconContainer}
                                onPress={() =>
                                    navigation.navigate("SettingsScreen")
                                }
                            >
                                <View style={styles.iconWrapper}>
                                    <AntDesign
                                        name="user"
                                        size={20}
                                        color="#0F0F0F"
                                    />
                                </View>
                            </TouchableOpacity>
                        );
                    },
                    headerLeft: () => {
                        return (
                            <TouchableOpacity style={styles.iconContainer}>
                                <Text style={styles.greetingText}>
                                    {greeting}
                                </Text>
                            </TouchableOpacity>
                        );
                    }
                }}
            />
            <InAppStack.Screen
                name="AddReminderScreen"
                component={AddReminderScreen}
                options={{
                    title: "Add Reminder",
                    headerShadowVisible: false
                }}
            />
            <InAppStack.Screen
                name="EditReminderScreen"
                component={EditReminderScreen}
                options={{
                    title: "Edit Reminder",
                    headerShadowVisible: false
                }}
            />
            <InAppStack.Screen
                name="FolderDetailedScreen"
                component={FolderDetailedScreen}
                options={{
                    title: "",
                    headerShadowVisible: false
                }}
            />
            <InAppStack.Screen
                name="AddFolderScreen"
                component={AddFolderScreen}
                options={{
                    title: "Create Folder",
                    headerShadowVisible: false
                }}
            />
            <InAppStack.Screen
                name="EditFolderScreen"
                component={EditFolderScreen}
                options={{
                    title: "Edit Folder",
                    headerShadowVisible: false
                }}
            />
            <InAppStack.Screen
                name="SettingsScreen"
                component={SettingsScreen}
                options={{
                    title: "Settings",
                    headerShadowVisible: false
                }}
            />
        </InAppStack.Navigator>
    );
};

const styles = StyleSheet.create({
    iconContainer: {
        borderRadius: windowHeight / 20
    },
    iconWrapper: {
        aspectRatio: 1,
        width: windowWidth / 9,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#FFFFFF",
        borderRadius: windowHeight / 20,
        borderWidth: 1,
        borderColor: "#CCCCCC"
    },
    greetingText: {
        fontSize: 20
    }
});

export default AppStack;
