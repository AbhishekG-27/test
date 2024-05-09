import { Circle } from "react-konva";
import { CircleTypes } from "../lib/types";
import { useState } from "react";
import { useRecoilState } from "recoil";
import { CirclePropertiesSelector } from "../recoil/states";

interface CircleRendererProps {
  circle: CircleTypes;
  isDraggable: boolean;
  setCircles: React.Dispatch<React.SetStateAction<CircleTypes[]>>;
  i: number;
  ws: WebSocket | null | undefined;
  setIsDraggable: React.Dispatch<React.SetStateAction<boolean>>;
  circles: CircleTypes[];
}

const CircleRenderer = ({
  circle,
  isDraggable,
  setCircles,
  i,
  ws,
  setIsDraggable,
  circles,
}: CircleRendererProps) => {
  // circle properties
  const [circleColor, setCircleColor] = useState("#fff");
  const [circleStrokeWidth, setCircleStrokeWidth] = useState(3);
  const [circleOpacity, setCircleOpacity] = useState(1);
  const [circleProperties] = useRecoilState(CirclePropertiesSelector);
  return (
    <div>
      <Circle
        {...circle}
        strokeWidth={circleStrokeWidth}
        stroke={circleColor}
        draggable={isDraggable}
        opacity={circleOpacity}
        onClick={() => {
          setCircleColor(circleProperties.color);
          setCircleStrokeWidth(circleProperties.strokeWidth);
          setCircleOpacity(circleProperties.opacity);
        }}
        onDragEnd={(e) => {
          const x = e.target.x();
          const y = e.target.y();
          setCircles((c) => {
            const newCircles = c;
            newCircles[i].x = x;
            newCircles[i].y = y;
            return newCircles;
          });
          ws?.send(JSON.stringify({ circles }));
          setIsDraggable(false);
        }}
      />
    </div>
  );
};

export default CircleRenderer;
