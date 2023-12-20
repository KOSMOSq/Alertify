import React, { useState } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { colors } from "../../constants/colors";

const ColorPalettePicker = ({ onSelectColor }) => {
    const [selectedColor, setSelectedColor] = useState("");

    return (
        <View style={styles.palette}>
            {colors.map((color, index) => (
                <TouchableOpacity
                    key={index}
                    style={[
                        styles.color,
                        { backgroundColor: color },
                        selectedColor === color && styles.selectedColor
                    ]}
                    onPress={() => {
                        setSelectedColor(color);
                        onSelectColor(color);
                    }}
                />
            ))}
        </View>
    );
};

const styles = StyleSheet.create({
    palette: {
        padding: 20,
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "center"
    },
    color: {
        width: 40,
        height: 40,
        margin: 5,
        borderRadius: 20
    },
    selectedColor: {
        borderWidth: 2,
        borderColor: "#666"
    }
});

export default ColorPalettePicker;
