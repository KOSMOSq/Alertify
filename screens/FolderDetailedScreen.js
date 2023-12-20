import { useNavigation } from "@react-navigation/native";
import { parse } from "date-fns";
import * as Notifications from "expo-notifications";
import React, { useState } from "react";
import {
    FlatList,
    LayoutAnimation,
    Modal,
    Platform,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    UIManager,
    View
} from "react-native";
import AntDesign from "react-native-vector-icons/AntDesign";
import { useDispatch, useSelector } from "react-redux";
import {
    deleteReminderAsync,
    toggleReminderCompletedAsync
} from "../store/features/folderSlice";
import { windowHeight, windowWidth } from "../utils/dimensions";

if (
    Platform.OS === "android" &&
    UIManager.setLayoutAnimationEnabledExperimental
) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
}

export const ReminderItem = ({ reminder, folderId, onDelete, onEdit }) => {
    console.log("reminder item", reminder);
    const dispatch = useDispatch();
    const [expanded, setExpanded] = useState(false);
    const [isModalVisible, setModalVisible] = useState(false);

    const cancelSpecificNotification = async notificationIdToDelete => {
        await Notifications.cancelScheduledNotificationAsync(
            notificationIdToDelete
        );
    };

    const handleToggleCompleted = async () => {
        const { dateAndTimeTo, completed, notificationId, title, description } =
            reminder;

        if (completed !== true) {
            if (notificationId) {
                try {
                    await Notifications.cancelScheduledNotificationAsync(
                        notificationId
                    );
                } catch (error) {
                    console.error("Error canceling notification:", error);
                }
            }
        } else {
            const selectedDateTime = parse(
                dateAndTimeTo,
                "yyyy-MM-dd HH:mm",
                new Date()
            );

            const timeDifference = selectedDateTime.getTime() - Date.now();

            if (timeDifference > 0) {
                console.log("in ", title);

                try {
                    await Notifications.scheduleNotificationAsync({
                        content: {
                            title: title,
                            body: description
                        },
                        trigger: { seconds: timeDifference / 1000 },
                        identifier: notificationId
                    });
                } catch (error) {
                    console.error("Error scheduling notification:", error);
                }
            }
        }

        dispatch(
            toggleReminderCompletedAsync({
                folderId: folderId,
                reminderId: reminder.id
            })
        );
    };

    const toggleExpand = () => {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        setExpanded(!expanded);
    };

    const openModal = () => {
        setModalVisible(true);
    };

    const closeModal = () => {
        setModalVisible(false);
    };

    const handleDelete = () => {
        closeModal();
        onDelete(reminder.id);
        cancelSpecificNotification(reminder.notificationId);
    };

    const handleEdit = () => {
        closeModal();
        onEdit(reminder.id);
    };

    return (
        <TouchableOpacity
            style={stylesReminder.reminderItem}
            onPress={toggleExpand}
            onLongPress={openModal}
            activeOpacity={0.8}
        >
            <View style={stylesReminder.reminderHeader}>
                <TouchableOpacity onPress={handleToggleCompleted}>
                    {reminder.completed ? (
                        <AntDesign
                            name="checkcircle"
                            size={24}
                            color="#2ecc71"
                        />
                    ) : (
                        <AntDesign
                            name="checkcircleo"
                            size={24}
                            color="#95a5a6"
                        />
                    )}
                </TouchableOpacity>
                <Text style={stylesReminder.reminderTitle}>
                    {reminder.title}
                </Text>
                <Text style={stylesReminder.reminderDate}>
                    {reminder.dateAndTimeTo}
                </Text>
            </View>
            {expanded && (
                <View>
                    <Text style={stylesReminder.reminderDescription}>
                        {reminder.description}
                    </Text>
                </View>
            )}

            <Modal
                visible={isModalVisible}
                transparent={true}
                animationType="slide"
                onRequestClose={closeModal}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>
                            Reminder: {reminder?.title}
                        </Text>
                        <TouchableOpacity onPress={handleDelete}>
                            <Text style={styles.modalOption}>
                                Delete Reminder
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={handleEdit}>
                            <Text style={styles.modalOption}>
                                Edit Reminder
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={closeModal}>
                            <Text style={styles.cancelButton}>Cancel</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </TouchableOpacity>
    );
};

const stylesReminder = StyleSheet.create({
    reminderItem: {
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 5,
        marginVertical: 5,
        padding: 10
    },
    reminderHeader: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 5
    },
    reminderTitle: {
        marginLeft: 10,
        flex: 1
    },
    reminderDescription: {
        marginLeft: 10,
        marginBottom: 5,
        color: "#666"
    },
    reminderDate: {
        marginLeft: 10,
        color: "#666"
    }
});

const FolderDetailedScreen = ({ route }) => {
    const navigation = useNavigation();
    const dispatch = useDispatch();
    const { folderId } = route.params;
    const folder = useSelector(state =>
        state.folders.folders.find(folder => folder.id === folderId)
    );

    const handleDeleteReminder = reminderId => {
        dispatch(deleteReminderAsync({ folderId, reminderId }));
    };

    const handleEditReminder = reminderId => {
        navigation.navigate("EditReminderScreen", {
            folderId: folderId,
            reminderId: reminderId
        });
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
            <Text style={[styles.folderName, { color: folder?.color }]}>
                {folder?.name}
            </Text>
            <ScrollView>
                <SafeAreaView>
                    {folder &&
                    folder.reminders &&
                    folder.reminders.length > 0 ? (
                        <FlatList
                            data={folder.reminders}
                            keyExtractor={item => item.id.toString()}
                            renderItem={({ item }) => (
                                <ReminderItem
                                    reminder={item}
                                    folderId={folder.id}
                                    onDelete={reminderId =>
                                        handleDeleteReminder(reminderId)
                                    }
                                    onEdit={handleEditReminder}
                                />
                            )}
                        />
                    ) : (
                        <Text style={styles.noRemindersText}>
                            No reminders found. Add some.
                        </Text>
                    )}
                </SafeAreaView>
            </ScrollView>

            <View style={styles.buttonActionGroup}>
                <TouchableOpacity
                    style={[styles.button, styles.newReminderButton]}
                    onPress={() => {
                        navigation.navigate("AddReminderScreen", {
                            folderId: folder.id
                        });
                    }}
                >
                    <AntDesign name="pluscircleo" size={25} color="#0F0F0F" />
                    <Text style={styles.buttonText}>New Reminder</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        position: "relative",
        backgroundColor: "#FFFFFF",
        padding: 10
    },
    folderName: {
        padding: 10,
        fontSize: 24,
        fontWeight: "bold",
        marginBottom: 10
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
        marginRight: 20,
        right: windowWidth / 20,
        bottom: windowHeight / 25
    },
    noRemindersText: {
        fontSize: 16,
        paddingTop: windowHeight / 3,
        textAlign: "center",
        marginTop: 20,
        color: "#666"
    },
    buttonActionGroup: {
        backgroundColor: "rgba(255, 255, 255, 0.8)",
        height: 80,
        width: windowWidth,
        paddingLeft: 40,
        bottom: 0
    },

    modalContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(0, 0, 0, 0.5)"
    },
    modalContent: {
        backgroundColor: "#fff",
        borderRadius: 10,
        padding: 20,
        width: 300,
        alignItems: "center"
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: "bold",
        marginBottom: 20
    },
    modalOption: {
        fontSize: 18,
        marginVertical: 10,
        color: "#3498db"
    },
    cancelButton: {
        marginTop: 20,
        color: "#e74c3c",
        fontSize: 18
    },
    statusText: {
        fontSize: 16,
        paddingTop: windowHeight / 3,
        textAlign: "center",
        marginTop: 20,
        color: "#666"
    }
});

export default FolderDetailedScreen;
