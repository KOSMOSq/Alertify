import React, { useEffect, useState } from "react";
import { Button, StyleSheet, Text, TextInput, View } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import ColorPalettePicker from "../components/ColorPalettePicker/ColorPalettePicker";
import { editFolderAsync } from "../store/features/folderSlice";
import { windowHeight } from "../utils/dimensions";

const EditFolderScreen = ({ route, navigation }) => {
    const { selectedFolder } = route.params;
    const [folderName, setFolderName] = useState("");
    const [selectedColor, setSelectedColor] = useState("#FF463A");

    useEffect(() => {
        if (!folderName) {
            setFolderName(selectedFolder.name);
            setSelectedColor(selectedFolder.color);
        }
    }, [folderName, selectedFolder.name, selectedFolder.color]);

    const dispatch = useDispatch();

    const handleEditFolder = () => {
        if (!folderName || !selectedColor) {
            alert("Please enter folder name and color");
            return;
        }
        const newFolder = {
            name: folderName,
            color: selectedColor,
            reminderCount: selectedFolder.reminderCount
        };
        dispatch(
            editFolderAsync({
                folderId: selectedFolder.id,
                updatedFolder: newFolder
            })
        );
        navigation.navigate("HomeScreen");
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
            <Text style={styles.label}>Folder Name:</Text>
            <TextInput
                style={styles.input}
                value={folderName}
                onChangeText={text => setFolderName(text)}
                placeholder="Enter folder name"
            />
            <Text style={styles.label}>Choose Color:</Text>
            <ColorPalettePicker
                onSelectColor={color => setSelectedColor(color)}
            />
            <Button title="Edit Folder" onPress={handleEditFolder} />
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
        borderColor: "grey",
        borderWidth: 1,
        marginBottom: 15,
        paddingHorizontal: 10
    },
    colorPicker: {
        height: 200,
        marginBottom: 15
    },
    statusText: {
        fontSize: 16,
        paddingTop: windowHeight / 3,
        textAlign: "center",
        marginTop: 20,
        color: "#666"
    }
});

export default EditFolderScreen;
