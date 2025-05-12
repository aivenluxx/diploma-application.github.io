import Background from "./components/MainPage/Background";
import Dashboard from "./components/MainPage/Dashboard";
import SidePanel from "./components/MainPage/SidePanel";
import Speedometer from "./components/MainPage/Speedometer";

function App() {
  return (
    <div className="App">
      <SidePanel/>
      <Speedometer/>
      <Background/>
      <Dashboard/>
    </div>
  );
}

export default App;
