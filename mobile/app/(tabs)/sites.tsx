import { useEffect, useState, useCallback } from "react";
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  RefreshControl, Modal, TextInput, Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { sitesService } from "../../services/api";

interface Site {
  id: number;
  name: string;
  city?: string;
  surfaceM2?: number;
  employeesCount?: number;
  annualEnergyKwh?: number;
  latestCalculation?: { totalCo2Kg: number } | null;
}

function formatCO2(kg?: number | null): string {
  if (kg == null) return "—";
  if (kg >= 1_000_000) return `${(kg / 1_000_000).toFixed(1)} MtCO₂e`;
  if (kg >= 1_000) return `${(kg / 1_000).toFixed(1)} tCO₂e`;
  return `${kg.toFixed(0)} kgCO₂e`;
}

export default function SitesScreen() {
  const [sites, setSites] = useState<Site[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [form, setForm] = useState({ name: "", city: "", surfaceM2: "", employeesCount: "", annualEnergyKwh: "" });
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    try {
      const data = await sitesService.findAll();
      setSites(data.content ?? []);
    } catch {}
  }, []);

  useEffect(() => { load(); }, [load]);

  const onRefresh = async () => { setRefreshing(true); await load(); setRefreshing(false); };

  const handleCalculate = async (siteId: number) => {
    try {
      await sitesService.calculate(siteId);
      Alert.alert("Succès", "Calcul effectué !");
      load();
    } catch {
      Alert.alert("Erreur", "Impossible de calculer");
    }
  };

  const handleCreate = async () => {
    if (!form.name.trim()) { Alert.alert("Erreur", "Nom requis"); return; }
    setSaving(true);
    try {
      await sitesService.create({
        name: form.name.trim(),
        city: form.city.trim() || undefined,
        surfaceM2: form.surfaceM2 ? Number(form.surfaceM2) : undefined,
        employeesCount: form.employeesCount ? Number(form.employeesCount) : undefined,
        annualEnergyKwh: form.annualEnergyKwh ? Number(form.annualEnergyKwh) : undefined,
      });
      setModalVisible(false);
      setForm({ name: "", city: "", surfaceM2: "", employeesCount: "", annualEnergyKwh: "" });
      load();
    } catch {
      Alert.alert("Erreur", "Impossible de créer le site");
    } finally {
      setSaving(false);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={["bottom"]}>
      <ScrollView
        contentContainerStyle={styles.scroll}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#6d28d9" />}
      >
        <View style={styles.header}>
          <Text style={styles.heading}>Sites ({sites.length})</Text>
          <TouchableOpacity style={styles.addBtn} onPress={() => setModalVisible(true)}>
            <Ionicons name="add" size={20} color="#fff" />
          </TouchableOpacity>
        </View>

        {sites.map((site) => (
          <View key={site.id} style={styles.card}>
            <View style={styles.cardHeader}>
              <View>
                <Text style={styles.siteName}>{site.name}</Text>
                {site.city && <Text style={styles.siteCity}>{site.city}</Text>}
              </View>
              <TouchableOpacity style={styles.calcBtn} onPress={() => handleCalculate(site.id)}>
                <Ionicons name="calculator-outline" size={16} color="#6d28d9" />
              </TouchableOpacity>
            </View>

            <View style={styles.statsRow}>
              {site.surfaceM2 && (
                <View style={styles.stat}>
                  <Text style={styles.statLabel}>Surface</Text>
                  <Text style={styles.statValue}>{site.surfaceM2.toLocaleString("fr-FR")} m²</Text>
                </View>
              )}
              {site.employeesCount && (
                <View style={styles.stat}>
                  <Text style={styles.statLabel}>Employés</Text>
                  <Text style={styles.statValue}>{site.employeesCount.toLocaleString("fr-FR")}</Text>
                </View>
              )}
            </View>

            {site.latestCalculation && (
              <View style={styles.co2Badge}>
                <Text style={styles.co2Text}>{formatCO2(site.latestCalculation.totalCo2Kg)}</Text>
              </View>
            )}
          </View>
        ))}
      </ScrollView>

      {/* Create site modal */}
      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Nouveau site</Text>
            {[
              { label: "Nom *", key: "name", placeholder: "Capgemini Rennes", keyboard: "default" },
              { label: "Ville", key: "city", placeholder: "Rennes", keyboard: "default" },
              { label: "Surface (m²)", key: "surfaceM2", placeholder: "11771", keyboard: "numeric" },
              { label: "Employés", key: "employeesCount", placeholder: "1800", keyboard: "numeric" },
              { label: "Énergie (kWh/an)", key: "annualEnergyKwh", placeholder: "1840000", keyboard: "numeric" },
            ].map(({ label, key, placeholder, keyboard }) => (
              <View key={key} style={styles.fieldGroup}>
                <Text style={styles.fieldLabel}>{label}</Text>
                <TextInput
                  style={styles.textInput}
                  placeholder={placeholder}
                  placeholderTextColor="#555"
                  keyboardType={keyboard as "default" | "numeric"}
                  value={form[key as keyof typeof form]}
                  onChangeText={(v) => setForm((p) => ({ ...p, [key]: v }))}
                />
              </View>
            ))}

            <View style={styles.modalActions}>
              <TouchableOpacity style={styles.cancelBtn} onPress={() => setModalVisible(false)}>
                <Text style={styles.cancelText}>Annuler</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.saveBtn, saving && { opacity: 0.6 }]}
                onPress={handleCreate}
                disabled={saving}
              >
                <Text style={styles.saveText}>{saving ? "Création…" : "Créer"}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0a0a12" },
  scroll: { padding: 16 },
  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 16 },
  heading: { fontSize: 22, fontWeight: "700", color: "#f8fafc" },
  addBtn: { backgroundColor: "#6d28d9", borderRadius: 10, padding: 8 },
  card: {
    backgroundColor: "rgba(255,255,255,0.04)",
    borderWidth: 1, borderColor: "rgba(255,255,255,0.08)",
    borderRadius: 16, padding: 14, marginBottom: 10,
  },
  cardHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 },
  siteName: { fontSize: 15, fontWeight: "600", color: "#f8fafc" },
  siteCity: { fontSize: 12, color: "#64748b", marginTop: 2 },
  calcBtn: {
    borderWidth: 1, borderColor: "rgba(109,40,217,0.4)",
    borderRadius: 8, padding: 8, backgroundColor: "rgba(109,40,217,0.1)",
  },
  statsRow: { flexDirection: "row", gap: 12, marginBottom: 8 },
  stat: { backgroundColor: "rgba(255,255,255,0.05)", borderRadius: 8, padding: 8, flex: 1 },
  statLabel: { fontSize: 10, color: "#64748b" },
  statValue: { fontSize: 13, fontWeight: "600", color: "#f8fafc", marginTop: 2 },
  co2Badge: {
    backgroundColor: "rgba(109,40,217,0.15)", borderRadius: 8,
    padding: 8, borderWidth: 1, borderColor: "rgba(109,40,217,0.3)",
  },
  co2Text: { fontSize: 14, fontWeight: "700", color: "#6d28d9", textAlign: "center" },
  modalOverlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.7)", justifyContent: "flex-end" },
  modalContent: {
    backgroundColor: "#13131f", borderTopLeftRadius: 24, borderTopRightRadius: 24,
    padding: 24, borderWidth: 1, borderColor: "rgba(255,255,255,0.1)",
  },
  modalTitle: { fontSize: 18, fontWeight: "700", color: "#f8fafc", marginBottom: 16 },
  fieldGroup: { marginBottom: 12 },
  fieldLabel: { fontSize: 13, color: "#94a3b8", fontWeight: "600", marginBottom: 6 },
  textInput: {
    backgroundColor: "rgba(255,255,255,0.06)", borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)", borderRadius: 12,
    padding: 12, color: "#f8fafc", fontSize: 15,
  },
  modalActions: { flexDirection: "row", gap: 12, marginTop: 8 },
  cancelBtn: {
    flex: 1, backgroundColor: "rgba(255,255,255,0.06)",
    borderRadius: 12, padding: 14, alignItems: "center",
  },
  cancelText: { color: "#94a3b8", fontWeight: "600" },
  saveBtn: { flex: 1, backgroundColor: "#6d28d9", borderRadius: 12, padding: 14, alignItems: "center" },
  saveText: { color: "#fff", fontWeight: "700" },
});
