import { useNavigation } from "@react-navigation/native";
import { parse } from "date-fns";
import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import React, { useEffect, useRef, useState } from "react";
import {
    Platform,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from "react-native";
import AntDesign from "react-native-vector-icons/AntDesign";
import { useDispatch, useSelector } from "react-redux";
import FoldersScreen from "../components/Folder";
import SearchBar from "../components/SearchBar";
import { fetchFoldersAsync } from "../store/features/folderSlice";
import { windowHeight, windowWidth } from "../utils/dimensions";
import ReminderElasticSearch from "./ReminderElasticSearch";

Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowAlert: true,
        shouldSetBadge: true,
        vibrationPattern: [0, 250, 250, 250]
    })
});

const HomeScreen = () => {
    const navigation = useNavigation();
    const dispatch = useDispatch();

    const [newFolderName, setNewFolderName] = useState("");
    const [searchQuery, setSearchQuery] = useState("");
    const [filteredReminders, setFilteredReminders] = useState([]);

    const foldersData = useSelector(state => state.folders.folders);
    const { folders, loading, error } = useSelector(state => state.folders);

    const handleClear = () => {
        setSearchQuery("");
    };

    const handleChange = query => {
        setSearchQuery(query);
        console.log(query);

        const newFilteredReminders = foldersData
            .flatMap(folder => folder.reminders)
            .filter(
                reminder =>
                    reminder.title
                        .toLowerCase()
                        .includes(query.toLowerCase()) ||
                    reminder.description
                        .toLowerCase()
                        .includes(query.toLowerCase())
            );

        console.log(newFilteredReminders);
        setFilteredReminders(newFilteredReminders);
    };

    useEffect(() => {
        dispatch(fetchFoldersAsync());
    }, [dispatch]);

    useEffect(() => {
        if (folders) {
            setNotificationsForAllReminders();
        }
    }, [folders]);

    const setNotificationsForAllReminders = async () => {
        for (const folder of folders) {
            for (const reminder of folder.reminders) {
                const {
                    title,
                    description,
                    dateAndTimeTo,
                    notificationId,
                    completed
                } = reminder;

                const selectedDateTime = parse(
                    dateAndTimeTo,
                    "yyyy-MM-dd HH:mm",
                    new Date()
                );

                const timeDifference = selectedDateTime.getTime() - Date.now();
                if (completed != true) {
                    if (timeDifference > 0) {
                        await Notifications.scheduleNotificationAsync({
                            content: {
                                title: title,
                                body: description
                            },
                            trigger: { seconds: timeDifference / 1000 },
                            identifier: notificationId
                        });
                    }
                }
            }
        }
    };

    const addFolder = () => {
        const newFolder = {
            name: newFolderName,
            color: "#ff00ff",
            reminderCount: 0
        };
        setAddFolderModalVisible(false);
        setNewFolderName("");
        dispatch(addFolder(newFolder));
    };

    const [expoPushToken, setExpoPushToken] = useState("");
    const [notification, setNotification] = useState(false);
    const notificationListener = useRef();
    const responseListener = useRef();

    useEffect(() => {
        registerForPushNotificationsAsync().then(token =>
            setExpoPushToken(token)
        );

        notificationListener.current =
            Notifications.addNotificationReceivedListener(notification => {
                setNotification(notification);
            });

        responseListener.current =
            Notifications.addNotificationResponseReceivedListener(response => {
                console.log(response);
            });

        return () => {
            Notifications.removeNotificationSubscription(
                notificationListener.current
            );
            Notifications.removeNotificationSubscription(
                responseListener.current
            );
        };
    }, []);

    if (loading) {
        return (
            <View style={styles.container}>
                <Text style={styles.statusText}>Loading...</Text>
            </View>
        );
    }

    if (error) {
        return (
            <View style={styles.container}>
                <Text style={styles.statusText}>Error: {error}</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <SearchBar
                searchQuery={searchQuery}
                handleClear={handleClear}
                handleChange={handleChange}
            />
            <ScrollView>
                <SafeAreaView>
                    {searchQuery?.length > 0 ? (
                        <ReminderElasticSearch
                            filteredReminders={filteredReminders}
                        />
                    ) : foldersData?.length > 0 ? (
                        <FoldersScreen data={foldersData} />
                    ) : (
                        <Text style={styles.statusText}>
                            No folders found. Add some.
                        </Text>
                    )}
                </SafeAreaView>
            </ScrollView>
            <View style={styles.buttonActionGroup}>
                <TouchableOpacity
                    style={[styles.button, styles.newFolderButton]}
                    onPress={() => {
                        navigation.navigate("AddFolderScreen");
                    }}
                >
                    <AntDesign name="addfolder" size={25} color="#0F0F0F" />
                    <Text style={styles.buttonText}>New Folder</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

async function registerForPushNotificationsAsync() {
    let token;

    if (Platform.OS === "android") {
        await Notifications.setNotificationChannelAsync("default", {
            name: "default",
            importance: Notifications.AndroidImportance.MAX,
            vibrationPattern: [0, 250, 250, 250],
            lightColor: "#FF231F7C"
        });
    }

    if (Device.isDevice) {
        const { status: existingStatus } =
            await Notifications.getPermissionsAsync();
        let finalStatus = existingStatus;
        if (existingStatus !== "granted") {
            const { status } = await Notifications.requestPermissionsAsync();
            finalStatus = status;
        }
        if (finalStatus !== "granted") {
            alert("Failed to get push token for push notification!");
            return;
        }
        token = (await Notifications.getExpoPushTokenAsync()).data;
    } else {
        alert("Must use physical device for Push Notifications");
    }

    return token;
}

const styles = StyleSheet.create({
    statusText: {
        fontSize: 16,
        paddingTop: windowHeight / 3,
        textAlign: "center",
        marginTop: 20,
        color: "#666"
    },
    container: {
        flex: 1,
        position: "relative",
        backgroundColor: "#FFFFFF",
        padding: 10
    },
    button: {
        position: "absolute",
        flex: 1,
        flexDirection: "row",
        gap: 10
    },
    buttonText: {
        fontSize: 16
    },
    newReminderButton: {
        left: windowWidth / 20,
        bottom: windowHeight / 25
    },
    newFolderButton: {
        marginRight: 20,
        right: windowWidth / 20,
        bottom: windowHeight / 25
    },

    buttonActionGroup: {
        backgroundColor: "rgba(255, 255, 255, 0.8)",
        height: 80,
        width: windowWidth,
        paddingLeft: 40,
        bottom: 0
    }
});

export default HomeScreen;
