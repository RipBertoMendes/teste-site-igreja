import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Navigate } from 'react-router-dom';
import styles from './Perfil.module.css';

const estadosBrasileiros = ['AC','AL','AP','AM','BA','CE','DF','ES','GO','MA','MT','MS','MG','PA','PB','PR','PE','PI','RJ','RN','RS','RO','RR','SC','SP','SE','TO'];
const AVAILABLE_MINISTRIES = ['Ministério de Música', 'Ação Social Comunitária', 'Ministério de Educação', 'Ministério de Jovens', 'Ministério Infantil'];
const estadosCivis = [ 'Solteiro(a)', 'Casado(a)', 'Divorciado(a)', 'Viúvo(a)'];

const calculateAge = (birthDateString) => {
  if (!birthDateString) return '';
  const birthDate = new Date(birthDateString);
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const m = today.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
};

function Perfil() {
  const { user, updateUser, uploadPhoto, addMinistry, removeMinistry } = useAuth();
  
  const [isEditing, setIsEditing] = useState(false);
  
  const [formData, setFormData] = useState({
    nomeCompleto: '',
    nacionalidade: '',
    naturalidade: '',
    telefone: '',
    email: ''
  });
  
  const [additionalInfo, setAdditionalInfo] = useState({
    estadoCivil: '', profissao: '', renda: '',
    endereco: { rua: '', numero: '', complemento: '', bairro: '', cidade: '', estado: '' }
  });

  const [selectedMinistry, setSelectedMinistry] = useState(AVAILABLE_MINISTRIES[0]);

  useEffect(() => {
    if (user) {
      setFormData({
        nomeCompleto: user.nomeCompleto || '',
        nacionalidade: user.nacionalidade || '',
        naturalidade: user.naturalidade || '',
        telefone: user.telefone || '',
        email: user.email || ''
      });
      setAdditionalInfo({
        estadoCivil: user.estadoCivil || '',
        profissao: user.profissao || '',
        renda: user.renda || '',
        endereco: user.endereco || { rua: '', numero: '', complemento: '', bairro: '', cidade: '', estado: '' }
      });
    }
  }, [user]);

  if (!user) {
    return <Navigate to="/login" />;
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({ ...prevData, [name]: value }));
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateUser(formData);
      setIsEditing(false);
      alert('Perfil atualizado com sucesso!');
    } catch (error) {
      alert('Não foi possível atualizar o perfil.');
    }
  };

  const handleCancelEdit = () => {
    if (user) {
      setFormData({
        nomeCompleto: user.nomeCompleto || '',
        nacionalidade: user.nacionalidade || '',
        naturalidade: user.naturalidade || '',
        telefone: user.telefone || '',
        email: user.email || ''
      });
    }
    setIsEditing(false);
  };

  const handleAdditionalInfoChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith('endereco.')) {
      const field = name.split('.')[1];
      const finalValue = field === 'estado' ? value.toUpperCase() : value;
      setAdditionalInfo(prev => ({
        ...prev,
        endereco: { ...prev.endereco, [field]: finalValue }
      }));
    } else {
      setAdditionalInfo(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleAdditionalInfoSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateUser(additionalInfo);
      alert('Informações salvas com sucesso!');
    } catch (error) {
      alert('Não foi possível salvar as informações.');
    }
  };

  const handleAddMinistry = async () => {
    try {
      const response = await addMinistry(selectedMinistry);
      alert(response.message);
    } catch (error) {
      alert('Falha ao entrar no ministério: ' + error.response.data.message);
    }
  };

  const handleRemoveMinistry = async (ministryName) => {
    if (window.confirm(`Você tem certeza que deseja sair do "${ministryName}"?`)) {
      try {
        const response = await removeMinistry(ministryName);
        alert(response.message);
      } catch (error) {
        alert('Falha ao sair do ministério: ' + error.response.data.message);
      }
    }
  };

  const handlePhotoChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      try {
        const response = await uploadPhoto(file);
        alert(response.message);
      } catch (error) {
        alert('Falha no upload da foto.');
      }
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.pageTitle}>Meu Perfil</h1>
      
      <div className={styles.profileHeader}>
  {/* A lógica condicional agora envolve apenas a parte de informações */}
  {isEditing ? (
    <form onSubmit={handleFormSubmit} className={styles.editForm}>
      <h2>Editar Informações Pessoais</h2>
      
      <p><strong>CPF:</strong> {user.cpf}</p>
      <p><strong>Data de Nascimento:</strong> {new Date(user.dataNascimento).toLocaleDateString('pt-BR', {timeZone: 'UTC'})}</p>
      <p><strong>Idade:</strong> {calculateAge(user.dataNascimento)} anos</p>
      <p><strong>Gênero:</strong> {user.genero === 'M' ? 'Masculino' : 'Feminino'}</p>
      <hr className={styles.divider} />
      
      <div className={styles.formGroup}><label>Nome Completo</label><input type="text" name="nomeCompleto" value={formData.nomeCompleto} onChange={handleInputChange} /></div>
      <div className={styles.formGroup}><label>Nacionalidade</label><input type="text" name="nacionalidade" value={formData.nacionalidade} onChange={handleInputChange} /></div>
      <div className={styles.formGroup}><label>Naturalidade</label><input type="text" name="naturalidade" value={formData.naturalidade} onChange={handleInputChange} /></div>
      <div className={styles.formGroup}><label>Telefone</label><input type="tel" name="telefone" value={formData.telefone} onChange={handleInputChange} /></div>
      <div className={styles.formGroup}><label>E-mail</label><input type="email" name="email" value={formData.email} onChange={handleInputChange} /></div>

      <div className={styles.buttonGroup}>
        <button type="submit" className={styles.saveButton}>Salvar</button>
        <button type="button" onClick={handleCancelEdit} className={styles.cancelButton}>Cancelar</button>
      </div>
    </form>
  ) : (
    <div className={styles.profileInfo}>
      <h2>Informações Pessoais</h2>
      <p><strong>Nome:</strong> {user.nomeCompleto}</p>
      <p><strong>Data de Nascimento:</strong> {new Date(user.dataNascimento).toLocaleDateString('pt-BR', {timeZone: 'UTC'})}</p>
      <p><strong>Idade:</strong> {calculateAge(user.dataNascimento)} anos</p>
      <p><strong>CPF:</strong> {user.cpf}</p>
      <p><strong>Gênero:</strong> {user.genero === 'M' ? 'Masculino' : 'Feminino'}</p>
      <p><strong>Nacionalidade:</strong> {user.nacionalidade || 'Não informado'}</p>
      <p><strong>Naturalidade:</strong> {user.naturalidade || 'Não informado'}</p>
      <p><strong>Telefone:</strong> {user.telefone || 'Não informado'}</p>
      <p><strong>E-mail:</strong> {user.email}</p>
      <button onClick={() => setIsEditing(true)} className={styles.editButton}>Editar</button>
    </div>
  )}

  <div className={styles.profileImage}>
    {user.foto ? 
      <img src={user.foto} alt="Foto do perfil" className={styles.photo} /> :
      <div className={styles.imagePlaceholder}>Sua Foto Aqui</div>
    }
    <input 
      type="file" 
      id="photoUpload" 
      style={{ display: 'none' }} 
      onChange={handlePhotoChange}
      accept="image/png, image/jpeg"
    />
    <label htmlFor="photoUpload" className={styles.uploadButton}>
      Subir Foto
    </label>
  </div>
</div>

<div className={styles.section}>
  <h2>Informações Adicionais</h2>
  <form onSubmit={handleAdditionalInfoSubmit}>
    <div className={styles.formRow}>
      <div className={styles.formGroup} style={{ flex: 1 }}>
        <label>Estado Civil</label>
        <select name="estadoCivil" value={additionalInfo.estadoCivil} onChange={handleAdditionalInfoChange}>
          <option value="">Prefiro não informar</option>
          {estadosCivis.map(status => (
            <option key={status} value={status}>{status}</option>
          ))}
        </select>
      </div>
      
      <div className={styles.formGroup} style={{ flex: 2 }}>
        <label>Profissão</label>
        <input type="text" name="profissao" value={additionalInfo.profissao} onChange={handleAdditionalInfoChange} />
      </div>
    </div>

    <div className={styles.formGroup}>
      <label>Faixa de Renda</label>
      <select name="renda" value={additionalInfo.renda} onChange={handleAdditionalInfoChange}>
        <option value="">Prefiro não informar</option>
        <option value="ate-1-salario">Até 1 salário mínimo</option>
        <option value="2-a-5-salarios">De 2 a 5 salários mínimos</option>
        <option value="5-a-10-salarios">De 5 a 10 salários mínimos</option>
        <option value="acima-10-salarios">Acima de 10 salários mínimos</option>
      </select>
    </div>
    
    <h3>Endereço</h3>
    <div className={styles.formRow}>
      <div className={styles.formGroup} style={{flex: 3}}><label>Rua/Avenida</label><input type="text" name="endereco.rua" value={additionalInfo.endereco.rua} onChange={handleAdditionalInfoChange} /></div>
      <div className={styles.formGroup} style={{flex: 1}}><label>Número</label><input type="text" name="endereco.numero" value={additionalInfo.endereco.numero} onChange={handleAdditionalInfoChange} maxLength="6" /></div>
    </div>
    <div className={styles.formRow}>
      <div className={styles.formGroup}><label>Complemento</label><input type="text" name="endereco.complemento" value={additionalInfo.endereco.complemento} onChange={handleAdditionalInfoChange} maxLength="155" /></div>
      <div className={styles.formGroup}><label>Bairro</label><input type="text" name="endereco.bairro" value={additionalInfo.endereco.bairro} onChange={handleAdditionalInfoChange} maxLength="50" /></div>
    </div>
    <div className={styles.formRow}>
      <div className={styles.formGroup} style={{flex: 2}}><label>Cidade</label><input type="text" name="endereco.cidade" value={additionalInfo.endereco.cidade} onChange={handleAdditionalInfoChange} maxLength="60" /></div>
      <div className={styles.formGroup} style={{flex: 1}}><label>Estado</label><select name="endereco.estado" value={additionalInfo.endereco.estado} onChange={handleAdditionalInfoChange}><option value="">UF</option>{estadosBrasileiros.map(uf => <option key={uf} value={uf}>{uf}</option>)}</select></div>
    </div>

    <button type="submit" className={styles.saveButton}>Salvar Informações</button>
  </form>
</div>
      
      <div className={styles.section}>
        <h2>Meus Voluntariados</h2>
        <ul className={styles.voluntariadoList}>
          {user.ministerios && user.ministerios.length > 0 ? (
            user.ministerios.map((item, index) => (
              <li key={index}>
                <span>{item}</span>
                <button onClick={() => handleRemoveMinistry(item)} className={styles.removeButton}>Sair</button>
              </li>
            ))
          ) : (<p>Você ainda não faz parte de nenhum ministério.</p>)}
        </ul>
        
        <div className={styles.addMinistrySection}>
          <h3>Entrar em um Ministério</h3>
          <div className={styles.ministryForm}>
            <select value={selectedMinistry} onChange={(e) => setSelectedMinistry(e.target.value)} className={styles.ministrySelect}>
              {AVAILABLE_MINISTRIES.map(ministry => (<option key={ministry} value={ministry}>{ministry}</option>))}
            </select>
            <button onClick={handleAddMinistry} className={styles.addButton}>Participar</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Perfil;