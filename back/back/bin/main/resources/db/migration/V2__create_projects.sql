CREATE TABLE projects (
  id UUID PRIMARY KEY,
  name VARCHAR(200) NOT NULL,
  description TEXT NOT NULL,
  status VARCHAR(30) NOT NULL CHECK (status IN ('PLANIFICATION', 'EN_COURS', 'TERMINE', 'SUSPENDU')),
  due_date DATE NOT NULL,
  created_at TIMESTAMPTZ NOT NULL,
  chef_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE
);

CREATE INDEX idx_projects_chef_id ON projects(chef_id);
