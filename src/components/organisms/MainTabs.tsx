import { Tabs } from "expo-router";
import AnimatedIcon from "../atoms/AnimatedIcon";

export default function MainTabs() {

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          paddingTop: 10,
          paddingBottom: 10,
          height: 90,
          borderTopWidth: 0,
          elevation: 0,
          shadowOpacity: 0,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "",
          tabBarIcon: ({ focused }) => (
            <AnimatedIcon name="flame" focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="liked"
        options={{
          title: "",
          tabBarIcon: ({ focused }) => (
            <AnimatedIcon name="star" focused={focused} />
          ),
        }}
      />
    </Tabs>
  );
}
