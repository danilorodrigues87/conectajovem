import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { HomePage } from './pages/HomePage';
import { VagasPage } from './pages/VagasPage';
import { VagaDetalhePage } from './pages/VagaDetalhePage';
import { EmpresasPage } from './pages/EmpresasPage';
import { LoginPage } from './pages/LoginPage';
import { CadastroCandidatoPage } from './pages/CadastroCandidatoPage';
import { CadastroEmpresaPage } from './pages/CadastroEmpresaPage';
import { ComoFuncionaPage } from './pages/ComoFuncionaPage';
import { ContatoPage } from './pages/ContatoPage';
import { CandidatoDashboardPage } from './pages/CandidatoDashboardPage';
import { EmpresaDashboardPage } from './pages/EmpresaDashboardPage';
import { getRole, getToken } from './lib/api';

function Private({ children, role }: { children: JSX.Element; role: 'candidato' | 'empresa' }) {
  if (!getToken() || getRole() !== role) return <Navigate to="/login" replace />;
  return children;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/vagas" element={<VagasPage />} />
        <Route path="/vagas/:slug" element={<VagaDetalhePage />} />
        <Route path="/empresas" element={<EmpresasPage />} />
        <Route path="/como-funciona" element={<ComoFuncionaPage />} />
        <Route path="/contato" element={<ContatoPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/cadastro" element={<CadastroCandidatoPage />} />
        <Route path="/cadastro/empresa" element={<CadastroEmpresaPage />} />
        <Route path="/candidato" element={<Private role="candidato"><CandidatoDashboardPage /></Private>} />
        <Route path="/empresa" element={<Private role="empresa"><EmpresaDashboardPage /></Private>} />
      </Routes>
    </BrowserRouter>
  );
}
