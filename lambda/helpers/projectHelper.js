function normalizeName(name) {
  return name.toLowerCase().trim();
}

function getActiveProject(attrs) {
  if (!attrs.activeProjectName || !attrs.projects) return null;
  return attrs.projects[attrs.activeProjectName] || null;
}

function findClosestProject(attrs, name) {
  const normalized = normalizeName(name);
  const projectNames = Object.keys(attrs.projects || {});

  // Exact match
  if (projectNames.includes(normalized)) return normalized;

  // Partial match (input is substring of project name, or vice versa)
  const partial = projectNames.find(
    (p) => p.includes(normalized) || normalized.includes(p)
  );
  if (partial) return partial;

  return null;
}

function createProject(attrs, name) {
  const normalized = normalizeName(name);
  const now = new Date().toISOString();

  attrs.projects[normalized] = {
    currentRow: 0,
    createdAt: now,
    lastModified: now,
    reminders: {},
  };
  attrs.activeProjectName = normalized;

  return normalized;
}

module.exports = { normalizeName, getActiveProject, findClosestProject, createProject };
