import React from "react";
import { StyleSheet, TextInput, TouchableOpacity, View } from "react-native";
import AntDesign from "react-native-vector-icons/AntDesign";

const SearchBar = ({ searchQuery, handleClear, handleChange }) => {
    return (
        <View style={styles.searchContainer}>
            <TouchableOpacity>
                <AntDesign
                    name="search1"
                    size={23}
                    color="black"
                    style={styles.searchIcon}
                />
            </TouchableOpacity>
            <TextInput
                style={styles.input}
                placeholder="Search..."
                value={searchQuery}
                onChangeText={text => {
                    handleChange(text);
                }}
            />
            {searchQuery.length > 0 && (
                <TouchableOpacity
                    onPress={handleClear}
                    style={styles.clearButton}
                >
                    <AntDesign name="close" size={20} color="gray" />
                </TouchableOpacity>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    searchContainer: {
        flexDirection: "row",
        alignItems: "center",
        padding: 6,
        borderColor: "gray",
        borderWidth: 1,
        borderRadius: 15
    },
    searchIcon: {
        marginRight: 10,
        color: "gray"
    },
    input: {
        flex: 1,
        height: 20,
        paddingHorizontal: 10
    }
});

export default SearchBar;
