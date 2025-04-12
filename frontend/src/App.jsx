import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Home from "./components/Home";
import ImageGeneration from "./components/ImageGeneration";
import ImageEditing from "./components/ImageEditing";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="generate" element={<ImageGeneration />} />
          <Route path="edit" element={<ImageEditing />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
