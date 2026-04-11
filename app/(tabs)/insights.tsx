import {
  INSIGHTS_EXPENSES,
  WEEKLY_CHART_DATA,
  WEEKLY_CHART_Y_LABELS,
} from "@/constants/data";
import { useSubscriptionStore } from "@/lib/subscriptionStore";
import { formatCurrency } from "@/lib/utils";
import { styled } from "nativewind";
import React, { useState } from "react";
import {
  Image,
  Pressable,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView as RNSafeAreaView } from "react-native-safe-area-context";

const SafeAreaView = styled(RNSafeAreaView);

const CHART_HEIGHT = 160;
const ACTIVE_COLOR = "#E8735A";
const BAR_COLOR = "#1a1a1a";
const MAX_VALUE = Math.max(...WEEKLY_CHART_DATA.map((d) => d.value));

// ── Section header ────────────────────────────────────────────────────────
const SectionHeader = ({ title }: { title: string }) => (
  <View
    style={{
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 14,
    }}
  >
    <Text style={{ fontSize: 20, fontWeight: "800", color: "#1a1a1a" }}>
      {title}
    </Text>
    <TouchableOpacity
      style={{
        borderWidth: 1.5,
        borderColor: "#1a1a1a",
        borderRadius: 999,
        paddingHorizontal: 16,
        paddingVertical: 6,
      }}
    >
      <Text style={{ fontSize: 13, fontWeight: "600", color: "#1a1a1a" }}>
        View all
      </Text>
    </TouchableOpacity>
  </View>
);

// ── Expenses card ─────────────────────────────────────────────────────────
const ExpensesCard = () => (
  <View
    style={{
      backgroundColor: "#fff",
      borderRadius: 16,
      padding: 16,
      marginBottom: 24,
    }}
  >
    <View
      style={{
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "flex-start",
      }}
    >
      <View>
        <Text style={{ fontSize: 17, fontWeight: "700", color: "#1a1a1a" }}>
          Expenses
        </Text>
        <Text style={{ fontSize: 13, color: "#888", marginTop: 3 }}>
          {INSIGHTS_EXPENSES.period}
        </Text>
      </View>
      <View style={{ alignItems: "flex-end" }}>
        <Text style={{ fontSize: 17, fontWeight: "700", color: "#1a1a1a" }}>
          {formatCurrency(INSIGHTS_EXPENSES.amount, INSIGHTS_EXPENSES.currency)}
        </Text>
        <Text style={{ fontSize: 13, color: "#4caf50", marginTop: 3 }}>
          +{INSIGHTS_EXPENSES.changePercent}%
        </Text>
      </View>
    </View>
  </View>
);

// ── History subscription card ─────────────────────────────────────────────
const HistoryCard = ({ item }: { item: Subscription }) => {
  const dateLabel = item.startDate
    ? new Date(item.startDate).toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
      }) +
      ", " +
      new Date(item.startDate).toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      })
    : "";

  return (
    <View
      style={{
        backgroundColor: item.color ?? "#f5f5f5",
        borderRadius: 16,
        padding: 16,
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 12,
      }}
    >
      <View
        style={{
          width: 44,
          height: 44,
          borderRadius: 12,
          backgroundColor: "rgba(255,255,255,0.55)",
          alignItems: "center",
          justifyContent: "center",
          marginRight: 12,
          overflow: "hidden",
        }}
      >
        <Image
          source={item.icon}
          style={{ width: 28, height: 28 }}
          resizeMode="contain"
        />
      </View>

      <View style={{ flex: 1 }}>
        <Text style={{ fontSize: 16, fontWeight: "700", color: "#1a1a1a" }}>
          {item.name}
        </Text>
        <Text style={{ fontSize: 12, color: "#555", marginTop: 2 }}>
          {dateLabel}
        </Text>
      </View>

      <View style={{ alignItems: "flex-end" }}>
        <Text style={{ fontSize: 16, fontWeight: "700", color: "#1a1a1a" }}>
          {formatCurrency(item.price, item.currency)}
        </Text>
        <Text style={{ fontSize: 12, color: "#555", marginTop: 2 }}>
          per month
        </Text>
      </View>
    </View>
  );
};

// ── Bar Chart ─────────────────────────────────────────────────────────────
const WeeklyChart = ({
  selectedDay,
  onSelectDay,
}: {
  selectedDay: string | null;
  onSelectDay: (day: string) => void;
}) => (
  <View
    style={{
      backgroundColor: "#f5f0e8",
      borderRadius: 16,
      padding: 16,
      marginBottom: 16,
    }}
  >
    <View style={{ flexDirection: "row" }}>
      {/* Y-axis labels */}
      <View
        style={{
          height: CHART_HEIGHT,
          justifyContent: "space-between",
          alignItems: "flex-end",
          marginRight: 8,
          paddingBottom: 2,
        }}
      >
        {[...WEEKLY_CHART_Y_LABELS].reverse().map((label) => (
          <Text
            key={label}
            style={{ fontSize: 10, color: "#999", lineHeight: 12 }}
          >
            {label}
          </Text>
        ))}
      </View>

      {/* Bars + grid */}
      <View style={{ flex: 1, height: CHART_HEIGHT }}>
        {/* Dashed grid lines */}
        {WEEKLY_CHART_Y_LABELS.slice(1).map((_, i) => (
          <View
            key={i}
            style={{
              position: "absolute",
              left: 0,
              right: 0,
              top: (CHART_HEIGHT / (WEEKLY_CHART_Y_LABELS.length - 1)) * i,
              borderTopWidth: 1,
              borderStyle: "dashed",
              borderColor: "#d9d3c7",
            }}
          />
        ))}

        {/* Bar columns */}
        <View
          style={{
            flexDirection: "row",
            alignItems: "flex-end",
            height: CHART_HEIGHT,
            justifyContent: "space-between",
          }}
        >
          {WEEKLY_CHART_DATA.map(({ day, value }) => {
            const isActive = selectedDay === day;
            const barHeight = (value / MAX_VALUE) * (CHART_HEIGHT - 20);

            return (
              <Pressable
                key={day}
                onPress={() => onSelectDay(day)}
                style={{ alignItems: "center", flex: 1 }}
              >
                {isActive ? (
                  <View
                    style={{
                      backgroundColor: "#fff",
                      borderRadius: 8,
                      paddingHorizontal: 6,
                      paddingVertical: 3,
                      marginBottom: 4,
                      shadowColor: "#000",
                      shadowOpacity: 0.08,
                      shadowRadius: 4,
                      elevation: 2,
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 11,
                        fontWeight: "700",
                        color: "#1a1a1a",
                      }}
                    >
                      ${value}
                    </Text>
                  </View>
                ) : (
                  <View style={{ height: 22 }} />
                )}

                <View
                  style={{
                    width: 18,
                    height: barHeight,
                    backgroundColor: isActive ? ACTIVE_COLOR : BAR_COLOR,
                    borderRadius: 6,
                  }}
                />
              </Pressable>
            );
          })}
        </View>
      </View>
    </View>

    {/* X-axis day labels */}
    <View style={{ flexDirection: "row", marginTop: 8, paddingLeft: 32 }}>
      {WEEKLY_CHART_DATA.map(({ day }) => (
        <Text
          key={day}
          style={{
            flex: 1,
            textAlign: "center",
            fontSize: 11,
            color: "#888",
            fontWeight: selectedDay === day ? "700" : "400",
          }}
        >
          {day}
        </Text>
      ))}
    </View>
  </View>
);

// ── Main page ─────────────────────────────────────────────────────────────
const Insights = () => {
  const [selectedDay, setSelectedDay] = useState<string | null>("Thu");
  const { subscriptions } = useSubscriptionStore();

  return (
    <SafeAreaView className="flex-1 bg-background">
      <ScrollView
        contentContainerStyle={{ padding: 20, paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
      >
        <SectionHeader title="Upcoming" />
        <WeeklyChart
          selectedDay={selectedDay}
          onSelectDay={(day) =>
            setSelectedDay((prev) => (prev === day ? null : day))
          }
        />

        <ExpensesCard />

        <SectionHeader title="History" />
        {subscriptions.map((item) => (
          <HistoryCard key={item.id} item={item} />
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

export default Insights;
