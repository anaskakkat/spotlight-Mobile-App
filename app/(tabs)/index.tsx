import { Button, Text, TouchableOpacity, View } from "react-native";
import { styles } from "@/styles/auth.styles";
import { useAuth } from "@clerk/clerk-expo";

export default function Index() {
  const { signOut } = useAuth();
  return (
    <View style={styles.container}>
      <Text>Home</Text>

      <TouchableOpacity
        style={{
          backgroundColor: "red",
          padding: 5,
          borderRadius: 5,
          position: "absolute",
          bottom: 50,
          left: 175,
        }}
        onPress={() => {
          signOut();
        }}
      >
        <Text style={{ color: "white" }}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
}
