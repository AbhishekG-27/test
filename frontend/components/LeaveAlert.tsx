import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useEffect, useState } from "react";

interface Props {
  id: string;
}

const JoinAlert = ({ id }: Props) => {
  const [showAlert, setShowAlert] = useState<boolean>(true);
  useEffect(() => {
    setTimeout(() => {
      setShowAlert(false);
    }, 4000);
  }, []);
  return (
    showAlert && (
      <Alert className="bg-[#121212] text-white">
        {/* <Terminal className="h-4 w-4" /> */}
        <AlertTitle>Heads up!</AlertTitle>
        <AlertDescription>{id} left the room.</AlertDescription>
      </Alert>
    )
  );
};

export default JoinAlert;
