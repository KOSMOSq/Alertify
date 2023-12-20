import { NavigationContainer } from "@react-navigation/native";
import { onAuthStateChanged } from "firebase/auth";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FIREBASE_AUTH } from "../lib/firebase";
import { clearUser, setUser } from "../store/features/authSlice";
import { clearFolders } from "../store/features/folderSlice";
import AppStack from "./AppStack";
import AuthStack from "./AuthStack";

const Routes = () => {
    const dispatch = useDispatch();
    const user = useSelector(state => state.auth.user);

    const [initializing, setInitializing] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(FIREBASE_AUTH, user => {
            const serializedUser = user
                ? { uid: user.uid, email: user.email }
                : null;
            dispatch(setUser(serializedUser));
            if (initializing) setInitializing(false);
        });

        return () => {
            unsubscribe();
            dispatch(clearFolders());
            dispatch(clearUser());
        };
    }, [dispatch, initializing]);

    if (initializing) return null;

    return (
        <NavigationContainer>
            {user ? <AppStack /> : <AuthStack />}
        </NavigationContainer>
    );
};

export default Routes;
