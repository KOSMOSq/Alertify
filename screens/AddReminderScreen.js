import { parse } from "date-fns";
import * as Notifications from "expo-notifications";
import React, { useState } from "react";
import { Button, StyleSheet, Text, TextInput, View } from "react-native";
import DateTimePicker from "react-native-ui-datepicker";
import uuid from "react-native-uuid";
import { useDispatch, useSelector } from "react-redux";
import { addReminderAsync } from "../store/features/folderSlice";
import { windowHeight } from "../utils/dimensions";

const AddReminderScreen = ({ route, navigation }) => {
    const { folderId } = route.params;
    const dispatch = useDispatch();

    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [dateAndTimeTo, setDateAndTimeTo] = useState(null);

    const handleAddReminder = async () => {
        if (!title || !description || !dateAndTimeTo) {
            alert("Please enter title, description, date & time");
            return;
        }

        const selectedDateTime = parse(
            dateAndTimeTo,
            "yyyy-MM-dd HH:mm",
            new Date()
        );

        const timeDifference = selectedDateTime.getTime() - Date.now();

        if (timeDifference < 0) {
            alert("Выбранное время уже прошло!");
            return;
        }

        const notificationRequest =
            await Notifications.scheduleNotificationAsync({
                content: {
                    title: title,
                    body: description
                },
                trigger: { seconds: timeDifference / 1000 }
            });


        let uId = uuid.v4();
        const newReminder = {
            id: uId,
            title,
            description,
            completed: false,
            dateAndTimeTo,
            notificationId: notificationRequest
        };

        dispatch(addReminderAsync({ folderId, reminder: newReminder }));
        navigation.goBack();
    };

    const { loading, error } = useSelector(state => state.folders);

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
            <Text style={styles.label}>Title:</Text>
            <TextInput
                style={styles.input}
                value={title}
                onChangeText={text => setTitle(text)}
                placeholder="Enter title"
            />

            <Text style={styles.label}>Description:</Text>
            <TextInput
                style={[styles.input, styles.multilineInput]}
                multiline={true}
                numberOfLines={4}
                value={description}
                onChangeText={text => setDescription(text)}
                placeholder="Enter description"
            />

            <Text style={styles.label}>Date & Time:</Text>
            <DateTimePicker
                value={dateAndTimeTo}
                onValueChange={date => setDateAndTimeTo(date)}
            />

            <Button title="Add Reminder" onPress={handleAddReminder} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: "#fff"
    },
    label: {
        fontSize: 16,
        marginTop: 10,
        marginBottom: 5
    },
    input: {
        height: 40,
        borderColor: "gray",
        borderWidth: 1,
        marginBottom: 15,
        paddingHorizontal: 10
    },
    multilineInput: {
        height: 100,
        textAlignVertical: "top"
    },
    statusText: {
        fontSize: 16,
        paddingTop: windowHeight / 3,
        textAlign: "center",
        marginTop: 20,
        color: "#666"
    }
});

export default AddReminderScreen;
