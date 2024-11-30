"use client";

import CountUp from "react-countup";

interface CountUpWrapperProps {
  value: number;
  decimals: number;
}

export default function CountUpWrapper({
  value,
  decimals,
}: CountUpWrapperProps) {
  return (
    <CountUp
      end={value}
      decimals={decimals}
      duration={2}
      separator=","
      start={0}
    />
  );
}
