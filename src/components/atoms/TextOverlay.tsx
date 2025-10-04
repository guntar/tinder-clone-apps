import React from "react";
import { StyleSheet, Text, View } from "react-native";

type Props = {
  type: "LIKE" | "NOPE";
};

export const TextOverlay = ({ type }: Props) => {
  const isLike = type === "LIKE";

  return (
    <View style={[styles.container, isLike ? styles.left : styles.right]}>
      <Text style={[styles.text, isLike ? styles.like : styles.nope]}>{type}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { position: "absolute", top: 50, zIndex: 10 },
  left: { left: 30, transform: [{ rotate: "-20deg" }] },
  right: { right: 30, transform: [{ rotate: "20deg" }] },
  text: { fontSize: 48, fontWeight: "bold", borderWidth: 4, paddingHorizontal: 15, paddingVertical: 5, borderRadius: 10 },
  like: { color: "#4ECB71", borderColor: "#4ECB71" },
  nope: { color: "#FF6B6B", borderColor: "#FF6B6B" },
});
