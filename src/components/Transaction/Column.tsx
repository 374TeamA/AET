import { Transaction } from "../../types/transaction";
import Item from "./Item";
interface ColumnProps {
  title: string;
  items: Transaction[];
  categories: {
    [key: string]: string;
  };
  updateTransactions: (transaction: Transaction) => void;
}

export default function Column({
  title,
  items,
  categories,
  updateTransactions
}: ColumnProps) {
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
        <Item
          transaction={transaction}
          categories={categories}
          updateTransactions={updateTransactions}
          key={transaction.id}
        />
      ))}
    </div>
  );
}
