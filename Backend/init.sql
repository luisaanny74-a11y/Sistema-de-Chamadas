CREATE DATABASE IF NOT EXISTS uninassau_chamada;
USE uninassau_chamada;

CREATE TABLE IF NOT EXISTS usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    senha_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- 1. Tabela de Turmas
CREATE TABLE IF NOT EXISTS turmas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    periodo VARCHAR(20) NOT NULL,
    professor_nome VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- 2. Tabela de Alunos
CREATE TABLE IF NOT EXISTS alunos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    matricula VARCHAR(20) UNIQUE NOT NULL,
    nome VARCHAR(100) NOT NULL,
    email VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- 3. Tabela Pivot: Alunos pertencentes às Turmas (N:M)
CREATE TABLE IF NOT EXISTS turma_alunos (
    turma_id INT,
    aluno_id INT,
    PRIMARY KEY (turma_id, aluno_id),
    FOREIGN KEY (turma_id) REFERENCES turmas(id) ON DELETE CASCADE,
    FOREIGN KEY (aluno_id) REFERENCES alunos(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- 4. Tabela de Chamadas (O evento da chamada em um dia específico)
CREATE TABLE IF NOT EXISTS chamadas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    turma_id INT NOT NULL,
    data_aula DATE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (turma_id) REFERENCES turmas(id) ON DELETE CASCADE
    ,UNIQUE KEY uq_chamada_turma_data (turma_id, data_aula)
) ENGINE=InnoDB;

-- 5. Registro de Presença de cada aluno na chamada
CREATE TABLE IF NOT EXISTS registro_presencas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    chamada_id INT NOT NULL,
    aluno_id INT NOT NULL,
    status ENUM('PRESENTE', 'FALTA', 'JUSTIFICADO') NOT NULL DEFAULT 'PRESENTE',
    FOREIGN KEY (chamada_id) REFERENCES chamadas(id) ON DELETE CASCADE,
    FOREIGN KEY (aluno_id) REFERENCES alunos(id) ON DELETE CASCADE,
    UNIQUE KEY uq_chamada_aluno (chamada_id, aluno_id) -- Impede duplicar o mesmo aluno na mesma chamada
) ENGINE=InnoDB;
