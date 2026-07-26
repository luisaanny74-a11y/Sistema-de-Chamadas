# Sistema de Chamadas

Aplicacao para cadastrar materias e alunos, vincular alunos as materias e registrar chamadas.

## Executar localmente

1. No MySQL, execute `Backend/init.sql`.
2. Configure `Backend/.env` conforme `Backend/.env.example`.
3. Em dois terminais, execute:

```powershell
cd Backend
npm install
npm run setup
npm run dev
```

```powershell
cd Frontend
npm install
npm run dev
```

Abra `http://127.0.0.1:5173`.

## Publicar no GitHub

1. Crie um repositorio vazio no GitHub, sem adicionar README ou `.gitignore` pelo site.
2. No terminal, na pasta raiz deste projeto, execute:

```powershell
git init
git add .
git commit -m "Sistema de chamadas"
git branch -M main
git remote add origin https://github.com/SEU_USUARIO/SEU_REPOSITORIO.git
git push -u origin main
```

3. O arquivo `.gitignore` ja esta pronto; ele impede o envio de dependencias, arquivos gerados e da configuracao local do banco.
