import { useState } from "react";
import {
  View, Text, TextInput, TouchableOpacity,
  StyleSheet, SafeAreaView, KeyboardAvoidingView, Platform, Alert,
} from "react-native";
import { useRouter } from "expo-router";
import { useAuthStore } from "../store/authStore";
import { authService } from "../services/api";

export default function LoginScreen() {
  const router = useRouter();
  const login = useAuthStore((s) => s.login);
  const [email, setEmail] = useState("admin@capgemini.com");
  const [password, setPassword] = useState("admin123");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Erreur", "Remplissez tous les champs");
      return;
    }
    setLoading(true);
    try {
      const response = await authService.login(email, password);
      await login(response.token, {
        email: response.email,
        firstName: response.firstName,
        lastName: response.lastName,
        role: response.role,
      });
      router.replace("/(tabs)");
    } catch {
      Alert.alert("Erreur", "Email ou mot de passe incorrect");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={styles.inner}>
        {/* Logo */}
        <View style={styles.logoContainer}>
          <View style={styles.logoBox}>
            <Text style={styles.logoIcon}>🌿</Text>
          </View>
          <Text style={styles.title}>CarbonTrack</Text>
          <Text style={styles.subtitle}>Empreinte Carbone Mobile</Text>
        </View>

        {/* Form */}
        <View style={styles.form}>
          <Text style={styles.label}>Email</Text>
          <TextInput
            style={styles.input}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            placeholderTextColor="#555"
          />

          <Text style={styles.label}>Mot de passe</Text>
          <TextInput
            style={styles.input}
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            placeholderTextColor="#555"
          />

          <TouchableOpacity
            style={[styles.button, loading && { opacity: 0.6 }]}
            onPress={handleLogin}
            disabled={loading}
          >
            <Text style={styles.buttonText}>{loading ? "Connexion…" : "Se connecter"}</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0a0a12" },
  inner: { flex: 1, justifyContent: "center", paddingHorizontal: 24 },
  logoContainer: { alignItems: "center", marginBottom: 40 },
  logoBox: {
    width: 64, height: 64, borderRadius: 16,
    backgroundColor: "rgba(109,40,217,0.2)",
    borderWidth: 1, borderColor: "rgba(109,40,217,0.4)",
    justifyContent: "center", alignItems: "center", marginBottom: 12,
  },
  logoIcon: { fontSize: 28 },
  title: { fontSize: 24, fontWeight: "700", color: "#f8fafc" },
  subtitle: { fontSize: 14, color: "#64748b", marginTop: 4 },
  form: { gap: 12 },
  label: { color: "#94a3b8", fontSize: 13, fontWeight: "600", marginBottom: 4 },
  input: {
    backgroundColor: "rgba(255,255,255,0.06)",
    borderWidth: 1, borderColor: "rgba(255,255,255,0.1)",
    borderRadius: 12, padding: 14, color: "#f8fafc", fontSize: 15,
    marginBottom: 8,
  },
  button: {
    backgroundColor: "#6d28d9", borderRadius: 12,
    padding: 16, alignItems: "center", marginTop: 8,
  },
  buttonText: { color: "#fff", fontWeight: "700", fontSize: 16 },
});
