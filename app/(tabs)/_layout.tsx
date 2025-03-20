import React from "react";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Tabs } from "expo-router";
import { Image } from "react-native";

import { useClientOnlyValue } from "@/components/useClientOnlyValue";
import CustomHeader from "@/components/CustomHeader";

// You can explore the built-in icon families and icons on the web at https://icons.expo.fyi/
function TabBarIcon(props: {
  name: React.ComponentProps<typeof FontAwesome>["name"];
  color: string;
}) {
  return <FontAwesome size={28} style={{ marginBottom: -3 }} {...props} />;
}

export default function TabLayout() {

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "#048324",
        tabBarStyle: { paddingVertical: 30, height: 64},
        // Disable the static render of the header on web
        // to prevent a hydration error in React Navigation v6.
        headerShown: useClientOnlyValue(false, true),
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color, size }) => (
            <Image
              source={require("../../assets/img/home_icon.png")}
              style={{ width: size, height: size, tintColor: color }}
            />
          ),
          header: () => <CustomHeader />,
        }}
      />
      <Tabs.Screen
        name="summary"
        options={{
          title: "Summary",
          tabBarIcon: ({ color, size }) => (
            <Image
              source={require("../../assets/img/summary_icon.png")}
              style={{ width: size, height: size, tintColor: color }}
            />
          ),
          header: () => <CustomHeader />,
        }}
      />
    </Tabs>
  );
}
