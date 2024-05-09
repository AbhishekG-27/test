import { ArrowTypes, CircleTypes, RectangleTypes } from "../lib/types";

interface WebSocketProps {
  url: string;
  setClientId: React.Dispatch<React.SetStateAction<string>>;
  setRectangles: React.Dispatch<React.SetStateAction<RectangleTypes[]>>;
  setCircles: React.Dispatch<React.SetStateAction<CircleTypes[]>>;
  setLines: React.Dispatch<React.SetStateAction<number[][]>>;
  setArrows: React.Dispatch<React.SetStateAction<ArrowTypes[]>>;
  setTexts: React.Dispatch<
    React.SetStateAction<{ text: string; pos: number[] }[]>
  >;
  setCreatedRoomId: React.Dispatch<React.SetStateAction<string>>;
  setClientJoined: React.Dispatch<React.SetStateAction<string>>;
  setShowJoinAlert: React.Dispatch<React.SetStateAction<boolean>>;
  setClientLeft: React.Dispatch<React.SetStateAction<string>>;
  setShowLeaveAlert: React.Dispatch<React.SetStateAction<boolean>>;
}

export const InitWebSocket = ({
  url,
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
}: WebSocketProps) => {
  const websocket = new WebSocket(url);

  websocket.onopen = () => {
    console.log("Connected from client to websocket server.");
  };

  websocket.onclose = () => {
    console.log("disconnected from client to websocket server.");
  };

  websocket.onmessage = async (message) => {
    const data = await JSON.parse(message.data);
    // console.log(data);
    if (data.type === "id") setClientId(data.message);
    else if (data.type === "room-created") {
      setCreatedRoomId(data.roomId);
      // console.log(data.roomId);
    } else if (data.rectangles) {
      setRectangles(data.rectangles);
    } else if (data.circles) {
      setCircles(data.circles);
    } else if (data.lines) {
      setLines(data.lines);
    } else if (data.arrows) {
      setArrows(data.arrows);
    } else if (data.texts) {
      setTexts(data.texts);
    } else if (data.type === "someone-joined-room") {
      // console.log(data.id);
      setShowJoinAlert(true);
      setTimeout(() => {
        setShowJoinAlert(false);
      }, 5000);
      setClientJoined(data.id);
    } else if (data.type === "leave-room") {
      setShowLeaveAlert(true);
      setTimeout(() => {
        setShowLeaveAlert(false);
      }, 5000);
      setClientLeft(data.id);
    }
  };
  return websocket;
};
