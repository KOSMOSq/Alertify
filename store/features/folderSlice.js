import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getAuth } from "firebase/auth";
import {
    addDoc,
    arrayUnion,
    collection,
    deleteDoc,
    doc,
    getDoc,
    getDocs,
    updateDoc
} from "firebase/firestore";
import { FIREBASE_DB } from "../../lib/firebase";

const initialState = {
    folders: [],
    loading: false,
    error: null
};

export const fetchFoldersAsync = createAsyncThunk(
    "folders/fetchFoldersAsync",
    async (_, { dispatch }) => {
        try {
            dispatch(setLoading(true));
            const userId = getAuth().currentUser.uid;

            const userFoldersRef = collection(
                FIREBASE_DB,
                `users/${userId}/folders`
            );

            const querySnapshot = await getDocs(userFoldersRef);

            const folders = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));

            dispatch(setLoading(false));
            dispatch(setFolders(folders));
        } catch (error) {
            dispatch(setLoading(false));
            dispatch(setError(error.message));
        }
    }
);

export const createFolderAsync = createAsyncThunk(
    "folders/createFolderAsync",
    async (folderData, { dispatch }) => {
        try {
            dispatch(setLoading(true));
            const userId = getAuth().currentUser.uid;

            const userFoldersRef = collection(
                FIREBASE_DB,
                `users/${userId}/folders`
            );

            const docRef = await addDoc(userFoldersRef, folderData);

            dispatch(setLoading(false));
            dispatch(createFolder({ id: docRef.id, ...folderData }));
        } catch (error) {
            dispatch(setLoading(false));
            dispatch(setError(error.message));
        }
    }
);

export const deleteFolderAsync = createAsyncThunk(
    "folders/deleteFolderAsync",
    async (folderId, { dispatch }) => {
        try {
            dispatch(setLoading(true));
            const userId = getAuth().currentUser.uid;

            const userFolderDocRef = doc(
                FIREBASE_DB,
                `users/${userId}/folders/${folderId}`
            );

            await deleteDoc(userFolderDocRef);

            dispatch(setLoading(false));
            dispatch(deleteFolderById(folderId));
        } catch (error) {
            dispatch(setLoading(false));
            dispatch(setError(error.message));
        }
    }
);

export const editFolderAsync = createAsyncThunk(
    "folders/editFolderAsync",
    async ({ folderId, updatedFolder }, { dispatch }) => {
        try {
            dispatch(setLoading(true));
            const userId = getAuth().currentUser.uid;

            const userFolderDocRef = doc(
                FIREBASE_DB,
                `users/${userId}/folders/${folderId}`
            );

            await updateDoc(userFolderDocRef, updatedFolder);

            dispatch(setLoading(false));
            dispatch(editFolder({ folderId, updatedFolder }));
        } catch (error) {
            dispatch(setLoading(false));
            dispatch(setError(error.message));
        }
    }
);

export const addReminderAsync = createAsyncThunk(
    "folders/addReminderAsync",
    async ({ folderId, reminder }, { dispatch }) => {
        try {
            console.log(reminder);
            dispatch(setLoading(true));
            const userId = getAuth().currentUser.uid;

            const userFolderDocRef = doc(
                FIREBASE_DB,
                `users/${userId}/folders/${folderId}`
            );

            const userFolderDoc = await getDoc(userFolderDocRef);
            const currentReminderCount =
                userFolderDoc.data().reminderCount || 0;

            await updateDoc(userFolderDocRef, {
                reminders: arrayUnion(reminder),
                reminderCount: currentReminderCount + 1
            });

            dispatch(setLoading(false));
            dispatch(addReminder({ folderId, reminder }));
        } catch (error) {
            dispatch(setLoading(false));
            dispatch(setError(error.message));
        }
    }
);

export const deleteReminderAsync = createAsyncThunk(
    "folders/deleteReminderAsync",
    async ({ folderId, reminderId }, { dispatch }) => {
        try {
            dispatch(setLoading(true));
            const userId = getAuth().currentUser.uid;

            const userFolderDocRef = doc(
                FIREBASE_DB,
                `users/${userId}/folders/${folderId}`
            );

            const userFolderDoc = await getDoc(userFolderDocRef);
            const currentReminders = userFolderDoc.data().reminders || [];

            const updatedReminders = currentReminders.filter(
                reminder => reminder.id !== reminderId
            );

            await updateDoc(userFolderDocRef, {
                reminders: updatedReminders,
                reminderCount: updatedReminders.length
            });

            dispatch(setLoading(false));
            dispatch(deleteReminderById({ folderId, reminderId }));
        } catch (error) {
            dispatch(setLoading(false));
            dispatch(setError(error.message));
        }
    }
);

export const editReminderAsync = createAsyncThunk(
    "folders/editReminderAsync",
    async ({ folderId, reminderId, updatedReminder }, { dispatch }) => {
        try {
            dispatch(setLoading(true));
            const userId = getAuth().currentUser.uid;

            const userFolderDocRef = doc(
                FIREBASE_DB,
                `users/${userId}/folders/${folderId}`
            );

            const userFolderDoc = await getDoc(userFolderDocRef);
            const currentReminders = userFolderDoc.data().reminders || [];

            const reminderIndex = currentReminders.findIndex(
                reminder => reminder.id === reminderId
            );

            if (reminderIndex !== -1) {
                currentReminders[reminderIndex] = {
                    ...currentReminders[reminderIndex],
                    ...updatedReminder
                };

                await updateDoc(userFolderDocRef, {
                    reminders: currentReminders
                });

                dispatch(setLoading(false));
                dispatch(
                    editReminder({ folderId, reminderId, updatedReminder })
                );
            }
        } catch (error) {
            dispatch(setLoading(false));
            dispatch(setError(error.message));
        }
    }
);

export const toggleReminderCompletedAsync = createAsyncThunk(
    "folders/toggleReminderCompletedAsync",
    async ({ folderId, reminderId }, { dispatch }) => {
        try {
            dispatch(setLoading(true));
            const userId = getAuth().currentUser.uid;

            const userFolderDocRef = doc(
                FIREBASE_DB,
                `users/${userId}/folders/${folderId}`
            );

            const userFolderDoc = await getDoc(userFolderDocRef);
            const currentReminders = userFolderDoc.data().reminders || [];

            const reminderIndex = currentReminders.findIndex(
                reminder => reminder.id === reminderId
            );

            if (reminderIndex !== -1) {
                currentReminders[reminderIndex].completed =
                    !currentReminders[reminderIndex].completed;

                await updateDoc(userFolderDocRef, {
                    reminders: currentReminders
                });
                dispatch(setLoading(false));
                dispatch(toggleReminderCompleted({ folderId, reminderId }));
            }
        } catch (error) {
            dispatch(setLoading(false));
            dispatch(setError(error.message));
        }
    }
);

const folderSlice = createSlice({
    name: "folders",
    initialState,
    reducers: {
        clearFolders: state => {
            state.folders = null;
        },
        setFolders: (state, action) => {
            state.folders = action.payload;
            state.loading = false;
            state.error = null;
        },
        createFolder: (state, action) => {
            state.folders.push(action.payload);
        },
        deleteFolderById: (state, action) => {
            const folderIdToDelete = action.payload;
            state.folders = state.folders.filter(
                folder => folder.id !== folderIdToDelete
            );
        },
        editFolder: (state, action) => {
            const { folderId, updatedFolder } = action.payload;
            state.folders = state.folders.map(folder =>
                folder.id === folderId
                    ? { ...folder, ...updatedFolder }
                    : folder
            );
        },
        toggleReminderCompleted: (state, action) => {
            const { folderId, reminderId } = action.payload;
            const folderIndex = state.folders.findIndex(
                folder => folder.id === folderId
            );

            if (folderIndex !== -1) {
                const reminderIndex = state.folders[
                    folderIndex
                ].reminders.findIndex(reminder => reminder.id === reminderId);

                if (reminderIndex !== -1) {
                    state.folders[folderIndex].reminders[
                        reminderIndex
                    ].completed =
                        !state.folders[folderIndex].reminders[reminderIndex]
                            .completed;
                }
            }
        },
        addReminder: (state, action) => {
            const { folderId, reminder } = action.payload;
            const folderIndex = state.folders.findIndex(
                folder => folder.id === folderId
            );

            if (folderIndex !== -1) {
                state.folders[folderIndex].reminders.push(reminder);
                state.folders[folderIndex].reminderCount =
                    state.folders[folderIndex].reminders.length;
            }
        },

        deleteReminderById: (state, action) => {
            const { folderId, reminderId } = action.payload;
            const folderIndex = state.folders.findIndex(
                folder => folder.id === folderId
            );
            if (folderIndex !== -1) {
                state.folders[folderIndex].reminders = state.folders[
                    folderIndex
                ].reminders.filter(reminder => reminder.id !== reminderId);
                state.folders[folderIndex].reminderCount =
                    state.folders[folderIndex].reminders.length;
            }
        },
        editReminder: (state, action) => {
            const { folderId, reminderId, updatedReminder } = action.payload;
            const folderIndex = state.folders.findIndex(
                folder => folder.id === folderId
            );
            if (folderIndex !== -1) {
                const reminderIndex = state.folders[
                    folderIndex
                ].reminders.findIndex(reminder => reminder.id === reminderId);
                if (reminderIndex !== -1) {
                    state.folders[folderIndex].reminders[reminderIndex] = {
                        ...state.folders[folderIndex].reminders[reminderIndex],
                        ...updatedReminder
                    };
                }
            }
        },
        setLoading: (state, action) => {
            state.loading = action.payload;
        },
        setError: (state, action) => {
            state.error = action.payload;
        }
    }
});

export const {
    clearFolders,
    setFolders,
    createFolder,
    deleteFolderById,
    editFolder,
    toggleReminderCompleted,
    addReminder,
    deleteReminderById,
    editReminder,
    setLoading,
    setError
} = folderSlice.actions;
export default folderSlice.reducer;
