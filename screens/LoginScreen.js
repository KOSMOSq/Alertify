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
import { signInUser } from "../store/features/authSlice";
import formStyle from "../styles/formStyle";

const LoginScreen = ({ navigation }) => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const dispatch = useDispatch();
    const loading = useSelector(state => state.auth.loading);

    const signIn = () => {
        if (!email || !password) {
            alert("Please enter email and password.");
            return;
        }

        dispatch(signInUser(email, password));
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

            {loading ? (
                <ActivityIndicator size="large" color="#0000ff" />
            ) : (
                <FormButton buttonTitle="Sign In" onPress={signIn} />
            )}

            {/* <View>
                <WithGoogle
                    buttonTitle="Sign In with Google"
                    color="#de4d41"
                    backgroundColor="#f5e7ea"
                    onPress={() => alert("With google pressed!")}
                />
            </View> */}

            <TouchableOpacity
                style={formStyle.forgotButton}
                onPress={() => navigation.navigate("RegisterScreen")}
            >
                <Text style={formStyle.navButtonText}>
                    Don't have an account? Create one.
                </Text>
            </TouchableOpacity>
        </KeyboardAvoidingView>
    );
};

export default LoginScreen;
