import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { StyleSheet, Text } from "react-native";

type Props = {
  name: string;
  age: number;
  distance: number;
};

export const CardInfo = ({ name, age, distance }: Props) => (
  <LinearGradient colors={["transparent", "rgba(0,0,0,0.7)"]} style={styles.info}>
    <Text style={styles.name}>
      {name}, {age}
    </Text>
    <Text style={styles.distance}>{distance.toFixed(1)} km away</Text>
  </LinearGradient>
);

const styles = StyleSheet.create({
  info: { position: "absolute", bottom: 0, left: 0, right: 0, padding: 20, paddingBottom: 50, borderRadius: 20 },
  name: { fontSize: 24, fontWeight: "bold", color: "#fff" },
  distance: { fontSize: 16, color: "#fff", marginTop: 4 },
});
