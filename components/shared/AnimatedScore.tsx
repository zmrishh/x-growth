"use client";

import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useEffect } from "react";

interface AnimatedScoreProps {
  value: number;
  className?: string;
  suffix?: string;
  fontSize?: number;
  color?: string;
}

export function AnimatedScore({
  value,
  className,
  suffix = "",
  fontSize = 32,
  color,
}: AnimatedScoreProps) {
  const motionVal = useMotionValue(0);
  const spring = useSpring(motionVal, { stiffness: 60, damping: 20 });
  const display = useTransform(spring, (v) => Math.round(v).toString());

  useEffect(() => {
    motionVal.set(value);
  }, [value, motionVal]);

  return (
    <motion.span
      className={className}
      style={{ fontSize, fontVariantNumeric: "tabular-nums", color }}
    >
      <motion.span>{display}</motion.span>
      {suffix}
    </motion.span>
  );
}
