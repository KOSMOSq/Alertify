import React, { useState } from "react";
import { Button, StyleSheet, Text, TextInput, View } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import ColorPalettePicker from "../components/ColorPalettePicker/ColorPalettePicker";
import { createFolderAsync } from "../store/features/folderSlice";
import { windowHeight } from "../utils/dimensions";

const AddFolderScreen = ({ navigation }) => {
    const [folderName, setFolderName] = useState("");
    const [selectedColor, setSelectedColor] = useState("#FF463A");
    const { loading, error } = useSelector(state => state.folders);

    const dispatch = useDispatch();

    const handleAddFolder = () => {
        if (!folderName || !selectedColor) {
            alert("Please enter folder name and color");
            return;
        }
        const newFolder = {
            name: folderName,
            color: selectedColor,
            reminderCount: 0,
            reminders: []
        };
        dispatch(createFolderAsync(newFolder));
        navigation.navigate("HomeScreen");
    };

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
            <Button title="Add Folder" onPress={handleAddFolder} />
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

export default AddFolderScreen;
