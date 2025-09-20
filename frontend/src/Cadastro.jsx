import React, { useState } from "react";
import "./Cadastro.css";

function EyeIcon({ open }) {
 
  return open ? (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7S1 12 1 12z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ) : (
    
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="M17.94 17.94A10.94 10.94 0 0 1 12 19c-7 0-11-7-11-7 .78-1.47 2-3 3.66-4.3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M1 1l22 22" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M9.88 9.88a3 3 0 0 0 4.24 4.24" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

export default function Cadastro() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirm: "",
  });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);


  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = "Informe seu nome.";
    const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email);
    if (!form.email) e.email = "Informe seu e-mail.";
    else if (!emailOk) e.email = "E-mail inválido.";
    if (!form.password) e.password = "Crie uma senha.";
    else if (form.password.length < 6) e.password = "Mínimo de 6 caracteres.";
    if (!form.confirm) e.confirm = "Confirme a senha.";
    else if (form.confirm !== form.password) e.confirm = "As senhas não conferem.";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleChange = (ev) => {
    const { name, value } = ev.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const handleSubmit = (ev) => {
    ev.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    
    setTimeout(() => {
      alert(`Cadastro OK!\nNome: ${form.name}\nEmail: ${form.email}`);
      setSubmitting(false);
      
    }, 700);
  };

  return (
    <div className="page">
      <div className="card">
        <h1>Cadastro</h1>

        <form onSubmit={handleSubmit} noValidate>
          <div className="field">
            <label htmlFor="name">Nome</label>
            <input
              id="name"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Seu nome"
            />
            {errors.name && <p className="error">{errors.name}</p>}
          </div>

          <div className="field">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              placeholder="voce@exemplo.com"
            />
            {errors.email && <p className="error">{errors.email}</p>}
          </div>

          <div className="field field-password">
            <label htmlFor="password">Senha</label>
            <div className="input-with-icon">
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                value={form.password}
                onChange={handleChange}
                placeholder="mín. 6 caracteres"
                autoComplete="new-password"
              />
              <button
                type="button"
                aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
                className="btn-icon"
                onClick={() => setShowPassword((s) => !s)}
              >
                <EyeIcon open={showPassword} />
              </button>
            </div>
            {errors.password && <p className="error">{errors.password}</p>}
          </div>

          <div className="field field-password">
            <label htmlFor="confirm">Confirmar senha</label>
            <div className="input-with-icon">
              <input
                id="confirm"
                name="confirm"
                type={showConfirm ? "text" : "password"}
                value={form.confirm}
                onChange={handleChange}
                placeholder="Repita a senha"
                autoComplete="new-password"
              />
              <button
                type="button"
                aria-label={showConfirm ? "Ocultar confirmação" : "Mostrar confirmação"}
                className="btn-icon"
                onClick={() => setShowConfirm((s) => !s)}
              >
                <EyeIcon open={showConfirm} />
              </button>
            </div>
            {errors.confirm && <p className="error">{errors.confirm}</p>}
          </div>

          <button type="submit" disabled={submitting}>
            {submitting ? "Enviando..." : "Cadastrar"}
          </button>
        </form>
      </div>
    </div>
  );
}
