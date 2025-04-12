import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Home from "./components/Home";
import ImageGeneration from "./components/ImageGeneration";
import ImageEditing from "./components/ImageEditing";
import Creations from "./components/Creations";
import SliderPage from "./components/SliderPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="generate" element={<ImageGeneration />} />
          <Route path="edit" element={<ImageEditing />} />
          <Route path="creations" element={<Creations />} />
          <Route path="slider" element={<SliderPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
