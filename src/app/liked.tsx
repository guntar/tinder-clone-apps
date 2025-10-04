import { matcherService } from "@/src/services/matcherService";
import { useFocusEffect } from "@react-navigation/native";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { ActivityIndicator, Image, StyleSheet, Text, View } from "react-native";
import Swiper from "react-native-deck-swiper";
import { CardItem } from "../components/organisms/CardItem";

export default function LikedScreen() {
  const swiperRef = useRef<any>(null);
  const [swipeDirection, setSwipeDirection] = useState<"left" | "right" | null>(
    null
  );

  const [feed, setFeed] = useState<People[]>([]);
  const [lastSeenId, setLastSeenId] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const isFetchingRef = useRef(false);

  const limit = 10;
  const latitude = 12;
  const longitude = 20;

  // Initial load saat pertama kali mount
  useEffect(() => {
    loadInitialLiked();
  }, []);

  // Refetch setiap kali tab di-focus
  useFocusEffect(
    useCallback(() => {
      console.log("👁️ Liked tab focused, refetching...");
      loadInitialLiked();
    }, [])
  );

  const loadInitialLiked = async () => {
    setIsLoading(true);
    try {
      const result = await matcherService.fetchLiked({
        limit,
        last_seen_id: 0,
        latitude,
        longitude,
      });

      console.log("📦 Initial liked load:", result.users.length, "users");
      setFeed(result.users);
      setLastSeenId(result.last_seen_id);
      setHasMore(result.users.length === limit);
      setSwipeDirection(null); // Reset swipe direction
    } catch (error) {
      console.error("❌ Error loading liked users:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadMoreLiked = async () => {
    if (isFetchingRef.current || isLoadingMore || !hasMore) {
      console.log("⏭️ Skip fetch:", {
        isFetching: isFetchingRef.current,
        isLoadingMore,
        hasMore,
      });
      return;
    }

    isFetchingRef.current = true;
    setIsLoadingMore(true);

    console.log("🔄 Fetching more liked with lastSeenId:", lastSeenId);

    try {
      const result = await matcherService.fetchLiked({
        limit,
        last_seen_id: lastSeenId,
        latitude,
        longitude,
      });

      console.log("✅ Fetched", result.users.length, "liked users");
      console.log("🆔 New lastSeenId:", result.last_seen_id);

      if (result.users.length > 0) {
        setFeed((prev) => {
          const existingIds = new Set(prev.map((u) => u.id));
          const newUsers = result.users.filter((u) => !existingIds.has(u.id));

          console.log("➕ Adding", newUsers.length, "unique users");
          console.log(
            "📊 Total feed:",
            prev.length,
            "→",
            prev.length + newUsers.length
          );

          return [...prev, ...newUsers];
        });

        setLastSeenId(result.last_seen_id);
        setHasMore(result.users.length === limit);
      } else {
        setHasMore(false);
      }
    } catch (error) {
      console.error("❌ Error loading more liked:", error);
    } finally {
      setIsLoadingMore(false);
      isFetchingRef.current = false;
    }
  };

  const handleSwipe = async (index: number, direction: "left" | "right") => {
    const user = feed[index];
    console.log("[handleSwipe] User:", user);
    console.log(
      "[handleSwipe] Swiped:",
      direction,
      "| User ID:",
      user?.id,
      "| Index:",
      index
    );

    // Reset swipe direction immediately
    setSwipeDirection(null);

    if (user) {
      try {
        if (direction === "left") {
          const response = await matcherService.passUser({ liked: user.id });
          console.log("[handleSwipe] Pass SUCCESS - Response:", response.data);
          console.log("[handleSwipe] Pass status:", response.status);
        } else {
          const response = await matcherService.likeUser({ liked: user.id });
          console.log("[handleSwipe] Like SUCCESS - Response:", response.data);
          console.log("[handleSwipe] Like status:", response.status);
        }
      } catch (error: any) {
        console.error("[handleSwipe] Error:", error.message);
        console.error("[handleSwipe] Error response:", error.response?.data);
        console.error("[handleSwipe] Error status:", error.response?.status);
      }
    }

    // Hapus kartu yang sudah di-swipe dari array
    setFeed((prev) => prev.filter((_, i) => i !== index));

    const cardsLeft = feed.length - 1;
    console.log("[handleSwipe] Cards left:", cardsLeft);

    if (cardsLeft <= 5 && hasMore) {
      console.log("⚠️ Low on cards, loading more...");
      loadMoreLiked();
    }
  };

  if (isLoading) {
    return (
      <View style={styles.container}>
        <View style={styles.centered}>
          <ActivityIndicator size="large" color="#FF6B6B" />
          <Text style={styles.loadingText}>Loading liked profiles...</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <Image
          source={require("../../assets/logos/primary.png")}
          style={styles.logo}
        />
      </View>

      <View style={styles.swiperContainer}>
        {feed.length > 0 ? (
          <Swiper
            key={feed.length}
            ref={swiperRef}
            cards={feed}
            renderCard={(card, cardIndex) =>
              card ? (
                <CardItem
                  card={card}
                  cardIndex={cardIndex}
                  swipeDirection={swipeDirection}
                  swiperRef={swiperRef}
                  disabled={true}
                />
              ) : null
            }
            onSwiping={(x) => {
              if (x > 50) setSwipeDirection("right");
              else if (x < -50) setSwipeDirection("left");
              else setSwipeDirection(null);
            }}
            onSwipedLeft={(index) => handleSwipe(index, "left")}
            onSwipedRight={(index) => handleSwipe(index, "right")}
            cardIndex={0}
            stackSize={3}
            backgroundColor="transparent"
            infinite={false}
            animateCardOpacity
            verticalSwipe={false}
          />
        ) : (
          <View style={styles.centered}>
            <Text style={styles.emptyText}>No liked profiles yet</Text>
            <Text style={styles.emptySubtext}>
              Start swiping right to see profiles here!
            </Text>
          </View>
        )}

        {isLoadingMore && (
          <View style={styles.loadingMore}>
            <ActivityIndicator size="small" color="#fff" />
            <Text style={styles.loadingMoreText}>Loading more...</Text>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  logoContainer: {
    position: "absolute",
    top: 40,
    left: 0,
    right: 0,
    alignItems: "center",
    zIndex: 10,
  },
  logo: { width: 120, height: 70, resizeMode: "contain" },
  swiperContainer: { marginTop: 50, alignItems: "center", flex: 1 },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 40,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: "#666",
  },
  emptyText: {
    fontSize: 20,
    color: "#333",
    fontWeight: "600",
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: "#999",
    textAlign: "center",
  },
  loadingMore: {
    position: "absolute",
    bottom: 80,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.7)",
    padding: 12,
    paddingHorizontal: 16,
    borderRadius: 20,
    gap: 8,
  },
  loadingMoreText: {
    color: "#fff",
    fontSize: 14,
  },
});