import { Transaction } from "../../types/transaction";
import Item from "./Item";
interface ColumnProps {
  title: string;
  items: Transaction[];
}

export default function Column({ title, items }: ColumnProps) {
  return (
    <div className="column">
      <div
        style={{
          width: "100%",
          display: "flex",
          justifyContent: "center"
        }}
      >
        {title}
      </div>
      {items.map((transaction) => (
        <Item transaction={transaction} />
      ))}
    </div>
  );
}
