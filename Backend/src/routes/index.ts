import { Router } from 'express';
import type { Request, Response } from 'express';
import { randomBytes, scryptSync, timingSafeEqual } from 'node:crypto';
import pool from '../config/database.js';

const routes = Router();
const hashPassword = (password: string) => { const salt = randomBytes(16).toString('hex'); return `${salt}:${scryptSync(password, salt, 64).toString('hex')}`; };
const passwordMatches = (password: string, stored: string) => { const [salt, hash] = stored.split(':'); if (!salt || !hash) return false; const actual = scryptSync(password, salt, 64); return timingSafeEqual(actual, Buffer.from(hash, 'hex')); };

routes.get('/status', (_req, res) => res.json({ status: 'online' }));

routes.post('/auth/cadastro', async (req: Request, res: Response) => {
  const { nome, email, senha } = req.body;
  if (typeof nome !== 'string' || typeof email !== 'string' || typeof senha !== 'string' || nome.trim().length < 2 || !email.includes('@') || senha.length < 6) return res.status(400).json({ error: 'Informe nome, email valido e senha de ao menos 6 caracteres.' });
  try { const [result] = await pool.query('INSERT INTO usuarios (nome, email, senha_hash) VALUES (?, ?, ?)', [nome.trim(), email.trim().toLowerCase(), hashPassword(senha)]); res.status(201).json({ id: (result as { insertId: number }).insertId, nome: nome.trim(), email: email.trim().toLowerCase() }); }
  catch { res.status(409).json({ error: 'Este email ja esta cadastrado.' }); }
});

routes.post('/auth/login', async (req: Request, res: Response) => {
  const { email, senha } = req.body;
  try { const [rows] = await pool.query('SELECT id, nome, email, senha_hash FROM usuarios WHERE email = ?', [String(email).toLowerCase()]); const user = (rows as Array<{ id: number; nome: string; email: string; senha_hash: string }>)[0]; if (!user || typeof senha !== 'string' || !passwordMatches(senha, user.senha_hash)) return res.status(401).json({ error: 'Email ou senha incorretos.' }); res.json({ id: user.id, nome: user.nome, email: user.email }); }
  catch { res.status(500).json({ error: 'Nao foi possivel entrar.' }); }
});

routes.get('/turmas', async (_req, res) => { try { const [rows] = await pool.query('SELECT id, nome, periodo, professor_nome AS professor FROM turmas ORDER BY nome'); res.json(rows); } catch { res.status(500).json({ error: 'Nao foi possivel carregar as materias.' }); } });
routes.post('/turmas', async (req, res) => { const { nome, periodo, professor } = req.body; if (![nome, periodo, professor].every((value) => typeof value === 'string' && value.trim())) return res.status(400).json({ error: 'Preencha todos os dados da materia.' }); try { const [result] = await pool.query('INSERT INTO turmas (nome, periodo, professor_nome) VALUES (?, ?, ?)', [nome.trim(), periodo.trim(), professor.trim()]); res.status(201).json({ id: (result as { insertId: number }).insertId }); } catch { res.status(500).json({ error: 'Nao foi possivel cadastrar a materia.' }); } });
routes.get('/alunos', async (_req, res) => { try { const [rows] = await pool.query('SELECT id, matricula, nome, email FROM alunos ORDER BY nome'); res.json(rows); } catch { res.status(500).json({ error: 'Nao foi possivel carregar os alunos.' }); } });
routes.post('/alunos', async (req, res) => { const { nome, matricula, email } = req.body; if (![nome, matricula].every((value) => typeof value === 'string' && value.trim())) return res.status(400).json({ error: 'Nome e matricula sao obrigatorios.' }); try { const [result] = await pool.query('INSERT INTO alunos (nome, matricula, email) VALUES (?, ?, ?)', [nome.trim(), matricula.trim(), String(email ?? '').trim() || null]); res.status(201).json({ id: (result as { insertId: number }).insertId }); } catch { res.status(409).json({ error: 'Esta matricula ja esta cadastrada.' }); } });
routes.get('/turmas/:id/alunos', async (req, res) => { try { const [rows] = await pool.query('SELECT alunos.id, alunos.matricula, alunos.nome, alunos.email FROM alunos INNER JOIN turma_alunos ON turma_alunos.aluno_id = alunos.id WHERE turma_alunos.turma_id = ? ORDER BY alunos.nome', [Number(req.params.id)]); res.json(rows); } catch { res.status(500).json({ error: 'Nao foi possivel carregar os alunos.' }); } });
routes.post('/turmas/:id/alunos', async (req, res) => { try { await pool.query('INSERT IGNORE INTO turma_alunos (turma_id, aluno_id) VALUES (?, ?)', [Number(req.params.id), Number(req.body.alunoId)]); res.status(201).json({ message: 'Aluno vinculado.' }); } catch { res.status(500).json({ error: 'Nao foi possivel vincular o aluno.' }); } });
routes.post('/chamadas', async (req, res) => { const { turmaId, dataAula, registros } = req.body; if (!Number(turmaId) || !/^\d{4}-\d{2}-\d{2}$/.test(dataAula) || !Array.isArray(registros) || !registros.length) return res.status(400).json({ error: 'Dados da chamada invalidos.' }); const connection = await pool.getConnection(); try { await connection.beginTransaction(); const [call] = await connection.query('INSERT INTO chamadas (turma_id, data_aula) VALUES (?, ?) ON DUPLICATE KEY UPDATE id = LAST_INSERT_ID(id)', [turmaId, dataAula]); const id = (call as { insertId: number }).insertId; await connection.query('DELETE FROM registro_presencas WHERE chamada_id = ?', [id]); await connection.query('INSERT INTO registro_presencas (chamada_id, aluno_id, status) VALUES ?', [registros.map((item: { alunoId: number; status: string }) => [id, item.alunoId, item.status])]); await connection.commit(); res.status(201).json({ id }); } catch { await connection.rollback(); res.status(500).json({ error: 'Nao foi possivel registrar a chamada.' }); } finally { connection.release(); } });

export default routes;
