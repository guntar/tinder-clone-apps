import React from "react";
import { Image, StyleSheet, View } from "react-native";

type Props = { uri?: string };

export const CardImage = ({ uri }: Props) => {
  return uri ? (
    <Image source={{ uri }} style={styles.image} />
  ) : (
    <View style={[styles.image, { backgroundColor: "#333" }]} />
  );
};

const styles = StyleSheet.create({
  image: { width: "100%", height: "100%", resizeMode: "cover", borderRadius: 20 },
});
