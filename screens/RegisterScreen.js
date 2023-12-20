import React, { useState } from "react";
import {
    ActivityIndicator,
    Image,
    KeyboardAvoidingView,
    Text,
    TouchableOpacity
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import FormButton from "../components/FormButton";
import FormInput from "../components/FormInput";
import { signUpUser } from "../store/features/authSlice";
import formStyle from "../styles/formStyle";

const RegisterScreen = ({ navigation }) => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const dispatch = useDispatch();
    const loading = useSelector(state => state.auth.loading);

    const signUp = () => {
        if (!email || !password || !confirmPassword) {
            alert("Please enter email, password, and confirm password.");
            return;
        }

        if (password !== confirmPassword) {
            alert("Password and confirm password do not match.");
            return;
        }

        dispatch(signUpUser(email, password));
    };

    return (
        <KeyboardAvoidingView behavior="padding" style={formStyle.container}>
            <Image
                source={require("../assets/icon.png")}
                style={formStyle.logo}
            />
            <Text style={formStyle.text}>ALERTIFY</Text>

            <FormInput
                labelValue={email}
                onChangeText={userEmail => setEmail(userEmail)}
                placeholderText="Email"
                iconType="user"
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
            />

            <FormInput
                labelValue={password}
                onChangeText={userPassword => setPassword(userPassword)}
                placeholderText="Password"
                iconType="lock"
                secureTextEntry={true}
            />

            <FormInput
                labelValue={confirmPassword}
                onChangeText={userConfirmPassword =>
                    setConfirmPassword(userConfirmPassword)
                }
                placeholderText="Confirm Password"
                iconType="lock"
                secureTextEntry={true}
            />

            {loading ? (
                <ActivityIndicator size="large" color="#0000ff" />
            ) : (
                <FormButton buttonTitle="Sign Up" onPress={signUp} />
            )}

            {/* {Platform.OS !== "ios" ? (
                <WithGoogle
                    buttonTitle="Sign Up with Google"
                    color="#de4d41"
                    backgroundColor="#f5e7ea"
                    onPress={() => alert("With google pressed!")}
                />
            ) : null} */}

            <TouchableOpacity
                style={formStyle.forgotButton}
                onPress={() => navigation.navigate("LoginScreen")}
            >
                <Text style={formStyle.navButtonText}>
                    Have an account? Sign in.
                </Text>
            </TouchableOpacity>
        </KeyboardAvoidingView>
    );
};

export default RegisterScreen;
