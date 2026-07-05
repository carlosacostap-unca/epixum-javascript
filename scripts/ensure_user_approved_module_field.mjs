import fs from "node:fs";
import path from "node:path";

function loadEnvFile(filePath) {
  if (!fs.existsSync(filePath)) return;

  const content = fs.readFileSync(filePath, "utf8");

  for (const line of content.split(/\r?\n/)) {
    const match = line.match(/^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)\s*$/);
    if (!match) continue;

    const [, key, rawValue] = match;
    if (process.env[key]) continue;

    process.env[key] = rawValue.replace(/^["']|["']$/g, "");
  }
}

function envFirst(keys) {
  for (const key of keys) {
    if (process.env[key]) return process.env[key];
  }

  return "";
}

async function request(url, options = {}) {
  const response = await fetch(url, options);
  const text = await response.text();
  const body = text ? JSON.parse(text) : null;

  if (!response.ok) {
    throw new Error(
      `${response.status} ${response.statusText}: ${text || "sin detalle"}`
    );
  }

  return body;
}

async function authenticate(baseUrl, identity, password) {
  const payload = JSON.stringify({ identity, password });
  const headers = { "Content-Type": "application/json" };
  const authPaths = [
    "/api/collections/_superusers/auth-with-password",
    "/api/collections/_admins/auth-with-password",
  ];

  let lastError;

  for (const authPath of authPaths) {
    try {
      const result = await request(`${baseUrl}${authPath}`, {
        method: "POST",
        headers,
        body: payload,
      });

      if (result?.token) return result.token;
    } catch (error) {
      lastError = error;
    }
  }

  throw lastError || new Error("No se pudo autenticar contra PocketBase");
}

const expectedBooleanFields = ["approvedModule", "recommendation"];

function makeBooleanField(name, index) {
  return {
    id: `bool${Date.now().toString().slice(-10)}${index}`,
    name,
    type: "bool",
    system: false,
    required: false,
    hidden: false,
    presentable: false,
  };
}

async function main() {
  loadEnvFile(path.resolve(process.cwd(), ".env.local"));

  const baseUrl = (process.env.NEXT_PUBLIC_POCKETBASE_URL || "").replace(
    /\/$/,
    ""
  );
  const identity = envFirst([
    "POCKETBASE_SUPERUSER_EMAIL",
    "POCKETBASE_ADMIN_EMAIL",
    "PB_SUPERUSER_EMAIL",
    "PB_ADMIN_EMAIL",
  ]);
  const password = envFirst([
    "POCKETBASE_SUPERUSER_PASSWORD",
    "POCKETBASE_ADMIN_PASSWORD",
    "PB_SUPERUSER_PASSWORD",
    "PB_ADMIN_PASSWORD",
  ]);

  if (!baseUrl) {
    throw new Error("Falta NEXT_PUBLIC_POCKETBASE_URL en el entorno.");
  }

  if (!identity || !password) {
    throw new Error(
      "Faltan credenciales. Defini POCKETBASE_SUPERUSER_EMAIL y POCKETBASE_SUPERUSER_PASSWORD, o sus variantes ADMIN/PB."
    );
  }

  const token = await authenticate(baseUrl, identity, password);
  const headers = {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };
  const usersCollection = await request(`${baseUrl}/api/collections/users`, {
    headers,
  });
  const fieldsKey = Array.isArray(usersCollection.fields)
    ? "fields"
    : "schema";
  const fields = [...(usersCollection[fieldsKey] || [])];

  const missingFields = expectedBooleanFields.filter(
    (fieldName) => !fields.some((field) => field.name === fieldName)
  );

  if (missingFields.length === 0) {
    console.log("users.approvedModule y users.recommendation ya existen.");
    return;
  }

  for (const [index, fieldName] of missingFields.entries()) {
    fields.push(makeBooleanField(fieldName, index));
  }

  await request(`${baseUrl}/api/collections/${usersCollection.id}`, {
    method: "PATCH",
    headers,
    body: JSON.stringify({ [fieldsKey]: fields }),
  });

  console.log(`Campos creados correctamente: ${missingFields.join(", ")}.`);
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
