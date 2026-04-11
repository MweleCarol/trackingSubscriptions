import CreateSubscriptionModal from "@/components/CreateSubscriptionModal";
import ListHeading from "@/components/ListHeading";
import SubscriptionCard from "@/components/SubscriptionCard";
import UpcomingSubscriptionCard from "@/components/UpcomingSubscriptionCard";
import { HOME_BALANCE } from "@/constants/data";
import { icons } from "@/constants/icons";
import images from "@/constants/images";
import "@/global.css";
import { useSubscriptionStore } from "@/lib/subscriptionStore";
import { formatCurrency } from "@/lib/utils";
import { useUser } from "@clerk/expo";
import dayjs from "dayjs";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";
import { router, useFocusEffect } from "expo-router";
import { styled } from "nativewind";
import { usePostHog } from "posthog-react-native";
import { useCallback, useMemo, useState } from "react";
import { FlatList, Image, Pressable, Text, View } from "react-native";
import { SafeAreaView as RNSafeAreaView } from "react-native-safe-area-context";

dayjs.extend(isSameOrAfter);
dayjs.extend(isSameOrBefore);


const SafeAreaView = styled(RNSafeAreaView);

export default function App() {
  const { user } = useUser();
  const posthog = usePostHog();
  const [expandedSubscriptionId, setExpandedSubscriptionId] = useState<
    string | null
  >(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const { subscriptions, addSubscription } = useSubscriptionStore();

  // Refreshes whenever the tab comes into focus so the window is never stale.
  const [now, setNow] = useState(() => dayjs());
  useFocusEffect(
    useCallback(() => {
      setNow(dayjs());
    }, []),
  );

  // Get upcoming subscriptions (active, renewing today through 7 days from now).
  // Uses isSameOrAfter / isSameOrBefore so boundary days are included.
  const upcomingSubscriptions = useMemo(() => {
    const windowEnd = now.add(7, "days");
    return subscriptions
      .filter(
        (sub) =>
          sub.status === "active" &&
          !!sub.renewalDate &&
          dayjs(sub.renewalDate).isValid() &&
          dayjs(sub.renewalDate).isSameOrAfter(now, "day") &&
          dayjs(sub.renewalDate).isSameOrBefore(windowEnd, "day"),
      )
      .sort((a, b) => dayjs(a.renewalDate).diff(dayjs(b.renewalDate)));
  }, [subscriptions, now]);

  const handleSubscriptionPress = (item: Subscription) => {
    const isExpanding = expandedSubscriptionId !== item.id;
    setExpandedSubscriptionId((currentId) =>
      currentId === item.id ? null : item.id,
    );
    posthog.capture(
      isExpanding ? "subscription_expanded" : "subscription_collapsed",
      {
        subscription_category: item.category ?? "uncategorised",
      },
    );
  };

  const handleCreateSubscription = (newSubscription: Subscription) => {
    addSubscription(newSubscription);
    posthog.capture("subscription_created", {
      // subscription_name removed — PII; use category as coarse signal instead
      subscription_price: newSubscription.price,
      subscription_frequency: newSubscription.frequency,
      subscription_category: newSubscription.category ?? "uncategorised",
    });
  };

  // Get user display name: firstName, fullName, or email
  const displayName =
    user?.firstName ||
    user?.fullName ||
    user?.emailAddresses[0]?.emailAddress ||
    "User";

  return (
    <SafeAreaView className="flex-1 bg-background p-5">
      <FlatList
        ListHeaderComponent={() => (
          <>
            <View className="home-header">
              <View className="home-user">
                <Image
                  source={
                    user?.imageUrl ? { uri: user.imageUrl } : images.avatar
                  }
                  className="home-avatar"
                />
                <Text className="home-user-name">{displayName}</Text>
              </View>

              {/* Right side: help button + add button */}
              <View
                style={{ flexDirection: "row", alignItems: "center", gap: 10 }}
              >
                {/* Help / onboarding button */}
                <Pressable
                  onPress={() => router.push("/onboarding")}
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: 18,
                    backgroundColor: "#FD5E53",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Text
                    style={{
                      color: "#fff",
                      fontSize: 16,
                      fontWeight: "800",
                      lineHeight: 20,
                    }}
                  >
                    ?
                  </Text>
                </Pressable>

                {/* Add subscription button */}
                <Pressable onPress={() => setIsModalVisible(true)}>
                  <Image source={icons.add} className="home-add-icon" />
                </Pressable>
              </View>
            </View>

            <View className="home-balance-card">
              <Text className="home-balance-label">Balance</Text>

              <View className="home-balance-row">
                <Text className="home-balance-amount">
                  {formatCurrency(HOME_BALANCE.amount)}
                </Text>
                <Text className="home-balance-date">
                  {dayjs(HOME_BALANCE.nextRenewalDate).format("MM/DD")}
                </Text>
              </View>
            </View>

            <View className="mb-5">
              <ListHeading title="Upcoming" />

              <FlatList
                data={upcomingSubscriptions}
                renderItem={({ item }) => (
                  <UpcomingSubscriptionCard {...item} />
                )}
                keyExtractor={(item) => item.id}
                horizontal
                showsHorizontalScrollIndicator={false}
                ListEmptyComponent={
                  <Text className="home-empty-state">
                    No upcoming renewals yet.
                  </Text>
                }
              />
            </View>

            <ListHeading title="All Subscriptions" />
          </>
        )}
        data={subscriptions}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <SubscriptionCard
            {...item}
            expanded={expandedSubscriptionId === item.id}
            onPress={() => handleSubscriptionPress(item)}
          />
        )}
        extraData={expandedSubscriptionId}
        ItemSeparatorComponent={() => <View className="h-4" />}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <Text className="home-empty-state">No subscriptions yet.</Text>
        }
        contentContainerClassName="pb-30"
      />

      <CreateSubscriptionModal
        visible={isModalVisible}
        onClose={() => setIsModalVisible(false)}
        onSubmit={handleCreateSubscription}
      />
    </SafeAreaView>
  );
}