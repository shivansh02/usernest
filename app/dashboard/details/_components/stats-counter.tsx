"use client";

import CountUp from "react-countup";

interface StatsCounterProps {
  value: number;
}

export function StatsCounter({ value }: StatsCounterProps) {
  return (
    <CountUp
      className="text-2xl font-bold"
      end={value}
      decimals={0}
      duration={2}
      separator=","
      start={0}
    />
  );
}
