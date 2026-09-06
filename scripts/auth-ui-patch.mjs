import fs from "node:fs";

const appPath = new URL("../src/App.tsx", import.meta.url);
let code = fs.readFileSync(appPath, "utf8");

if (!code.includes('import "./auth.css";')) {
  code = code.replace('import "./catalog.css";', 'import "./catalog.css";\nimport "./auth.css";');
}

code = code.replace(
  '  const [page, setPage] = useState("dashboard");',
  `  const [page, setPage] = useState("login");\n  const [loginEmail, setLoginEmail] = useState("");\n  const [loginPassword, setLoginPassword] = useState("");\n  const [generalLoginError, setGeneralLoginError] = useState("");\n  const [adminLoggedIn, setAdminLoggedIn] = useState(false);`
);

code = code.replace(
  '  const handleClientLogin = (e: React.FormEvent) => {',
  `  const handleGeneralLogin = (e: React.FormEvent) => {\n    e.preventDefault();\n    const email = loginEmail.trim().toLowerCase();\n    if (email === "admin@osrah.ma" && loginPassword === "osrah2026") {\n      setAdminLoggedIn(true); setClientLoggedIn(false); setGeneralLoginError(""); setPage("dashboard"); return;\n    }\n    if (email === "client@osrah.ma" && loginPassword === "client2026") {\n      setAdminLoggedIn(false); setClientEmail(email); setClientPassword(loginPassword); setClientLoggedIn(true); setGeneralLoginError(""); setPage("client-shop"); return;\n    }\n    setGeneralLoginError("Email ou mot de passe incorrect.");\n  };\n\n  const logoutAdmin = () => { setAdminLoggedIn(false); setLoginEmail(""); setLoginPassword(""); setPage("login"); };\n\n  const handleClientLogin = (e: React.FormEvent) => {`
);

code = code.replace(
  '    setPage("dashboard");\n  };\n\n  /* =========================\n     ADD PRODUCT',
  '    setLoginEmail("");\n    setLoginPassword("");\n    setPage("login");\n  };\n\n  /* =========================\n     ADD PRODUCT'
);

const marker = `  /* =========================\n     CLIENT LOGIN PAGE\n  ========================= */`;
if (!code.includes('className="general-login-page"')) {
  const block = `  if (page === "login") {\n    return (\n      <div className="general-login-page">\n        <div className="general-login-card">\n          <div className="general-login-brand"><strong>OSRAH</strong><span>Cosmétiques</span></div>\n          <p className="general-login-kicker">BIENVENUE CHEZ OSRAH</p>\n          <h1>Connexion</h1>\n          <p className="general-login-subtitle">Connectez-vous avec votre compte administrateur ou client.</p>\n          <form onSubmit={handleGeneralLogin}>\n            <label>Email</label><input type="email" value={loginEmail} onChange={(e) => setLoginEmail(e.target.value)} placeholder="Votre adresse email" />\n            <label>Mot de passe</label><input type="password" value={loginPassword} onChange={(e) => setLoginPassword(e.target.value)} placeholder="Votre mot de passe" />\n            {generalLoginError && <p className="general-login-error">{generalLoginError}</p>}\n            <button type="submit" className="general-login-submit">SE CONNECTER</button>\n          </form>\n        </div>\n      </div>\n    );\n  }\n\n`;
  code = code.replace(marker, block + marker);
}

code = code.replace(/setPage\("client-login"\)/g, 'setPage("login")');

if (!code.includes('className="admin-logout-btn"')) {
  code = code.replace('<div className="client-access">', '<div className="client-access">\n          <button className="admin-logout-btn" onClick={logoutAdmin}>Déconnexion admin</button>');
}

fs.writeFileSync(appPath, code, "utf8");
console.log("Shared admin/client login applied");
