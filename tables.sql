CREATE TABLE fabricante
(
  id INT NOT NULL AUTO_INCREMENT,
  nome VARCHAR(255) NOT NULL,
  modelo VARCHAR(255) NOT NULL,
  createdOn DATE NOT NULL,
  updatedOn DATE NOT NULL,
  PRIMARY KEY (id)
);

CREATE TABLE pais
(
  id INT NOT NULL AUTO_INCREMENT,
  nome VARCHAR(255) NOT NULL,
  codigo INT NOT NULL,
  createdOn DATE NOT NULL,
  updatedOn DATE NOT NULL,
  PRIMARY KEY (id)
);

CREATE TABLE distrito
(
  id INT NOT NULL AUTO_INCREMENT,
  nome VARCHAR(255) NOT NULL,
  createdOn DATE NOT NULL,
  updatedOn DATE NOT NULL,
  codigo_ine INT NOT NULL,
  id_pais INT NOT NULL,
  PRIMARY KEY (id),
  FOREIGN KEY (id_pais) REFERENCES pais(id) ON DELETE CASCADE
);

CREATE TABLE municipio
(
  id INT NOT NULL AUTO_INCREMENT,
  nome VARCHAR(255) NOT NULL,
  createdOn DATE NOT NULL,
  updatedOn DATE NOT NULL,
  codigo_ine INT NOT NULL,
  id_distrito INT NOT NULL,
  PRIMARY KEY (id),
  FOREIGN KEY (id_distrito) REFERENCES distrito(id) ON DELETE CASCADE
);

CREATE TABLE freguesia
(
  id INT NOT NULL AUTO_INCREMENT,
  nome VARCHAR(255) NOT NULL,
  createdOn DATE NOT NULL,
  updatedOn DATE NOT NULL,
  codigo_ine INT NOT NULL,
  id_municipio INT NOT NULL,
  PRIMARY KEY (id),
  FOREIGN KEY (id_municipio) REFERENCES municipio(id) ON DELETE CASCADE
);

CREATE TABLE morada
(
  id INT NOT NULL AUTO_INCREMENT,
  rua VARCHAR(255) NOT NULL,
  createdOn DATE NOT NULL,
  updatedOn DATE NOT NULL,
  codigo_postal INT NOT NULL,
  id_freguesia INT NOT NULL,
  PRIMARY KEY (id),
  FOREIGN KEY (id_freguesia) REFERENCES freguesia(id) ON DELETE CASCADE
);

CREATE TABLE utilizador
(
  id INT NOT NULL AUTO_INCREMENT,
  nome VARCHAR(255) NOT NULL,
  telefone INT NOT NULL,
  email VARCHAR(255) NOT NULL,
  especialidade VARCHAR(255) NOT NULL,
  password VARCHAR(255) NOT NULL,
  createdOn DATE NOT NULL,
  updatedOn DATE NOT NULL,
  id_morada INT NOT NULL,
  PRIMARY KEY (id),
  FOREIGN KEY (id_morada) REFERENCES morada(id) ON DELETE CASCADE
);

CREATE TABLE drone
(
  id INT NOT NULL AUTO_INCREMENT,
  propulsao VARCHAR(255) NOT NULL,
  num_rotores INT NOT NULL,
  peso FLOAT NOT NULL,
  alcance_max FLOAT NOT NULL,
  altitude_max FLOAT NOT NULL,
  tempo_voo_max VARCHAR(255) NOT NULL,
  tempo_bateria VARCHAR(255) NOT NULL,
  velocidade_max VARCHAR(255) NOT NULL,
  velocidade_ascente VARCHAR(255) NOT NULL,
  velocidade_descendente VARCHAR(255) NOT NULL,
  resistencia_vento VARCHAR(255) NOT NULL,
  temperatura INT NOT NULL,
  sistema_localizacao VARCHAR(255) NOT NULL,
  tipo_camera VARCHAR(255) NOT NULL,
  comprimento_img INT NOT NULL,
  largura_img INT NOT NULL,
  fov INT NOT NULL,
  resolucao_cam VARCHAR(255) NOT NULL,
  createdOn DATE NOT NULL,
  updatedOn DATE NOT NULL,
  id_fabricante INT NOT NULL,
  PRIMARY KEY (id),
  FOREIGN KEY (id_fabricante) REFERENCES fabricante(id) ON DELETE CASCADE
);

CREATE TABLE tipo
(
  id INT NOT NULL AUTO_INCREMENT,
  nome VARCHAR(255) NOT NULL,
  descricao VARCHAR(255) NOT NULL,
  tipologia VARCHAR(100) NOT NULL,
  area FLOAT NOT NULL,
  altura FLOAT NOT NULL,
  data_util DATE NOT NULL,
  periodo INT NOT NULL,
  funcionamento CHAR(1) NOT NULL,
  utilizacao VARCHAR(100) NOT NULL,
  num_fachadas INT NOT NULL,
  num_coberturas INT NOT NULL,
  pre_esforco CHAR(1) NOT NULL,
  km_inicio FLOAT NOT NULL,
  km_fim FLOAT NOT NULL,
  material_estrutural VARCHAR(30) NOT NULL,
  extensao_tabuleiro FLOAT NOT NULL,
  largura_tabuleiro FLOAT NOT NULL,
  vias_circulacao INT NOT NULL,
  material_pavi VARCHAR(30) NOT NULL,
  sistema_drenagem CHAR(1) NOT NULL,
  num_pilares INT NOT NULL,
  geometria INT NOT NULL,
  material_revestimento VARCHAR(30) NOT NULL,
  createdOn DATE NOT NULL,
  updatedOn DATE NOT NULL,
  id_morada INT NOT NULL,
  PRIMARY KEY (id),
  FOREIGN KEY (id_morada) REFERENCES morada(id) ON DELETE CASCADE
);

CREATE TABLE inspecao
(
  id INT NOT NULL AUTO_INCREMENT,
  historico INT NOT NULL,
  createdOn DATE NOT NULL,
  updatedOn DATE NOT NULL,
  id_utilizador INT NOT NULL,
  id_tipo INT NOT NULL,
  PRIMARY KEY (id),
  FOREIGN KEY (id_utilizador) REFERENCES utilizador(id) ON DELETE CASCADE,
  FOREIGN KEY (id_tipo) REFERENCES tipo(id) ON DELETE CASCADE
);

CREATE TABLE plano_voo
(
  id INT NOT NULL AUTO_INCREMENT,
  distancia_objecto FLOAT NOT NULL,
  osd FLOAT NOT NULL,
  area_mapeamento FLOAT NOT NULL,
  taxa_sobrepos FLOAT NOT NULL,
  intervalo_foto FLOAT NOT NULL,
  tipo_voo VARCHAR(255) NOT NULL,
  linha_voo VARCHAR(255) NOT NULL,
  createdOn DATE NOT NULL,
  updatedOn DATE NOT NULL,
  id_inspecao INT NOT NULL,
  id_drone INT NOT NULL,
  PRIMARY KEY (id),
  FOREIGN KEY (id_inspecao) REFERENCES inspecao(id) ON DELETE CASCADE,
  FOREIGN KEY (id_drone) REFERENCES drone(id) ON DELETE CASCADE
);


CREATE TABLE pos_voo
(
  id INT NOT NULL AUTO_INCREMENT,
  num_voos INT NOT NULL,
  hora_inicio TIME NOT NULL,
  hora_fim TIME NOT NULL,
  tempo_total VARCHAR(255) NOT NULL,
  num_fotos INT NOT NULL,
  num_videos INT NOT NULL,
  cond_meteo VARCHAR(255) NOT NULL,
  createdOn DATE NOT NULL,
  updatedOn DATE NOT NULL,
  id_plano INT NOT NULL,
  PRIMARY KEY (id),
  FOREIGN KEY (id_plano) REFERENCES plano_voo(id) ON DELETE CASCADE
);

CREATE TABLE process_info
(
  id INT NOT NULL AUTO_INCREMENT,
  num_anomalias INT NOT NULL,
  foto VARCHAR(255) NOT NULL,
  descricao VARCHAR(255) NOT NULL,
  causas VARCHAR(255) NOT NULL,
  reparacao VARCHAR(255) NOT NULL,
  createdOn DATE NOT NULL,
  updatedOn DATE NOT NULL,
  id_pos INT NOT NULL,
  PRIMARY KEY (id),
  FOREIGN KEY (id_pos) REFERENCES pos_voo(id) ON DELETE CASCADE
);

CREATE TABLE recurso
(
  id INT NOT NULL AUTO_INCREMENT,
  caminho VARCHAR(255) NOT NULL,
  createdOn DATE NOT NULL,
  updatedOn DATE NOT NULL,
  id_process INT NOT NULL,
  PRIMARY KEY (id),
  FOREIGN KEY (id_process) REFERENCES process_info(id) ON DELETE CASCADE
);

CREATE TABLE tipo_recurso
(
  id INT NOT NULL AUTO_INCREMENT,
  nome VARCHAR(255) NOT NULL,
  multimedia VARCHAR(255) NOT NULL,
  createdOn DATE NOT NULL,
  updatedOn DATE NOT NULL,
  id_recurso INT NOT NULL,
  PRIMARY KEY (id),
  FOREIGN KEY (id_recurso) REFERENCES recurso(id) ON DELETE CASCADE
);
