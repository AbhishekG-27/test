import React, { useState } from "react";
import { Rect } from "react-konva";
import { RectangleTypes } from "../lib/types";
import { useRecoilState } from "recoil";
import { RectanglePropertiesSelector } from "../recoil/states";

interface RectangleRendererProps {
  rectangle: RectangleTypes;
  isDraggable: boolean;
  setRectangles: React.Dispatch<React.SetStateAction<RectangleTypes[]>>;
  rectangles: RectangleTypes[];
  i: number;
  ws: WebSocket | null | undefined;
  setIsDraggable: React.Dispatch<React.SetStateAction<boolean>>;
}

const RectangleRenderer = ({
  rectangle,
  setRectangles,
  isDraggable,
  i,
  rectangles,
  setIsDraggable,
  ws,
}: RectangleRendererProps) => {
  const [rectangleColor, setRectangleColor] = useState("#fff");
  const [rectangleStrokeWidth, setRectangleStrokeWidth] = useState(3);
  const [rectangleOpacity, setRectangleOpacity] = useState(1);

  // recoil
  const [rectangleProperties] = useRecoilState(RectanglePropertiesSelector);
  return (
    <div>
      <Rect
        {...rectangle}
        stroke={rectangleColor}
        strokeWidth={rectangleStrokeWidth}
        draggable={isDraggable}
        opacity={rectangleOpacity}
        
        onDragEnd={(e) => {
          const x = e.target.x();
          const y = e.target.y();
          setRectangles((r) => {
            const newRectangles = r;
            newRectangles[i].x = x;
            newRectangles[i].y = y;
            return newRectangles;
          });
          ws?.send(JSON.stringify({ rectangles }));
          setIsDraggable(false);
        }}
        onclick={() => {
          setRectangleColor(rectangleProperties.color);
          setRectangleStrokeWidth(rectangleProperties.strokeWidth);
          setRectangleOpacity(rectangleProperties.opacity);
        }}
      />
    </div>
  );
};

export default RectangleRenderer;
