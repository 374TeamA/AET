import { Button } from "@mui/material";

interface CustomButtonProps {
  onClick: () => void;
  children: React.ReactNode;
  id?: string;
}
export default function CustomButton({
  children,
  onClick,
  id
}: CustomButtonProps) {
  return (
    <Button
      id={id}
      style={{
        margin: "0.1rem",
        maxHeight: "2.5rem",
        paddingLeft: "2.5rem",
        paddingRight: "2.5rem"
      }}
      onClick={onClick}
      variant="contained"
    >
      {children}
    </Button>
  );
}
