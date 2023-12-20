import { Image, StyleSheet } from "react-native";
import Onboarding from "react-native-onboarding-swiper";

const OnBoardingScreen = ({ navigation }) => {
    return (
        <Onboarding
            onSkip={() => {
                navigation.replace("LoginScreen");
            }}
            onDone={() => {
                navigation.replace("LoginScreen");
            }}
            pages={[
                {
                    backgroundColor: "#fff",
                    image: (
                        <Image
                            style={styles.imageContainer}
                            source={require("../assets/create.png")}
                        />
                    ),
                    title: "Add reminders",
                    subtitle:
                        "Create reminders so you don’t forget about important things"
                },
                {
                    backgroundColor: "#fff",
                    image: (
                        <Image
                            style={styles.imageContainer}
                            source={require("../assets/remind.png")}
                        />
                    ),
                    title: "Follow reminders",
                    subtitle: "Make notes and we will remind you of them"
                },
                {
                    backgroundColor: "#fff",
                    image: (
                        <Image
                            style={styles.imageContainer}
                            source={require("../assets/productive.png")}
                        />
                    ),
                    title: "Be productive",
                    subtitle: "Divide your time correctly with ALERTIFY"
                }
            ]}
        />
    );
};

const styles = StyleSheet.create({
    imageContainer: {
        width: 400,
        height: 500,
        objectFit: "contain"
    }
});

export default OnBoardingScreen;
