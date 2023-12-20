import { parse } from "date-fns";
import * as Notifications from "expo-notifications";
import React, { useEffect, useState } from "react";
import { Button, StyleSheet, Text, TextInput, View } from "react-native";
import DateTimePicker from "react-native-ui-datepicker";
import { useDispatch, useSelector } from "react-redux";
import { editReminderAsync } from "../store/features/folderSlice";
import { windowHeight } from "../utils/dimensions";

const EditReminderScreen = ({ route, navigation }) => {
    const { folderId, reminderId } = route.params;
    const dispatch = useDispatch();
    const folder = useSelector(state =>
        state.folders.folders.find(folder => folder.id === folderId)
    );
    const reminder = folder?.reminders.find(r => r.id === reminderId);

    useEffect(() => {
        if (reminder) {
            setTitle(reminder.title || "");
            setDescription(reminder.description || "");
            setDateAndTimeTo(reminder.dateAndTimeTo || null);
        }
    }, [reminder]);

    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [dateAndTimeTo, setDateAndTimeTo] = useState(null);

    const handleEditReminder = async () => {
        if (!title || !description || !dateAndTimeTo) {
            alert("Please enter title, description, date & time");
            return;
        }

        if (reminder?.notificationId) {
            await Notifications.cancelScheduledNotificationAsync(
                reminder.notificationId
            );
        }

        const updatedNotification =
            await Notifications.scheduleNotificationAsync({
                content: {
                    title: title,
                    body: description,
                    data: { data: "goes here" }
                },
                trigger: {
                    date: parse(dateAndTimeTo, "yyyy-MM-dd HH:mm", new Date())
                },
                identifier: reminder.notificationId
            });

        const updatedReminder = {
            id: reminderId,
            title,
            description,
            completed: false,
            dateAndTimeTo,
            notificationId: updatedNotification
        };

        dispatch(
            editReminderAsync({
                reminderId: reminderId,
                folderId: folderId,
                updatedReminder: updatedReminder
            })
        );

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

            <Button title="Edit Reminder" onPress={handleEditReminder} />
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

export default EditReminderScreen;
