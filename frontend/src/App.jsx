
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Cadastro from "./Cadastro"; // <- caminho correto

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/cadastro" />} />
        <Route path="/cadastro" element={<Cadastro />} />
      </Routes>
    </BrowserRouter>
  );
}
