import { router } from "expo-router";
import React from "react";
import { Dimensions, Pressable, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Svg, { Circle, ClipPath, Defs, G, Rect } from "react-native-svg";

const { width: W, height: H } = Dimensions.get("window");

// ── Palette ───────────────────────────────────────────────────────────────
const BG = "#E8694A"; // main orange-red background
const NAVY = "#2D3250"; // dark navy
const CREAM = "#F5F0E8"; // off-white / cream
const TEAL = "#5BBFAD"; // muted teal
const PEACH = "#F0C27F"; // warm peach / sand

// ── Geometric pattern (SVG) ───────────────────────────────────────────────
// The pattern fills the top ~65% of the screen.
// Grid: 4 columns × 4 rows of equal cells, each cell = W/4
const CELL = W / 4;
const GRID_H = CELL * 4;

const GeometricPattern = () => (
  <Svg width={W} height={GRID_H} viewBox={`0 0 ${W} ${GRID_H}`}>
    <Defs>
      {/* Clip each cell so shapes don't bleed across borders */}
      {Array.from({ length: 16 }).map((_, i) => {
        const col = i % 4;
        const row = Math.floor(i / 4);
        return (
          <ClipPath key={`clip-${i}`} id={`c${i}`}>
            <Rect x={col * CELL} y={row * CELL} width={CELL} height={CELL} />
          </ClipPath>
        );
      })}
    </Defs>

    {/* ── ROW 0 ── */}
    {/* [0,0] cream full circle */}
    <G clipPath="url(#c0)">
      <Rect x={0} y={0} width={CELL} height={CELL} fill={BG} />
      <Circle cx={CELL / 2} cy={CELL / 2} r={CELL / 2} fill={CREAM} />
    </G>
    {/* [0,1] BG cell (empty) */}
    <G clipPath="url(#c1)">
      <Rect x={CELL} y={0} width={CELL} height={CELL} fill={BG} />
    </G>
    {/* [0,2] peach full circle */}
    <G clipPath="url(#c2)">
      <Rect x={CELL * 2} y={0} width={CELL} height={CELL} fill={BG} />
      <Circle
        cx={CELL * 2 + CELL / 2}
        cy={CELL / 2}
        r={CELL / 2}
        fill={PEACH}
      />
    </G>
    {/* [0,3] peach full circle */}
    <G clipPath="url(#c3)">
      <Rect x={CELL * 3} y={0} width={CELL} height={CELL} fill={BG} />
      <Circle
        cx={CELL * 3 + CELL / 2}
        cy={CELL / 2}
        r={CELL / 2}
        fill={PEACH}
      />
    </G>

    {/* ── ROW 1 ── */}
    {/* [1,0] cream full circle */}
    <G clipPath="url(#c4)">
      <Rect x={0} y={CELL} width={CELL} height={CELL} fill={BG} />
      <Circle cx={CELL / 2} cy={CELL + CELL / 2} r={CELL / 2} fill={CREAM} />
    </G>
    {/* [1,1] teal full circle */}
    <G clipPath="url(#c5)">
      <Rect x={CELL} y={CELL} width={CELL} height={CELL} fill={BG} />
      <Circle
        cx={CELL + CELL / 2}
        cy={CELL + CELL / 2}
        r={CELL / 2}
        fill={TEAL}
      />
    </G>
    {/* [1,2] peach full circle */}
    <G clipPath="url(#c6)">
      <Rect x={CELL * 2} y={CELL} width={CELL} height={CELL} fill={BG} />
      <Circle
        cx={CELL * 2 + CELL / 2}
        cy={CELL + CELL / 2}
        r={CELL / 2}
        fill={PEACH}
      />
    </G>
    {/* [1,3] BG cell */}
    <G clipPath="url(#c7)">
      <Rect x={CELL * 3} y={CELL} width={CELL} height={CELL} fill={BG} />
    </G>

    {/* ── ROW 2 ── */}
    {/* [2,0] navy full square */}
    <G clipPath="url(#c8)">
      <Rect x={0} y={CELL * 2} width={CELL} height={CELL} fill={NAVY} />
    </G>
    {/* [2,1] cream — bottom-left quarter circle (navy bg) */}
    <G clipPath="url(#c9)">
      <Rect x={CELL} y={CELL * 2} width={CELL} height={CELL} fill={CREAM} />
      <Circle cx={CELL} cy={CELL * 2} r={CELL} fill={NAVY} />
    </G>
    {/* [2,2] navy full square */}
    <G clipPath="url(#c10)">
      <Rect x={CELL * 2} y={CELL * 2} width={CELL} height={CELL} fill={NAVY} />
    </G>
    {/* [2,3] cream — bottom-left quarter circle (navy bg) */}
    <G clipPath="url(#c11)">
      <Rect x={CELL * 3} y={CELL * 2} width={CELL} height={CELL} fill={CREAM} />
      <Circle cx={CELL * 3} cy={CELL * 2} r={CELL} fill={NAVY} />
    </G>

    {/* ── ROW 3 ── */}
    {/* [3,0] navy — top-right quarter circle (cream bg) */}
    <G clipPath="url(#c12)">
      <Rect x={0} y={CELL * 3} width={CELL} height={CELL} fill={NAVY} />
      <Circle cx={CELL} cy={CELL * 3 + CELL} r={CELL} fill={CREAM} />
    </G>
    {/* [3,1] cream full square */}
    <G clipPath="url(#c13)">
      <Rect x={CELL} y={CELL * 3} width={CELL} height={CELL} fill={CREAM} />
    </G>
    {/* [3,2] navy full circle */}
    <G clipPath="url(#c14)">
      <Rect x={CELL * 2} y={CELL * 3} width={CELL} height={CELL} fill={BG} />
      <Circle
        cx={CELL * 2 + CELL / 2}
        cy={CELL * 3 + CELL / 2}
        r={CELL / 2}
        fill={NAVY}
      />
    </G>
    {/* [3,3] teal full circle */}
    <G clipPath="url(#c15)">
      <Rect x={CELL * 3} y={CELL * 3} width={CELL} height={CELL} fill={BG} />
      <Circle
        cx={CELL * 3 + CELL / 2}
        cy={CELL * 3 + CELL / 2}
        r={CELL / 2}
        fill={TEAL}
      />
    </G>
  </Svg>
);

// ── Splash screen ─────────────────────────────────────────────────────────
const Splash = () => (
  <SafeAreaView style={styles.safe} edges={["bottom"]}>
    <View style={styles.container}>
      {/* Geometric art fills top portion */}
      <View style={styles.artWrap}>
        <GeometricPattern />
      </View>

      {/* Bottom text + CTA */}
      <View style={styles.bottom}>
        <Text style={styles.headline}>Gain Financial Clarity</Text>
        <Text style={styles.sub}>Track, analyze and cancel with ease</Text>

        <Pressable
          style={({ pressed }) => [styles.btn, pressed && { opacity: 0.85 }]}
          onPress={() => router.replace("/(tabs)")}
        >
          <Text style={styles.btnText}>Get Started</Text>
        </Pressable>
      </View>
    </View>
  </SafeAreaView>
);

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: BG,
  },
  container: {
    flex: 1,
    backgroundColor: BG,
  },
  artWrap: {
    width: W,
    overflow: "hidden",
  },
  bottom: {
    flex: 1,
    paddingHorizontal: 28,
    paddingTop: 28,
    paddingBottom: 16,
    justifyContent: "flex-end",
    gap: 8,
  },
  headline: {
    fontSize: 32,
    fontWeight: "800",
    color: CREAM,
    lineHeight: 40,
    marginBottom: 4,
  },
  sub: {
    fontSize: 15,
    color: "rgba(245,240,232,0.75)",
    marginBottom: 28,
  },
  btn: {
    backgroundColor: CREAM,
    borderRadius: 999,
    paddingVertical: 16,
    alignItems: "center",
    marginBottom: 8,
  },
  btnText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1a1a1a",
  },
});

export default Splash;
