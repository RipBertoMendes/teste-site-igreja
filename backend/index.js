const express = require('express');
const bcrypt = require('bcryptjs');
const cors = require('cors');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');
const multer = require('multer');
const path = require('path');

const app = express();
const port = 3001;

const AVAILABLE_MINISTRIES = [
  'Ministério de Música',
  'Ação Social Comunitária',
  'Ministério de Educação',
  'Ministério de Jovens',
  'Ministério Infantil'
];

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});
const upload = multer({ storage: storage });

const dbPath = './db.json';

const readDB = () => {
  const data = fs.readFileSync(dbPath, 'utf-8');
  return JSON.parse(data);
};

const writeDB = (data) => {
  fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));
};

app.post('/users/:id/upload-photo', upload.single('profilePhoto'), (req, res) => {
  const { id } = req.params;
  
  if (!req.file) {
    return res.status(400).json({ message: 'Nenhum arquivo foi enviado.' });
  }

  const db = readDB();
  const userIndex = db.users.findIndex(user => user.id === id);

  if (userIndex === -1) {
    return res.status(404).json({ message: 'Usuário não encontrado.' });
  }

  const photoUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
  
  db.users[userIndex].foto = photoUrl;
  writeDB(db);

  const { password, ...userData } = db.users[userIndex];
  res.status(200).json({ message: 'Foto atualizada com sucesso!', user: userData });
});


app.listen(port, () => {
  console.log(`Servidor backend rodando em http://localhost:${port}`);
});

app.get('/', (req, res) => {
  res.send('Backend funcionando!');
});

app.post('/register', (req, res) => {
 const { 
  nomeCompleto, dataNascimento, cpf, genero, nacionalidade, 
  naturalidade, telefone, email, password 
 } = req.body;

 const cpfLimpo = String(cpf).replace(/[^\d]/g, '');

 if (!nomeCompleto || !dataNascimento || !cpfLimpo || !password ) {
  return res.status(400).json({ message: 'Campos obrigatórios (*) não foram preenchidos.' });
 }

 const db = readDB();
 const userExists = db.users.find(user => 
  user.cpf === cpfLimpo || (email && user.email === email)
 );

 if (userExists) {
  return res.status(409).json({ message: 'Usuário com este CPF ou E-mail já cadastrado.' });
 }

 const salt = bcrypt.genSaltSync(10);
 const hashedPassword = bcrypt.hashSync(password, salt);

 const newUser = {
  id: uuidv4(),
  nomeCompleto, dataNascimento, 
  cpf: cpfLimpo, 
  genero, nacionalidade,
  naturalidade, telefone, email,
  password: hashedPassword,
  foto: '',
  ministerios: [],
  estadoCivil: '',
  profissao: '',
  renda: '',
  endereco: {
   rua: '', numero: '', complemento: '', bairro: '', cidade: '', estado: ''
  }
 };

 db.users.push(newUser);
 writeDB(db);

 res.status(201).json({ message: 'Usuário registrado com sucesso!', userId: newUser.id });
});

app.post('/login', (req, res) => {
  const { cpf, password } = req.body;
  const cpfLimpo = String(cpf).replace(/[^\d]/g, '');
  const db = readDB();

  const user = db.users.find(u => u.cpf === cpfLimpo);

  if (!user) {
    return res.status(401).json({ message: 'CPF ou senha inválidos.' });
  }

  const passwordMatch = bcrypt.compareSync(password, user.password);

  if (passwordMatch) {
    const { password, ...userData } = user;
    res.status(200).json({ message: 'Login bem-sucedido!', user: userData });
  } else {
    res.status(401).json({ message: 'CPF ou senha inválidos.' });
  }
});

app.put('/users/:id', (req, res) => {
  const { id } = req.params;
  const updatedData = req.body;

  const db = readDB();
  const userIndex = db.users.findIndex(user => user.id === id);

  if (userIndex === -1) {
    return res.status(404).json({ message: 'Usuário não encontrado.' });
  }

  const originalUser = db.users[userIndex];
  if (updatedData.endereco) {
    updatedData.endereco = { ...originalUser.endereco, ...updatedData.endereco };
  }

  db.users[userIndex] = { ...originalUser, ...updatedData };
  writeDB(db);
  
  const { password, ...userData } = db.users[userIndex];
  res.status(200).json({ message: 'Usuário atualizado com sucesso!', user: userData });
});

app.post('/users/:id/ministerios', (req, res) => {
  const { id } = req.params;
  const { ministry } = req.body; 

  if (!ministry || !AVAILABLE_MINISTRIES.includes(ministry)) {
    return res.status(400).json({ message: 'Ministério inválido ou não fornecido.' });
  }

  const db = readDB();
  const userIndex = db.users.findIndex(user => user.id === id);

  if (userIndex === -1) {
    return res.status(404).json({ message: 'Usuário não encontrado.' });
  }
  if (db.users[userIndex].ministerios.includes(ministry)) {
    return res.status(409).json({ message: 'Usuário já faz parte deste ministério.' });
  }

  db.users[userIndex].ministerios.push(ministry);
  writeDB(db);

  const { password, ...userData } = db.users[userIndex];
  res.status(200).json({ message: 'Ministério adicionado com sucesso!', user: userData });
});

app.delete('/users/:id/ministerios', (req, res) => {
  const { id } = req.params;
  const { ministry } = req.body; 

  if (!ministry) {
    return res.status(400).json({ message: 'Nome do ministério não fornecido.' });
  }

  const db = readDB();
  const userIndex = db.users.findIndex(user => user.id === id);

  if (userIndex === -1) {
    return res.status(404).json({ message: 'Usuário não encontrado.' });
  }

  const user = db.users[userIndex];
  if (!user.ministerios.includes(ministry)) {
    return res.status(404).json({ message: 'Usuário não faz parte deste ministério.' });
  }

  user.ministerios = user.ministerios.filter(m => m !== ministry);
  writeDB(db);

  const { password, ...userData } = user;
  res.status(200).json({ message: 'Ministério removido com sucesso!', user: userData });
});

app.listen(port, () => {
  console.log(`Servidor backend rodando em http://localhost:${port}`);
});