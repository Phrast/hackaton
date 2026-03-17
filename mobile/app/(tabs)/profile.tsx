import { View, Text, StyleSheet, TouchableOpacity, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useAuthStore } from "../../store/authStore";

export default function ProfileScreen() {
  const router = useRouter();
  const { user, logout } = useAuthStore();

  const handleLogout = () => {
    Alert.alert("Déconnexion", "Voulez-vous vous déconnecter ?", [
      { text: "Annuler", style: "cancel" },
      {
        text: "Déconnexion",
        style: "destructive",
        onPress: async () => { await logout(); router.replace("/login"); },
      },
    ]);
  };

  return (
    <SafeAreaView style={styles.container} edges={["bottom"]}>
      <View style={styles.content}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>
            {user?.firstName?.[0]?.toUpperCase() ?? user?.email?.[0]?.toUpperCase() ?? "?"}
          </Text>
        </View>
        <Text style={styles.name}>{user?.firstName} {user?.lastName}</Text>
        <Text style={styles.email}>{user?.email}</Text>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{user?.role ?? "USER"}</Text>
        </View>

        <View style={styles.infoBox}>
          <View style={styles.infoRow}>
            <Ionicons name="leaf-outline" size={20} color="#6d28d9" />
            <Text style={styles.infoText}>CarbonTrack Mobile v1.0</Text>
          </View>
          <View style={styles.infoRow}>
            <Ionicons name="server-outline" size={20} color="#16a34a" />
            <Text style={styles.infoText}>API: {process.env.EXPO_PUBLIC_API_URL ?? "localhost:8080"}</Text>
          </View>
          <View style={styles.infoRow}>
            <Ionicons name="document-text-outline" size={20} color="#0ea5e9" />
            <Text style={styles.infoText}>Facteurs ADEME Base Carbone 2023</Text>
          </View>
        </View>

        <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={20} color="#ef4444" />
          <Text style={styles.logoutText}>Déconnexion</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0a0a12" },
  content: { flex: 1, alignItems: "center", padding: 24, paddingTop: 40 },
  avatar: {
    width: 80, height: 80, borderRadius: 40,
    backgroundColor: "rgba(109,40,217,0.2)",
    borderWidth: 2, borderColor: "rgba(109,40,217,0.5)",
    justifyContent: "center", alignItems: "center", marginBottom: 12,
  },
  avatarText: { fontSize: 32, fontWeight: "700", color: "#6d28d9" },
  name: { fontSize: 20, fontWeight: "700", color: "#f8fafc" },
  email: { fontSize: 14, color: "#64748b", marginTop: 4, marginBottom: 8 },
  badge: {
    backgroundColor: "rgba(109,40,217,0.15)", paddingHorizontal: 12, paddingVertical: 4,
    borderRadius: 20, borderWidth: 1, borderColor: "rgba(109,40,217,0.3)", marginBottom: 24,
  },
  badgeText: { color: "#6d28d9", fontSize: 12, fontWeight: "600" },
  infoBox: {
    width: "100%", backgroundColor: "rgba(255,255,255,0.04)",
    borderRadius: 16, borderWidth: 1, borderColor: "rgba(255,255,255,0.08)",
    padding: 16, gap: 14, marginBottom: 24,
  },
  infoRow: { flexDirection: "row", alignItems: "center", gap: 12 },
  infoText: { color: "#94a3b8", fontSize: 14 },
  logoutBtn: {
    flexDirection: "row", alignItems: "center", gap: 8,
    backgroundColor: "rgba(239,68,68,0.1)",
    borderWidth: 1, borderColor: "rgba(239,68,68,0.2)",
    borderRadius: 12, paddingHorizontal: 20, paddingVertical: 12,
  },
  logoutText: { color: "#ef4444", fontWeight: "600", fontSize: 15 },
});
