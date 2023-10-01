import Item from "./Item";
interface ColumnProps {
  title: string;
}

export default function Column({ title }: ColumnProps) {
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
      <Item />
      <Item />
      <Item />
      <Item />
      <Item />
      <Item />
      <Item />
      <Item />
      <Item />
      <Item />
    </div>
  );
}
