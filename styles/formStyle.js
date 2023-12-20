import { StyleSheet } from "react-native";

const formStyle = StyleSheet.create({
    container: {
        justifyContent: "center",
        alignItems: "center",
        paddingBottom: 20,
        paddingHorizontal: 20,
        backgroundColor: "#FFFFFF",
        height: "100%"
    },
    logo: {
        height: 150,
        width: 150,
        resizeMode: "cover"
    },
    text: {
        fontSize: 28,
        marginTop: 20,
        marginBottom: 10,
        color: "#051d5f"
    },
    navButton: {
        marginTop: 15
    },
    forgotButton: {
        marginVertical: 20
    },
    navButtonText: {
        fontSize: 18,
        fontWeight: "500",
        color: "#2e64e5"
    }
});

export default formStyle;
