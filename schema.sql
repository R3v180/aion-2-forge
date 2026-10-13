CREATE TABLE IF NOT EXISTS usuarios (
  id          SERIAL PRIMARY KEY,
  usuario     TEXT NOT NULL,
  clave_hash  TEXT NOT NULL,
  rol         TEXT NOT NULL DEFAULT 'usuario',
  creado      TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE UNIQUE INDEX IF NOT EXISTS usuarios_usuario_idx ON usuarios (lower(usuario));

CREATE TABLE IF NOT EXISTS builds (
  id          SERIAL PRIMARY KEY,
  usuario_id  INTEGER NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
  clase       TEXT NOT NULL,
  nombre      TEXT NOT NULL,
  modo        TEXT NOT NULL DEFAULT 'pve',
  descripcion TEXT NOT NULL DEFAULT '',
  publica     BOOLEAN NOT NULL DEFAULT FALSE,
  fuente      TEXT,
  datos       JSONB NOT NULL DEFAULT '{}'::jsonb,
  creado      TIMESTAMPTZ NOT NULL DEFAULT now(),
  actualizado TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS builds_usuario_idx ON builds (usuario_id);
CREATE INDEX IF NOT EXISTS builds_publicas_idx ON builds (clase, actualizado DESC) WHERE publica;

ALTER TABLE usuarios ADD COLUMN IF NOT EXISTS expulsado_hasta TIMESTAMPTZ;
-- La cuenta admin del gremio es la única que asigna roles
UPDATE usuarios SET rol = 'superadmin' WHERE lower(usuario) = 'admin' AND rol = 'admin';

CREATE TABLE IF NOT EXISTS categorias_foro (
  id    TEXT PRIMARY KEY,
  orden INTEGER NOT NULL
);
INSERT INTO categorias_foro (id, orden) VALUES
  ('avisos', 1), ('clases', 2), ('grupos', 3), ('reclutamiento', 4), ('offtopic', 5)
ON CONFLICT (id) DO NOTHING;

CREATE TABLE IF NOT EXISTS temas (
  id          SERIAL PRIMARY KEY,
  categoria   TEXT NOT NULL REFERENCES categorias_foro(id),
  usuario_id  INTEGER NOT NULL REFERENCES usuarios(id),
  titulo      TEXT NOT NULL,
  cerrado     BOOLEAN NOT NULL DEFAULT FALSE,
  fijado      BOOLEAN NOT NULL DEFAULT FALSE,
  oculto      BOOLEAN NOT NULL DEFAULT FALSE,
  motivo      TEXT,
  creado      TIMESTAMPTZ NOT NULL DEFAULT now(),
  actualizado TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS temas_categoria_idx ON temas (categoria, fijado DESC, actualizado DESC) WHERE NOT oculto;

CREATE TABLE IF NOT EXISTS mensajes (
  id          SERIAL PRIMARY KEY,
  tema_id     INTEGER NOT NULL REFERENCES temas(id) ON DELETE CASCADE,
  usuario_id  INTEGER NOT NULL REFERENCES usuarios(id),
  texto       TEXT NOT NULL,
  oculto      BOOLEAN NOT NULL DEFAULT FALSE,
  motivo      TEXT,
  creado      TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS mensajes_tema_idx ON mensajes (tema_id, id) WHERE NOT oculto;

CREATE TABLE IF NOT EXISTS chat (
  id          SERIAL PRIMARY KEY,
  usuario_id  INTEGER NOT NULL REFERENCES usuarios(id),
  texto       TEXT NOT NULL,
  oculto      BOOLEAN NOT NULL DEFAULT FALSE,
  motivo      TEXT,
  creado      TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS chat_reciente_idx ON chat (id DESC);

CREATE TABLE IF NOT EXISTS denuncias (
  id          SERIAL PRIMARY KEY,
  usuario_id  INTEGER NOT NULL REFERENCES usuarios(id),
  tipo        TEXT NOT NULL,
  objetivo_id INTEGER NOT NULL,
  motivo      TEXT NOT NULL,
  resuelta    BOOLEAN NOT NULL DEFAULT FALSE,
  creado      TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE UNIQUE INDEX IF NOT EXISTS denuncias_abierta_idx ON denuncias (usuario_id, tipo, objetivo_id) WHERE NOT resuelta;

-- Personaje real del juego, leído de la ficha pública. Varias builds pueden apuntar al mismo.
CREATE TABLE IF NOT EXISTS personajes (
  id             SERIAL PRIMARY KEY,
  usuario_id     INTEGER NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
  character_id   TEXT NOT NULL,
  server_id      INTEGER NOT NULL,
  nombre         TEXT NOT NULL,
  servidor       TEXT NOT NULL DEFAULT '',
  clase          TEXT NOT NULL,
  nivel          INTEGER,
  poder          INTEGER,
  publica_equipo BOOLEAN NOT NULL DEFAULT FALSE,
  leido          TIMESTAMPTZ,
  ficha          JSONB NOT NULL DEFAULT '{}'::jsonb
);
CREATE UNIQUE INDEX IF NOT EXISTS personajes_cuenta_idx ON personajes (usuario_id, character_id, server_id);
ALTER TABLE builds ADD COLUMN IF NOT EXISTS personaje_id INTEGER REFERENCES personajes(id) ON DELETE SET NULL;
CREATE INDEX IF NOT EXISTS builds_personaje_idx ON builds (personaje_id);

-- Noticias oficiales copiadas de la comunidad de NC (anuncios, parches y vídeos)
CREATE TABLE IF NOT EXISTS noticias (
  id          TEXT PRIMARY KEY,
  tablon      TEXT NOT NULL,
  idioma      TEXT NOT NULL,
  titulo      TEXT NOT NULL,
  resumen     TEXT NOT NULL DEFAULT '',
  imagen      TEXT NOT NULL DEFAULT '',
  contenido   TEXT NOT NULL DEFAULT '',
  texto_en    BOOLEAN NOT NULL DEFAULT FALSE,
  url         TEXT NOT NULL DEFAULT '',
  publicado   TIMESTAMPTZ NOT NULL,
  actualizado TIMESTAMPTZ NOT NULL,
  leido       TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS noticias_idx ON noticias (idioma, publicado DESC);
CREATE TABLE IF NOT EXISTS ajustes (
  clave    TEXT PRIMARY KEY,
  valor    TEXT NOT NULL,
  cambiado TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Foro y chat: ediciones, reacciones, salas y avisos de "busco grupo"
ALTER TABLE mensajes ADD COLUMN IF NOT EXISTS editado TIMESTAMPTZ;
ALTER TABLE temas ADD COLUMN IF NOT EXISTS vistas INTEGER NOT NULL DEFAULT 0;
ALTER TABLE chat ADD COLUMN IF NOT EXISTS sala TEXT NOT NULL DEFAULT 'general';
ALTER TABLE chat ADD COLUMN IF NOT EXISTS responde_a INTEGER;
ALTER TABLE chat ADD COLUMN IF NOT EXISTS grupo JSONB;
CREATE INDEX IF NOT EXISTS chat_sala_idx ON chat (sala, id DESC);
CREATE TABLE IF NOT EXISTS reacciones (
  tipo        TEXT NOT NULL,
  objetivo_id INTEGER NOT NULL,
  usuario_id  INTEGER NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
  emoji       TEXT NOT NULL,
  PRIMARY KEY (tipo, objetivo_id, usuario_id, emoji)
);
CREATE TABLE IF NOT EXISTS apuntados (
  chat_id    INTEGER NOT NULL REFERENCES chat(id) ON DELETE CASCADE,
  usuario_id INTEGER NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
  PRIMARY KEY (chat_id, usuario_id)
);
INSERT INTO categorias_foro (id, orden) VALUES ('presentaciones', 2), ('builds', 4) ON CONFLICT (id) DO NOTHING;
UPDATE categorias_foro SET orden = CASE id WHEN 'avisos' THEN 1 WHEN 'presentaciones' THEN 2 WHEN 'clases' THEN 3
  WHEN 'builds' THEN 4 WHEN 'grupos' THEN 5 WHEN 'reclutamiento' THEN 6 WHEN 'offtopic' THEN 7 ELSE orden END;
