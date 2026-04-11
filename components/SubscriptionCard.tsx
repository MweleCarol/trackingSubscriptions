import { useSubscriptionStore } from "@/lib/subscriptionStore";
import {
  formatCurrency,
  formatStatusLabel,
  formatSubscriptionDateTime,
} from "@/lib/utils";
import clsx from "clsx";
import React from "react";
import { Image, Pressable, Text, TouchableOpacity, View } from "react-native";

const SubscriptionCard = ({
  id,
  name,
  price,
  currency,
  icon,
  billing,
  color,
  category,
  plan,
  renewalDate,
  onPress,
  expanded,
  paymentMethod,
  startDate,
  status,
  showActions,
}: SubscriptionCardProps & { showActions?: boolean }) => {
  const { cancelSubscription } = useSubscriptionStore();

  // Mask payment method to last 4 digits
  const maskedPayment = paymentMethod
    ? "*****" + paymentMethod.replace(/\D/g, "").slice(-4)
    : "N/A";

  // Subscriptions page: always show the plan name under the title
  // Home page: category → plan → renewal date
  const metaLabel = showActions
    ? (plan?.trim() ?? "")
    : category?.trim() ||
      plan?.trim() ||
      (renewalDate ? formatSubscriptionDateTime(renewalDate) : "");

  return (
    <Pressable
      onPress={onPress}
      className={clsx("sub-card", expanded ? "sub-card-expanded" : "bg-card")}
      style={!expanded && color ? { backgroundColor: color } : undefined}
    >
      {/* ── Header row (always visible) ── */}
      <View className="sub-head">
        <View className="sub-main">
          <Image source={icon} className="sub-icon" />
          <View className="sub-copy">
            <Text numberOfLines={1} className="sub-title">
              {name}
            </Text>
            <Text numberOfLines={1} ellipsizeMode="tail" className="sub-meta">
              {metaLabel}
            </Text>
          </View>
        </View>
        <View className="sub-price-box">
          <Text className="sub-price">{formatCurrency(price, currency)}</Text>
          <Text className="sub-billing">{billing}</Text>
        </View>
      </View>

      {/* ── Expanded body ── */}
      {expanded && (
        <View className="sub-bdy">
          {showActions ? (
            /* ── Subscriptions page: payment info + plan + cancel ── */
            <>
              {/* Payment info row */}
              <View className="sub-row">
                <View className="sub-row-copy">
                  <Text className="sub-label">Payment info:</Text>
                  <Text
                    className="sub-value"
                    numberOfLines={1}
                    ellipsizeMode="tail"
                  >
                    {maskedPayment}
                  </Text>
                </View>
                <TouchableOpacity
                  style={{
                    borderWidth: 1.5,
                    borderColor: "#1a1a1a",
                    borderRadius: 999,
                    paddingHorizontal: 18,
                    paddingVertical: 5,
                  }}
                >
                  <Text
                    style={{
                      fontSize: 13,
                      fontWeight: "600",
                      color: "#1a1a1a",
                    }}
                  >
                    Manage
                  </Text>
                </TouchableOpacity>
              </View>

              {/* Plan details row */}
              <View className="sub-row">
                <View className="sub-row-copy">
                  <Text className="sub-label">Plan details:</Text>
                  <Text
                    className="sub-value"
                    numberOfLines={1}
                    ellipsizeMode="tail"
                  >
                    {plan?.trim() ?? "N/A"}
                  </Text>
                </View>
                <TouchableOpacity
                  style={{
                    borderWidth: 1.5,
                    borderColor: "#1a1a1a",
                    borderRadius: 999,
                    paddingHorizontal: 18,
                    paddingVertical: 5,
                  }}
                >
                  <Text
                    style={{
                      fontSize: 13,
                      fontWeight: "600",
                      color: "#1a1a1a",
                    }}
                  >
                    Change
                  </Text>
                </TouchableOpacity>
              </View>

              {/* Cancel Subscription — full-width dark pill */}
              <TouchableOpacity
                activeOpacity={0.85}
                onPress={() => cancelSubscription(id)}
                style={{
                  backgroundColor: "#1a1a1a",
                  borderRadius: 999,
                  paddingVertical: 15,
                  alignItems: "center",
                  marginTop: 6,
                  width: "100%",
                }}
              >
                <Text
                  style={{
                    color: "#ffffff",
                    fontSize: 15,
                    fontWeight: "700",
                    letterSpacing: 0.2,
                  }}
                >
                  Cancel Subscription
                </Text>
              </TouchableOpacity>
            </>
          ) : (
            /* ── Home page: full detail rows ── */
            <View className="sub-details">
              <View className="sub-row">
                <View className="sub-row-copy">
                  <Text className="sub-label">Payment:</Text>
                  <Text
                    className="sub-value"
                    numberOfLines={1}
                    ellipsizeMode="tail"
                  >
                    {paymentMethod?.trim() ?? "not Provided"}
                  </Text>
                </View>
              </View>

              <View className="sub-row">
                <View className="sub-row-copy">
                  <Text className="sub-label">Category:</Text>
                  <Text
                    className="sub-value"
                    numberOfLines={1}
                    ellipsizeMode="tail"
                  >
                    {(category?.trim() || plan?.trim()) ?? "not Provided"}
                  </Text>
                </View>
              </View>

              <View className="sub-row">
                <View className="sub-row-copy">
                  <Text className="sub-label">Started:</Text>
                  <Text
                    className="sub-value"
                    numberOfLines={1}
                    ellipsizeMode="tail"
                  >
                    {startDate ? formatSubscriptionDateTime(startDate) : ""}
                  </Text>
                </View>
              </View>

              <View className="sub-row">
                <View className="sub-row-copy">
                  <Text className="sub-label">Renewal date:</Text>
                  <Text
                    className="sub-value"
                    numberOfLines={1}
                    ellipsizeMode="tail"
                  >
                    {renewalDate ? formatSubscriptionDateTime(renewalDate) : ""}
                  </Text>
                </View>
              </View>

              <View className="sub-row">
                <View className="sub-row-copy">
                  <Text className="sub-label">Status:</Text>
                  <Text
                    className="sub-value"
                    numberOfLines={1}
                    ellipsizeMode="tail"
                  >
                    {status ? formatStatusLabel(status) : ""}
                  </Text>
                </View>
              </View>
            </View>
          )}
        </View>
      )}
    </Pressable>
  );
};

export default SubscriptionCard;
