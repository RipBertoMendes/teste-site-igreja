import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import styles from './Login.module.css';

function validaCPF(cpf) {
  const cpfLimpo = String(cpf).replace(/[^\d]/g, '');
  if (cpfLimpo.length !== 11) return false;
  if (/^(\d)\1+$/.test(cpfLimpo)) return false;
  
  let soma = 0;
  let resto;

  for (let i = 1; i <= 9; i++) soma += parseInt(cpfLimpo.substring(i - 1, i)) * (11 - i);
  resto = (soma * 10) % 11;
  if (resto === 10 || resto === 11) resto = 0;
  if (resto !== parseInt(cpfLimpo.substring(9, 10))) return false;

  soma = 0;
  for (let i = 1; i <= 10; i++) soma += parseInt(cpfLimpo.substring(i - 1, i)) * (12 - i);
  resto = (soma * 10) % 11;
  if (resto === 10 || resto === 11) resto = 0;
  if (resto !== parseInt(cpfLimpo.substring(10, 11))) return false;
  
  return true;
}

function Login() {
  const [isRegistering, setIsRegistering] = useState(false);
  const { login, register } = useAuth();

  const [loginForm, setLoginForm] = useState({ cpf: '', password: '' });
  const [registerForm, setRegisterForm] = useState({
    nomeCompleto: '', 
    dataNascimento: '', 
    cpf: '', 
    genero: '', 
    nacionalidade: '',
    naturalidade: '', 
    telefone: '', 
    email: '', 
    password: ''
  });
  
  const validateRegisterForm = (formData) => {
    const errors = [];
    const today = new Date();
    const birthDate = new Date(formData.dataNascimento);

    if (!formData.nomeCompleto.trim() || !formData.dataNascimento || !formData.cpf.trim() || !formData.password) {
      errors.push('Por favor, preencha todos os campos marcados com *');
    }

    if (formData.nomeCompleto.trim().split(' ').length < 2) {
      errors.push('Por favor, insira seu nome completo.');
    }

    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.push('O e-mail informado não é válido.');
    }


    if (formData.cpf.trim() && !validaCPF(formData.cpf)) {
      errors.push('O CPF informado não é válido.');
    }

    if (isNaN(birthDate.getTime())) {
      errors.push('Data de nascimento inválida.');
    } else {
      let age = today.getFullYear() - birthDate.getFullYear();
      const m = today.getMonth() - birthDate.getMonth();
      if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) age--;
      if (age < 0) errors.push('A data de nascimento não pode ser no futuro.');
      if (age > 120) errors.push('A idade máxima permitida é de 120 anos.');
    }
    
    return errors;
  };

  const handleLoginChange = (e) => setLoginForm({ ...loginForm, [e.target.name]: e.target.value });

  const handleRegisterChange = (e) => {
    const { name, value } = e.target;
    setRegisterForm(prev => ({ ...prev, [name]: value }));
  };
  
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    try {
      const credentials = {
        cpf: loginForm.cpf.trim(),
        password: loginForm.password.trim(),
      };
      await login(credentials);
    } catch (error) {
      alert('Falha no login: ' + error.response.data.message);
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    
    const trimmedForm = {
        ...registerForm,
        nomeCompleto: registerForm.nomeCompleto.trim(),
        cpf: registerForm.cpf.trim(),
    };
    
    const validationErrors = validateRegisterForm(trimmedForm);

    if (validationErrors.length > 0) {
      alert('Por favor, corrija os seguintes erros:\n- ' + validationErrors.join('\n- '));
      return;
    }

    const { age, ...dataToSend } = trimmedForm; 
    try {
      const response = await register(dataToSend);
      alert(response.message);
      setIsRegistering(false);
    } catch (error) {
      alert('Falha no cadastro: ' + error.response.data.message);
    }
  };
  
  return (
    <div className={styles.loginContainer}>
      <div className={styles.formWrapper}>
        <h1 className={styles.title}>{isRegistering ? 'Cadastre-se' : 'Fazer Login'}</h1>

        {!isRegistering ? (
          <form onSubmit={handleLoginSubmit} className={styles.form}>
            <div className={styles.formGroup}>
              <label htmlFor="loginCpf">CPF:</label>
              <input type="text" id="loginCpf" name="cpf" value={loginForm.cpf} onChange={handleLoginChange} required />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="loginPassword">Senha:</label>
              <input type="password" id="loginPassword" name="password" value={loginForm.password} onChange={handleLoginChange} required />
            </div>
            <button type="submit" className={styles.submitButton}>Entrar</button>
          </form>
        ) : (

          <form onSubmit={handleRegisterSubmit} className={styles.form}>
            <div className={styles.formGroup}><label>Nome Completo *</label><input type="text" name="nomeCompleto" value={registerForm.nomeCompleto} onChange={handleRegisterChange} /></div>
            <div className={styles.formGroup}><label>Data de Nascimento *</label><input type="date" name="dataNascimento" value={registerForm.dataNascimento} onChange={handleRegisterChange} /></div>
            <div className={styles.formGroup}><label>CPF *</label><input type="text" name="cpf" value={registerForm.cpf} onChange={handleRegisterChange} /></div>
            <div className={styles.formGroup}><label>Gênero</label><select name="genero" value={registerForm.genero} onChange={handleRegisterChange}><option value="">Selecione</option><option value="M">Masculino</option><option value="F">Feminino</option></select></div>
            <div className={styles.formGroup}><label>Nacionalidade</label><input type="text" name="nacionalidade" value={registerForm.nacionalidade} onChange={handleRegisterChange} /></div>
            <div className={styles.formGroup}><label>Naturalidade</label><input type="text" name="naturalidade" value={registerForm.naturalidade} onChange={handleRegisterChange} /></div>
            <div className={styles.formGroup}><label>Telefone</label><input type="tel" name="telefone" value={registerForm.telefone} onChange={handleRegisterChange} /></div>
            <div className={styles.formGroup}><label>E-mail </label><input type="email" name="email" value={registerForm.email} onChange={handleRegisterChange} /></div>
            <div className={styles.formGroup}><label>Senha *</label><input type="password" name="password" value={registerForm.password} onChange={handleRegisterChange} /></div>
            <button type="submit" className={styles.submitButton}>Cadastrar</button>
          </form>
        )}
        
        <p className={styles.toggleForm}>
          {isRegistering ? (
            <>Já tem uma conta? <span onClick={() => setIsRegistering(false)}>Faça Login</span></>
          ) : (
            <>Não tem uma conta? <span onClick={() => setIsRegistering(true)}>Cadastre-se</span></>
          )}
        </p>
      </div>
    </div>
  );
}

export default Login;