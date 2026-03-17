import { useEffect, useState } from "react";
import { View, Text, StyleSheet, ScrollView, RefreshControl } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { sitesService } from "../../services/api";

interface Site {
  id: number;
  name: string;
  city?: string;
  surfaceM2?: number;
  employeesCount?: number;
  latestCalculation?: { totalCo2Kg: number; co2PerM2?: number } | null;
}

function formatCO2(kg: number): string {
  if (kg >= 1_000_000) return `${(kg / 1_000_000).toFixed(1)} MtCO₂e`;
  if (kg >= 1_000) return `${(kg / 1_000).toFixed(1)} tCO₂e`;
  return `${kg.toFixed(0)} kgCO₂e`;
}

function KpiCard({ title, value, color }: { title: string; value: string; color: string }) {
  return (
    <View style={[styles.kpiCard, { borderColor: color + "40" }]}>
      <Text style={[styles.kpiValue, { color }]}>{value}</Text>
      <Text style={styles.kpiTitle}>{title}</Text>
    </View>
  );
}

export default function DashboardScreen() {
  const [sites, setSites] = useState<Site[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const load = async () => {
    try {
      const data = await sitesService.findAll();
      setSites(data.content ?? []);
    } catch {}
  };

  useEffect(() => { load(); }, []);

  const onRefresh = async () => { setRefreshing(true); await load(); setRefreshing(false); };

  const sitesWithCalc = sites.filter((s) => s.latestCalculation);
  const totalCo2 = sitesWithCalc.reduce((sum, s) => sum + (s.latestCalculation?.totalCo2Kg ?? 0), 0);
  const totalEmployees = sites.reduce((sum, s) => sum + (s.employeesCount ?? 0), 0);

  return (
    <SafeAreaView style={styles.container} edges={["bottom"]}>
      <ScrollView
        contentContainerStyle={styles.scroll}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#6d28d9" />}
      >
        <Text style={styles.heading}>Dashboard</Text>

        <View style={styles.kpiRow}>
          <KpiCard title="CO₂ Total" value={formatCO2(totalCo2)} color="#6d28d9" />
          <KpiCard title="Sites" value={String(sites.length)} color="#16a34a" />
        </View>
        <View style={styles.kpiRow}>
          <KpiCard title="Employés" value={totalEmployees.toLocaleString("fr-FR")} color="#0ea5e9" />
          <KpiCard title="Calculés" value={String(sitesWithCalc.length)} color="#f59e0b" />
        </View>

        <Text style={styles.sectionTitle}>Sites récents</Text>
        {sites.slice(0, 5).map((site) => (
          <View key={site.id} style={styles.siteRow}>
            <View>
              <Text style={styles.siteName}>{site.name}</Text>
              {site.city && <Text style={styles.siteCity}>{site.city}</Text>}
            </View>
            {site.latestCalculation ? (
              <Text style={styles.siteCo2}>{formatCO2(site.latestCalculation.totalCo2Kg)}</Text>
            ) : (
              <Text style={styles.sitePending}>Non calculé</Text>
            )}
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0a0a12" },
  scroll: { padding: 16 },
  heading: { fontSize: 22, fontWeight: "700", color: "#f8fafc", marginBottom: 16 },
  kpiRow: { flexDirection: "row", gap: 12, marginBottom: 12 },
  kpiCard: {
    flex: 1, backgroundColor: "rgba(255,255,255,0.04)",
    borderWidth: 1, borderRadius: 16, padding: 16, alignItems: "center",
  },
  kpiValue: { fontSize: 20, fontWeight: "700" },
  kpiTitle: { fontSize: 12, color: "#64748b", marginTop: 4, textAlign: "center" },
  sectionTitle: { fontSize: 16, fontWeight: "600", color: "#f8fafc", marginTop: 8, marginBottom: 12 },
  siteRow: {
    flexDirection: "row", justifyContent: "space-between", alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.04)", borderRadius: 12,
    padding: 14, marginBottom: 8,
  },
  siteName: { fontSize: 14, fontWeight: "600", color: "#f8fafc" },
  siteCity: { fontSize: 12, color: "#64748b", marginTop: 2 },
  siteCo2: { fontSize: 13, fontWeight: "700", color: "#6d28d9" },
  sitePending: { fontSize: 12, color: "#64748b" },
});
