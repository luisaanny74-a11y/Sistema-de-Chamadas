import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import routes from './routes/index.js';

// Carrega as variáveis do arquivo .env
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3333;

// Middlewares Globais de Segurança e Parsing
app.use(cors());
app.use(express.json());

// Acopla todas as rotas configuradas sob o prefixo /api
app.use('/api', routes);

// Middleware global para tratamento de rotas não encontradas (404)
app.use((req, res) => {
  res.status(404).json({ error: `Rota ${req.originalUrl} não encontrada.` });
});

// Inicialização do Servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando com sucesso!`);
  console.log(`Localhost: http://localhost:${PORT}`);
  console.log(`Status da API: http://localhost:${PORT}/api/status`);
});
