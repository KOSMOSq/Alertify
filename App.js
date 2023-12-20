import { StatusBar, StyleSheet, View } from "react-native";
import { Provider } from "react-redux";
import Routes from "./navigation/Routes";
import store from "./store/store";

export default function App() {
    return (
        <Provider store={store}>
            <View style={styles.container}>
                <StatusBar barStyle="auto" backgroundColor="#FFFFFF" />
                <Routes />
            </View>
        </Provider>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#FFFFFF"
    }
});
