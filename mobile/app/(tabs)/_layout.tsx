import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerStyle: { backgroundColor: "#0d0d1a" },
        headerTintColor: "#f8fafc",
        tabBarStyle: {
          backgroundColor: "#0d0d1a",
          borderTopColor: "rgba(255,255,255,0.08)",
          paddingBottom: 4,
        },
        tabBarActiveTintColor: "#6d28d9",
        tabBarInactiveTintColor: "#64748b",
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Dashboard",
          tabBarIcon: ({ color, size }) => <Ionicons name="grid-outline" size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="sites"
        options={{
          title: "Sites",
          tabBarIcon: ({ color, size }) => <Ionicons name="business-outline" size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profil",
          tabBarIcon: ({ color, size }) => <Ionicons name="person-outline" size={size} color={color} />,
        }}
      />
    </Tabs>
  );
}
