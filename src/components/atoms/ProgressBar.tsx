import React from "react";
import { StyleSheet, View } from "react-native";

type Props = {
  total: number;
  current: number;
};

export const ProgressBar = ({ total, current }: Props) => (
  <View style={styles.container}>
    {Array.from({ length: total }).map((_, idx) => (
      <View
        key={idx}
        style={[
          styles.bar,
          { flex: 1, backgroundColor: idx === current ? "#fff" : "rgba(255,255,255,0.4)" },
        ]}
      />
    ))}
  </View>
);

const styles = StyleSheet.create({
  container: { position: "absolute", top: 10, left: 10, right: 10, flexDirection: "row", gap: 4, zIndex: 10 },
  bar: { height: 4, borderRadius: 2, marginHorizontal: 2 },
});
