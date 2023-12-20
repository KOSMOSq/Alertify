import * as Notifications from "expo-notifications";
import { getAuth, signOut } from "firebase/auth";
import React, { useEffect, useState } from "react";
import { Button, Pressable, StyleSheet, Text, View } from "react-native";
import AntDesign from "react-native-vector-icons/AntDesign";
import { useDispatch, useSelector } from "react-redux";
import { clearUser } from "../store/features/authSlice";
import { clearFolders } from "../store/features/folderSlice";
import { windowHeight, windowWidth } from "../utils/dimensions";

const SettingsScreen = () => {
    const dispatch = useDispatch();
    const [mail, setMail] = useState("");
    const userMail = useSelector(state => state.auth.user.email);

    const cancelAllNotifications = async () => {
        await Notifications.cancelAllScheduledNotificationsAsync();
    };

    useEffect(() => {
        setMail(userMail);
    }, [userMail]);

    const handleLogout = async () => {
        const auth = getAuth();

        try {
            await signOut(auth);
            dispatch(clearUser());
            dispatch(clearFolders());
            cancelAllNotifications();
        } catch (error) {
            console.error("Error signing out: ", error.message);
        }
    };

    return (
        <View style={styles.container}>
            <View>
                <Pressable style={styles.iconWrapper}>
                    <AntDesign name="user" size={60} color="#666" />
                </Pressable>
                <Text>{mail}</Text>
            </View>
            <Button title="Logout" onPress={handleLogout} />
        </View>
    );
};

export default SettingsScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#FFFFFF",
        gap: windowHeight / 2
    },
    iconWrapper: {
        aspectRatio: 1,
        width: windowWidth / 3,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#FFFFFF",
        borderRadius: windowHeight / 10,
        borderWidth: 1,
        borderColor: "#CCCCCC",
        marginBottom: 20
    }
});
