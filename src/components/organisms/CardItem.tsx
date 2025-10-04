import React, { useEffect, useState } from "react";
import {
  Dimensions,
  StyleSheet,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { ButtonCircle } from "../atoms/ButtonCircle";
import { ProgressBar } from "../atoms/ProgressBar";
import { TextOverlay } from "../atoms/TextOverlay";
import { CardImage } from "../molecules/CardImage";
import { CardInfo } from "../molecules/CardInfo";

const { width } = Dimensions.get("window");

export const CardItem = ({
  card,
  cardIndex,
  swipeDirection,
  swiperRef,
  disabled,
}: any) => {
  if (!card) return null;

  const pictures = card.pictures || [];
  const [photoIndex, setPhotoIndex] = useState(0);

  const isTopCard = cardIndex === 0;

  useEffect(() => {
    if (isTopCard) {
      setPhotoIndex(0);
    }
  }, [isTopCard]);

  const handleTap = (event: any) => {
    if (!isTopCard) return;

    const { locationX } = event.nativeEvent;
    const halfWidth = (width * 0.9) / 2;

    if (locationX > halfWidth && photoIndex < pictures.length - 1)
      setPhotoIndex(photoIndex + 1);
    else if (locationX <= halfWidth && photoIndex > 0)
      setPhotoIndex(photoIndex - 1);
  };

  return (
    <View style={styles.card}>
      <TouchableWithoutFeedback onPress={handleTap}>
        <View style={{ flex: 1 }}>
          {pictures.length > 1 && isTopCard && (
            <ProgressBar total={pictures.length} current={photoIndex} />
          )}
          <CardImage uri={pictures[photoIndex]?.path} />
          {isTopCard && swipeDirection && (
            <TextOverlay type={swipeDirection === "left" ? "NOPE" : "LIKE"} />
          )}
          <CardInfo
            name={card.name}
            age={card.age}
            distance={card.distance_km}
          />
        </View>
      </TouchableWithoutFeedback>

      {isTopCard && (
        <View style={styles.buttonsContainer}>
          <ButtonCircle
            icon="close"
            color="gray"
            onPress={() => swiperRef.current?.swipeLeft()}
          />
          {!disabled && (
            <ButtonCircle
              icon="heart"
              color="red"
              onPress={() => swiperRef.current?.swipeRight()}
            />
          )}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    flex: 0.9,
    borderRadius: 20,
    backgroundColor: "#000",
    overflow: "visible",
    elevation: 5,
    marginBottom: 40,
  },
  buttonsContainer: {
    position: "absolute",
    bottom: -25,
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    zIndex: 999,
  },
});
