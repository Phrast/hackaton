import { useEffect } from "react";
import { useRouter } from "expo-router";
import { View, ActivityIndicator } from "react-native";
import { useAuthStore } from "../store/authStore";

export default function IndexScreen() {
  const router = useRouter();
  const { isAuthenticated, loadFromStorage } = useAuthStore();

  useEffect(() => {
    loadFromStorage().then(() => {
      if (isAuthenticated) {
        router.replace("/(tabs)");
      } else {
        router.replace("/login");
      }
    });
  }, []);

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#0a0a12" }}>
      <ActivityIndicator size="large" color="#6d28d9" />
    </View>
  );
}
