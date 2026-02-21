/**
 * set-env.js — exécuté avant `ng build` sur Vercel
 *
 * Lit la variable d'environnement API_URL définie dans le dashboard Vercel
 * et l'injecte dans environment.prod.ts avant la compilation Angular.
 *
 * Variables Vercel à définir :
 *   API_URL  →  https://votre-backend.onrender.com/api
 */

const fs = require("fs");
const path = require("path");

const targetPath = path.join(
  __dirname,
  "src",
  "environments",
  "environment.prod.ts",
);

const apiUrl = process.env["API_URL"] || "http://localhost:5292/api";

const content = `// Fichier généré automatiquement par set-env.js — ne pas éditer manuellement
export const environment = {
  production: true,
  apiUrl: '${apiUrl}'
};
`;

fs.writeFileSync(targetPath, content, { encoding: "utf8" });
console.log(`✔ environment.prod.ts généré avec apiUrl = ${apiUrl}`);
