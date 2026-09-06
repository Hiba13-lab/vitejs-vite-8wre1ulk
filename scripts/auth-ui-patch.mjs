import fs from "node:fs";

const appPath = new URL("../src/App.tsx", import.meta.url);
let code = fs.readFileSync(appPath, "utf8");

if (!code.includes('import "./auth.css";')) {
  code = code.replace('import "./catalog.css";', 'import "./catalog.css";\nimport "./auth.css";');
}

if (!code.includes('const [adminEmail, setAdminEmail]')) {
  code = code.replace(
    '  const [page, setPage] = useState("dashboard");',
    `  const [page, setPage] = useState("admin-login");\n  const [adminEmail, setAdminEmail] = useState("");\n  const [adminPassword, setAdminPassword] = useState("");\n  const [adminLoggedIn, setAdminLoggedIn] = useState(false);\n  const [adminLoginError, setAdminLoginError] = useState("");`
  );
}

if (!code.includes('const handleAdminLogin')) {
  code = code.replace(
    '  const handleClientLogin = (e: React.FormEvent) => {',
    `  const handleAdminLogin = (e: React.FormEvent) => {\n    e.preventDefault();\n\n    if (!adminEmail || !adminPassword) {\n      setAdminLoginError("Veuillez remplir tous les champs.");\n      return;\n    }\n\n    if (adminEmail !== "admin@osrah.ma" || adminPassword !== "osrah2026") {\n      setAdminLoginError("Email ou mot de passe incorrect.");\n      return;\n    }\n\n    setAdminLoginError("");\n    setAdminLoggedIn(true);\n    setPage("dashboard");\n  };\n\n  const logoutAdmin = () => {\n    setAdminLoggedIn(false);\n    setAdminEmail("");\n    setAdminPassword("");\n    setPage("admin-login");\n  };\n\n  const handleClientLogin = (e: React.FormEvent) => {`
  );
}

if (!code.includes('className="admin-login-page"')) {
  const marker = '  /* =========================\n     CLIENT LOGIN PAGE\n  ========================= */';
  const block = `  /* =========================\n     ADMIN LOGIN PAGE\n  ========================= */\n\n  if (!adminLoggedIn && page !== "client-login" && page !== "client-shop") {\n    return (\n      <div className="admin-login-page">\n        <div className="admin-login-card">\n          <div className="admin-login-brand">\n            <strong>OSRAH</strong>\n            <span>Cosmétiques</span>\n          </div>\n\n          <p className="admin-login-kicker">ESPACE ADMINISTRATION</p>\n          <h1>Bienvenue</h1>\n          <p className="admin-login-subtitle">Connectez-vous pour gérer les produits, commandes et clients.</p>\n\n          <form onSubmit={handleAdminLogin}>\n            <label>Email administrateur</label>\n            <input\n              type="email"\n              placeholder="admin@osrah.ma"\n              value={adminEmail}\n              onChange={(e) => setAdminEmail(e.target.value)}\n            />\n\n            <label>Mot de passe</label>\n            <input\n              type="password"\n              placeholder="Votre mot de passe"\n              value={adminPassword}\n              onChange={(e) => setAdminPassword(e.target.value)}\n            />\n\n            {adminLoginError && <p className="admin-login-error">{adminLoginError}</p>}\n\n            <button type="submit" className="admin-login-submit">SE CONNECTER</button>\n          </form>\n\n          <button className="go-client-login" onClick={() => setPage("client-login")}>\n            Accéder à l'espace client →\n          </button>\n\n          <small className="demo-admin-hint">Compte démo : admin@osrah.ma · osrah2026</small>\n        </div>\n      </div>\n    );\n  }\n\n`;
  code = code.replace(marker, block + marker);
}

// Client logout returns to client login instead of exposing admin area.
code = code.replace('    setPage("dashboard");\n  };\n\n  /* =========================\n     ADD PRODUCT', '    setPage("client-login");\n  };\n\n  /* =========================\n     ADD PRODUCT');

// Back button from client login goes to the right place depending on admin session.
code = code.replace(
  'onClick={() => setPage("dashboard")}',
  'onClick={() => setPage(adminLoggedIn ? "dashboard" : "admin-login")}'
);

// Add admin logout control to sidebar client-access area.
if (!code.includes('className="admin-logout-btn"')) {
  code = code.replace(
    '<div className="client-access">',
    `<div className="client-access">\n          <button className="admin-logout-btn" onClick={logoutAdmin}>Déconnexion admin</button>`
  );
}

fs.writeFileSync(appPath, code, "utf8");
console.log("Admin login and client login layout applied");
