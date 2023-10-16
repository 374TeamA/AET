import logo from "../../img/holistic_finance_original_logo.png"
// https://vitejs.dev/guide/assets.html#static-asset-handling

export default function Header() {
  return (
    <div className="header">
      <img
        alt="logo"
        className="logo"
        src={logo}
      />
      <p
        className="title"
        style={{ paddingLeft: "2rem", fontWeight: "500", fontSize: "1.5rem" }}
      >
        Automated Expenses Tracker
      </p>
    </div>
  );
}
