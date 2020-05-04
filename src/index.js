const express = require("express");

const { uuid, isUuid } = require("uuidv4");

const app = express();

app.use(express.json());

const projects = [];

function logRequests(req, res, next) {
  const { method, url } = req;

  const logLabel = `[${method.toUpperCase()}] ${url}`;

  console.log(logLabel);

  return next();
}

function validateProjectId(req, res, next) {
  const { id } = req.params;

  if (!isUuid(id)) {
    return res.status(400).json({ error: "Invalid project id " });
  }

  return next();
}

app.get("/projects", (req, res) => {
  const { title } = req.query;

  // find
  const results = title
    ? projects.filter((project) => project.title.includes(title))
    : projects;

  return res.json(results);
});

app.post("/projects", (req, res) => {
  const { title, owner } = req.body;

  const project = { id: uuid(), title, owner };

  // insert
  projects.push(project);

  return res.json(project);
});

app.put("/projects/:id", validateProjectId, (req, res) => {
  const { id } = req.params;
  const { title, owner } = req.body;

  // edit
  const projectIndex = projects.findIndex((project) => project.id === id);

  if (projectIndex < 0) {
    return res.status(400).json({ error: "project not found" });
  }

  const project = {
    id,
    title,
    owner,
  };

  projects[projectIndex] = project;

  return res.json(project);
});

app.delete("/projects/:id", validateProjectId, (req, res) => {
  const { id } = req.params;

  // delete
  const projectIndex = projects.findIndex((project) => project.id === id);

  if (projectIndex < 0) {
    return res.status(400).json({ error: "project not found" });
  }

  projects.splice(projectIndex, 1);

  return res.status(200).send();
});

app.listen(3333, () => {
  console.log("Servidor startando");
});
