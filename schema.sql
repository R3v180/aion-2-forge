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
