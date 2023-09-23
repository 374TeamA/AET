import Root from "./layout/Root.tsx";
import { BrowserRouter as Router } from "react-router-dom";
import Routers from "./Routes.tsx";
function App() {
  return (
    <>
      <Root>
        <Routers />
      </Root>
    </>
  );
}

export default App;
