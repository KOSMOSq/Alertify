import { useNavigation } from "@react-navigation/native";
import * as Notifications from "expo-notifications";
import React, { useEffect, useState } from "react";
import {
    FlatList,
    LogBox,
    Modal,
    SafeAreaView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from "react-native";
import AntDesign from "react-native-vector-icons/AntDesign";
import { useDispatch } from "react-redux";
import { deleteFolderAsync } from "../store/features/folderSlice";

const FakeImage = ({ name, backgroundColor }) => {
    useEffect(() => {
        LogBox.ignoreLogs(["VirtualizedLists should never be nested"]);
    }, []);
    const icon = name.charAt(0).toUpperCase();

    return (
        <View style={[styles.fakeImage, { backgroundColor: backgroundColor }]}>
            <Text style={styles.iconText}>{icon}</Text>
        </View>
    );
};

const FolderItem = ({ item, onLongPress, onPress }) => {
    const { name, color, reminderCount } = item;
    return (
        <TouchableOpacity
            style={styles.folderContainer}
            onLongPress={() => onLongPress(item)}
            onPress={() => onPress(item)}
        >
            <FakeImage name={name} backgroundColor={color.toLowerCase()} />
            <View style={styles.folderInfo}>
                <Text style={styles.folderName}>{name}</Text>
                <View style={styles.folderDetails}>
                    <AntDesign name="filetext1" size={16} color="#666" />
                    <Text style={styles.reminderCount}>{reminderCount}</Text>
                </View>
            </View>
        </TouchableOpacity>
    );
};

const FoldersScreen = ({ data }) => {
    const navigation = useNavigation();
    const dispatch = useDispatch();
    const [selectedFolder, setSelectedFolder] = useState(null);
    const [isModalVisible, setModalVisible] = useState(false);

    const cancelFolderNotifications = async folder => {
        folder.reminders.forEach(async reminder => {
            const notificationId = reminder.notificationId;
            if (notificationId) {
                await Notifications.cancelScheduledNotificationAsync(
                    notificationId
                );
            }
        });
    };

    const handleFolderLongPress = folder => {
        setSelectedFolder(folder);
        setModalVisible(true);
    };

    const handleFolderPress = folder => {
        navigation.navigate("FolderDetailedScreen", {
            folderId: folder.id
        });
    };
    const closeModal = () => {
        setSelectedFolder(null);
        setModalVisible(false);
    };

    const handleDelete = () => {
        cancelFolderNotifications(selectedFolder);
        dispatch(deleteFolderAsync(selectedFolder.id));
        setModalVisible(false);
    };

    const handleEdit = () => {
        navigation.navigate("EditFolderScreen", { selectedFolder });
        setModalVisible(false);
    };

    return (
        <SafeAreaView style={{ flex: 1 }}>
            {data && data.length > 0 ? (
                <FlatList
                    data={data}
                    renderItem={({ item }) => (
                        <FolderItem
                            item={item}
                            onLongPress={handleFolderLongPress}
                            onPress={handleFolderPress}
                        />
                    )}
                    keyExtractor={item => item.name}
                    contentContainerStyle={styles.container}
                    numColumns={2}
                />
            ) : (
                <Text>No data available</Text>
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
                            Folder: {selectedFolder?.name}
                        </Text>
                        <TouchableOpacity onPress={handleDelete}>
                            <Text style={styles.modalOption}>
                                Delete Folder
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={handleEdit}>
                            <Text style={styles.modalOption}>Edit Folder</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={closeModal}>
                            <Text style={styles.cancelButton}>Cancel</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingVertical: 10,
        flexDirection: "col",
        gap: 10
    },
    folderContainer: {
        marginRight: 6,
        flexDirection: "row",
        alignItems: "center",
        padding: 10,
        borderRadius: 10,
        width: "49%",
        aspectRatio: 5 / 3,
        backgroundColor: "#ffffff",
        elevation: 5,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.2,
        shadowRadius: 2
    },
    folderImage: {
        width: 50,
        height: 50,
        borderRadius: 25,
        justifyContent: "center",
        alignItems: "center",
        marginRight: 16
    },
    iconText: {
        fontSize: 24,
        color: "#FFFFFF"
    },
    folderInfo: {
        flex: 1
    },
    folderDetails: {
        flexDirection: "row",
        alignItems: "center",
        marginTop: 8
    },
    reminderCount: {
        marginLeft: 8,
        fontSize: 16
    },
    fakeImage: {
        width: 50,
        height: 50,
        borderRadius: 25,
        justifyContent: "center",
        alignItems: "center",
        marginRight: 16,
        backgroundColor: "green"
    },
    folderName: {
        fontSize: 18,
        color: "#000000",
        fontWeight: "bold"
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
    }
});

export default FoldersScreen;
