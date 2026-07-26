# Sistema de Chamadas

## Sobre o projeto

Este projeto consiste em um sistema web para gestão acadêmica, desenvolvido com o objetivo de facilitar o cadastro de matérias, alunos, vinculação entre esses cadastros e o registro de chamadas. A aplicação foi criada para oferecer uma solução prática, organizada e de fácil utilização, permitindo que os usuários realizem operações essenciais de forma rápida e centralizada.

A estrutura do sistema foi organizada em frontend e backend, garantindo uma separação clara entre a interface de interação e a lógica de negócio. O backend é responsável pelo processamento dos dados, validação das informações e integração com o banco de dados, enquanto o frontend disponibiliza uma interface intuitiva para o usuário final.

### Funcionalidades principais

- Cadastro de matérias
- Cadastro de alunos
- Vinculação de alunos às matérias
- Registro e acompanhamento de chamadas

### Tecnologias e ferramentas utilizadas

- Linguagem principal: JavaScript
- Backend: Node.js
- Frontend: interface web com Vite
- Banco de dados: MySQL
- Versionamento: Git/GitHub

O projeto foi desenvolvido com foco em usabilidade, organização e manutenção, sendo uma solução adequada para ambientes acadêmicos que precisam controlar presença e relacionamento entre alunos e disciplinas de maneira simples e eficiente.

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
