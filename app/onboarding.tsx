import { icons } from "@/constants/icons";
import { router } from "expo-router";
import { styled } from "nativewind";
import React, { useRef, useState } from "react";
import {
  Dimensions,
  FlatList,
  Image,
  Pressable,
  Text,
  View,
} from "react-native";
import { SafeAreaView as RNSafeAreaView } from "react-native-safe-area-context";

const SafeAreaView = styled(RNSafeAreaView);
const { width: SCREEN_WIDTH } = Dimensions.get("window");

// ── Guide steps ───────────────────────────────────────────────────────────
const STEPS = [
  {
    id: "1",
    icon: icons.wallet,
    color: "#f5c542",
    title: "Track Your Subscriptions",
    description:
      "See all your active subscriptions in one place. Tap any card to expand it and view payment info, plan details, and renewal dates.",
  },
  {
    id: "2",
    icon: icons.add,
    color: "#b8d4e3",
    title: "Add a Subscription",
    description:
      "Tap the + icon on the home screen to add a new subscription. Fill in the name, price, billing cycle, and category to keep everything organised.",
  },
  {
    id: "3",
    icon: icons.activity,
    color: "#b8e8d0",
    title: "View Insights",
    description:
      "Head to the Insights tab to see your weekly spending chart, total expenses for the month, and a full history of your subscriptions.",
  },
  {
    id: "4",
    icon: icons.home,
    color: "#e8def8",
    title: "Upcoming Renewals",
    description:
      "The Home screen shows subscriptions renewing in the next 7 days so you're never caught off guard by an unexpected charge.",
  },
  {
    id: "5",
    icon: icons.wallet,
    color: "#f5c542",
    title: "Cancel Anytime",
    description:
      "On the Subscriptions page, expand any card and tap Cancel Subscription to remove it from your tracker instantly.",
  },
];

// ── Dot indicator ─────────────────────────────────────────────────────────
const Dots = ({ total, active }: { total: number; active: number }) => (
  <View style={{ flexDirection: "row", gap: 6, alignItems: "center" }}>
    {Array.from({ length: total }).map((_, i) => (
      <View
        key={i}
        style={{
          width: i === active ? 20 : 8,
          height: 8,
          borderRadius: 4,
          backgroundColor: i === active ? "#1a1a1a" : "#d0cfc9",
        }}
      />
    ))}
  </View>
);

// ── Main page ─────────────────────────────────────────────────────────────
const Onboarding = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);
  const isLast = activeIndex === STEPS.length - 1;

  const goNext = () => {
    if (isLast) {
      router.back();
    } else {
      const next = activeIndex + 1;
      flatListRef.current?.scrollToIndex({ index: next, animated: true });
      setActiveIndex(next);
    }
  };

  const goBack = () => {
    if (activeIndex === 0) {
      router.back();
    } else {
      const prev = activeIndex - 1;
      flatListRef.current?.scrollToIndex({ index: prev, animated: true });
      setActiveIndex(prev);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-background">
      {/* Close button */}
      <View
        style={{
          flexDirection: "row",
          justifyContent: "flex-end",
          paddingHorizontal: 20,
          paddingTop: 8,
        }}
      >
        <Pressable
          onPress={() => router.back()}
          style={{
            width: 36,
            height: 36,
            borderRadius: 18,
            backgroundColor: "#efefef",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Text style={{ fontSize: 16, color: "#1a1a1a", fontWeight: "700" }}>
            ✕
          </Text>
        </Pressable>
      </View>

      {/* Slides */}
      <FlatList
        ref={flatListRef}
        data={STEPS}
        keyExtractor={(item) => item.id}
        horizontal
        pagingEnabled
        scrollEnabled={false}
        showsHorizontalScrollIndicator={false}
        renderItem={({ item }) => (
          <View
            style={{
              width: SCREEN_WIDTH,
              flex: 1,
              alignItems: "center",
              justifyContent: "center",
              paddingHorizontal: 36,
            }}
          >
            {/* Icon circle */}
            <View
              style={{
                width: 120,
                height: 120,
                borderRadius: 60,
                backgroundColor: item.color,
                alignItems: "center",
                justifyContent: "center",
                marginBottom: 40,
              }}
            >
              <Image
                source={item.icon}
                style={{ width: 52, height: 52 }}
                resizeMode="contain"
              />
            </View>

            {/* Step badge */}
            <View
              style={{
                backgroundColor: "#1a1a1a",
                borderRadius: 999,
                paddingHorizontal: 14,
                paddingVertical: 4,
                marginBottom: 18,
              }}
            >
              <Text style={{ color: "#fff", fontSize: 12, fontWeight: "700" }}>
                Step {item.id} of {STEPS.length}
              </Text>
            </View>

            <Text
              style={{
                fontSize: 24,
                fontWeight: "800",
                color: "#1a1a1a",
                textAlign: "center",
                marginBottom: 16,
                lineHeight: 32,
              }}
            >
              {item.title}
            </Text>

            <Text
              style={{
                fontSize: 15,
                color: "#666",
                textAlign: "center",
                lineHeight: 24,
              }}
            >
              {item.description}
            </Text>
          </View>
        )}
        style={{ flex: 1 }}
      />

      {/* Bottom controls */}
      <View
        style={{
          paddingHorizontal: 24,
          paddingBottom: 32,
          gap: 20,
          alignItems: "center",
        }}
      >
        {/* Dots */}
        <Dots total={STEPS.length} active={activeIndex} />

        {/* Buttons row */}
        <View
          style={{
            flexDirection: "row",
            gap: 12,
            width: "100%",
          }}
        >
          {/* Back / Skip */}
          <Pressable
            onPress={goBack}
            style={{
              flex: 1,
              borderWidth: 1.5,
              borderColor: "#1a1a1a",
              borderRadius: 999,
              paddingVertical: 14,
              alignItems: "center",
            }}
          >
            <Text style={{ fontSize: 15, fontWeight: "700", color: "#1a1a1a" }}>
              {activeIndex === 0 ? "Skip" : "Back"}
            </Text>
          </Pressable>

          {/* Next / Done */}
          <Pressable
            onPress={goNext}
            style={{
              flex: 2,
              backgroundColor: "#1a1a1a",
              borderRadius: 999,
              paddingVertical: 14,
              alignItems: "center",
            }}
          >
            <Text style={{ fontSize: 15, fontWeight: "700", color: "#fff" }}>
              {isLast ? "Got it!" : "Next"}
            </Text>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default Onboarding;
