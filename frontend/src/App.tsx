import { KonvaEventObject } from "konva/lib/Node";
import { useEffect, useRef, useState } from "react";
import { Stage, Layer, Line, Arrow, Text } from "react-konva";
import { ArrowTypes, CircleTypes, RectangleTypes } from "../lib/types";
import Header from "../components/Header";
import PropertiesPanel from "../components/PropertiesPanel";
import ToolPanel from "../components/ToolPanel";
import { handleMouseDown } from "../utils/handleMouseDown";
import { handleMouseMove } from "../utils/handleMouseMove";
import { InitWebSocket } from "../utils/WebSocketUtils";
import CircleRenderer from "../components/CircleRenderer";
import RectangleRenderer from "../components/RectangleRenderer";
import JoinAlert from "../components/JoinAlert";
import LeaveAlert from "../components/LeaveAlert";

const Whiteboard = () => {
  const [roomJoined, setRoomJoined] = useState(false);
  const [clientJoined, setClientJoined] = useState("");
  const [clientLeft, setClientLeft] = useState("");
  const [isDraggable, setIsDraggable] = useState(false);
  const [cliendId, setClientId] = useState("");
  const [inputText, setInputText] = useState("");
  const [roomId, setRoomId] = useState("");
  const [createdRoomId, setCreatedRoomId] = useState("");
  const [tool, setTool] = useState("pen");
  const [showInput, setShowInput] = useState(false);
  const [inputPos, setInputPos] = useState([0, 0]);
  const [showProperties, setShowProperties] = useState(false);
  const [showJoinAlert, setShowJoinAlert] = useState<boolean>(false);
  const [showLeaveAlert, setShowLeaveAlert] = useState<boolean>(false);

  const [lines, setLines] = useState([[0, 0]]);
  const [texts, setTexts] = useState([{ text: "", pos: [0, 0] }]);
  const [arrows, setArrows] = useState<ArrowTypes[]>([]);
  const [circles, setCircles] = useState<CircleTypes[]>([
    { x: 0, y: 0, radius: 0, stroke: "", strokeWidth: 0, isDragging: false },
  ]);
  const [rectangles, setRectangles] = useState<RectangleTypes[]>([
    {
      x: 0,
      y: 0,
      width: 0,
      height: 0,
      stroke: "",
      strokeWidth: 0,
    },
  ]);

  const isDrawing = useRef(false);
  const lastArrow = useRef<ArrowTypes>({
    points: [],
  });
  const lastLine = useRef<number[]>([]);
  const lastCircle = useRef<CircleTypes>({
    x: undefined,
    y: undefined,
    radius: 0,
    stroke: "#000",
    strokeWidth: 2,
    isDragging: false,
  });
  const lastRectangle = useRef<RectangleTypes>({
    x: undefined,
    y: undefined,
    width: 0,
    height: 0,
    stroke: "#000",
    strokeWidth: 0,
  });

  const [ws, setWs] = useState<WebSocket | null>();
  const handleMouseUp = () => {
    isDrawing.current = false;
  };

  useEffect(() => {
    if (typeof window === "undefined") return;
    window.addEventListener("dblclick", (e) => {
      const x = e.clientX;
      const y = e.clientY;
      setTool("text");
      setInputPos([x, y]);
      setShowInput(true);
    });
    window.addEventListener("keypress", (e) => {
      if (e.key === "1") {
        setIsDraggable(true);
      }
    });
    window.addEventListener("keypress", (e) => {
      if (e.key === "2") {
        setTool("text");
      }
    });
    window.addEventListener("keypress", (e) => {
      if (e.key === "3") {
        setTool("pen");
      }
    });
    window.addEventListener("keypress", (e) => {
      if (e.key === "4") {
        setTool("circle");
      }
    });
    window.addEventListener("keypress", (e) => {
      if (e.key === "5") {
        setTool("rectangle");
      }
    });
    window.addEventListener("keypress", (e) => {
      if (e.key === "6") {
        setTool("arrow");
      }
    });

    return () => {};
  }, []);

  useEffect(() => {
    const webSocket = InitWebSocket({
      url: "ws://localhost:8000/",
      setClientId,
      setArrows,
      setCircles,
      setLines,
      setRectangles,
      setTexts,
      setCreatedRoomId,
      setClientJoined,
      setShowJoinAlert,
      setClientLeft,
      setShowLeaveAlert,
    });
    setWs(webSocket);
    return () => {
      webSocket.close();
    };
  }, []);

  return (
    <div className="w-screen h-screen relative overflow-hidden">
      {showJoinAlert ? <JoinAlert id={clientJoined} /> : null}
      {showLeaveAlert ? <LeaveAlert id={clientLeft} /> : null}
      <Header
        createdRoomId={createdRoomId}
        ws={ws}
        setRoomJoined={setRoomJoined}
        roomJoined={roomJoined}
        roomId={roomId}
        lines={lines}
        rectangles={rectangles}
        circles={circles}
        arrows={arrows}
        texts={texts}
        setRoomId={setRoomId}
        clientId={cliendId}
        showPropertiesPanel={showProperties}
        setShowPropertiesPanel={setShowProperties}
      />
      <PropertiesPanel
        // setCircleColor={setCircleColor}
        showPropertiesPanel={showProperties}
      />
      {showInput ? (
        <input
          autoFocus
          type="text"
          className="bg-transparent rounded-md outline-none text-xl text-white absolute z-10"
          style={showInput && { left: inputPos[0], top: inputPos[1] }}
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              setTexts([
                ...texts,
                { text: inputText, pos: [inputPos[0], inputPos[1]] },
              ]);
              setShowInput(false);
              setTool("pen");
              setInputText("");
              ws?.send(JSON.stringify({ texts }));
            }
          }}
        />
      ) : null}
      <Stage
        width={typeof window !== "undefined" ? window.innerWidth : 0}
        height={typeof window !== "undefined" ? window.innerHeight : 0}
        onMouseDown={(e) => {
          handleMouseDown({
            isDraggable,
            isDrawing,
            event: e,
            tool,
            lastArrow,
            lastLine,
            lastCircle,
            lastRectangle,
          });
        }}
        onMousemove={(event: KonvaEventObject<MouseEvent>) => {
          handleMouseMove({
            event: event,
            isDrawing,
            tool,
            lastLine,
            setLines,
            lines,
            lastCircle,
            circles,
            setCircles,
            lastRectangle,
            rectangles,
            setRectangles,
            ws,
            lastArrow,
            arrows,
            setArrows,
          });
        }}
        onMouseUp={handleMouseUp}
        className="border-2 border-black bg-[#121212]"
      >
        <Layer>
          {lines.map((line, i) => (
            <Line
              key={i}
              points={line}
              stroke={"#fff"}
              strokeWidth={3}
              opacity={1}
            />
          ))}
          {circles.map((circle, i) => (
            <CircleRenderer
              circle={circle}
              isDraggable={isDraggable}
              setCircles={setCircles}
              i={i}
              ws={ws}
              setIsDraggable={setIsDraggable}
              circles={circles}
              key={i}
            />
          ))}
          {texts.map((text, i) => (
            <Text
              key={i}
              text={text.text}
              x={text.pos[0]}
              y={text.pos[1]}
              fill={"#fff"}
              opacity={1}
              fontSize={20}
              fontStyle={"bold"}
              fontFamily={"Arial"}
              draggable={isDraggable}
              onDragEnd={(e) => {
                const x = e.target.x();
                const y = e.target.y();
                setTexts((t) => {
                  const newTexts = t;
                  newTexts[i].pos = [x, y];
                  return newTexts;
                });
                ws?.send(JSON.stringify({ texts }));
                setIsDraggable(false);
              }}
            />
          ))}
          {rectangles.map((rectangle, i) => (
            <RectangleRenderer
              i={i}
              isDraggable={isDraggable}
              rectangle={rectangle}
              rectangles={rectangles}
              setIsDraggable={setIsDraggable}
              setRectangles={setRectangles}
              ws={ws}
              key={i}
            />
          ))}
          {arrows.map((arrow, i) => (
            <Arrow
              points={arrow.points}
              hitStrokeWidth={3}
              pointerLength={10}
              key={i}
              stroke={"#fff"}
              fill={"#fff"}
              opacity={1}
              strokeWidth={3}
              // draggable={isDraggable}
              onDragEnd={(e) => {
                const x = e.target.x();
                const y = e.target.y();
                setArrows((a) => {
                  const newArrows = a;
                  newArrows[newArrows.length - 1].points = [
                    a[i].points[0],
                    a[i].points[1],
                    x,
                    y,
                  ];
                  return newArrows;
                });
                setIsDraggable(false);
              }}
            />
          ))}
        </Layer>
      </Stage>
      <ToolPanel
        isDrawing={isDrawing}
        setIsDraggable={setIsDraggable}
        setTool={setTool}
      />
    </div>
  );
};

export default Whiteboard;
