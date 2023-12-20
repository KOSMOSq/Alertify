import { FlatList, View } from "react-native";
import { useDispatch } from "react-redux";
import { deleteReminderAsync } from "../store/features/folderSlice";
import { ReminderItem } from "./FolderDetailedScreen";

const ReminderElasticSearch = ({ filteredReminders }) => {
    const dispatch = useDispatch();

    const handleDeleteReminder = reminderId => {
        dispatch(deleteReminderAsync({ folderId, reminderId }));
    };

    const handleEditReminder = reminderId => {
        navigation.navigate("EditReminderScreen", {
            folderId: folderId,
            reminderId: reminderId
        });
    };
    console.log(filteredReminders);
    return (
        <View>
            <FlatList
                data={filteredReminders}
                keyExtractor={item => item.id.toString()}
                renderItem={({ item }) => (
                    <ReminderItem
                        reminder={item}
                        folderId={"xUz8LTpC6pvXodZlQtR8"}
                        onDelete={reminderId =>
                            handleDeleteReminder(reminderId)
                        }
                        onEdit={handleEditReminder}
                    />
                )}
            />
        </View>
    );
};

export default ReminderElasticSearch;
