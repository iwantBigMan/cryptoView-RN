import React from 'react';
import {View} from 'react-native';
import Svg, {Circle} from 'react-native-svg';

export interface DonutSegment {
  color: string;
  value: number;
}

interface Props {
  segments: DonutSegment[];
  size?: number;
  strokeWidth?: number;
}

export default function DonutChart({
  segments,
  size = 180,
  strokeWidth = 24,
}: Props) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const total = segments.reduce((s, seg) => s + seg.value, 0);

  let cumulativeOffset = 0;

  return (
    <View style={{alignItems: 'center', marginVertical: 16}}>
      <Svg width={size} height={size}>
        {/* 배경 링 */}
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="#1A1D2E"
          strokeWidth={strokeWidth}
          fill="none"
        />
        {segments.map((seg, i) => {
          const pct = total > 0 ? seg.value / total : 0;
          const dashLength = pct * circumference;
          const dashOffset = -cumulativeOffset;
          cumulativeOffset += dashLength;

          return (
            <Circle
              key={i}
              cx={size / 2}
              cy={size / 2}
              r={radius}
              stroke={seg.color}
              strokeWidth={strokeWidth}
              fill="none"
              strokeDasharray={`${dashLength} ${circumference - dashLength}`}
              strokeDashoffset={dashOffset}
              strokeLinecap="butt"
              rotation={-90}
              origin={`${size / 2}, ${size / 2}`}
            />
          );
        })}
      </Svg>
    </View>
  );
}
