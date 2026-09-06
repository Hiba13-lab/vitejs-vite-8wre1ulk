import fs from "node:fs";

const appPath = new URL("../src/App.tsx", import.meta.url);
let code = fs.readFileSync(appPath, "utf8");

// If the client is already logged in, Espace Client should open the shop instead of a blank admin page.
code = code.replaceAll(
  'onClick={() =>\n              setPage("client-login")\n            }',
  'onClick={() =>\n              setPage(clientLoggedIn ? "client-shop" : "client-login")\n            }'
);

code = code.replaceAll(
  'onClick={() => setPage("client-login")}',
  'onClick={() => setPage(clientLoggedIn ? "client-shop" : "client-login")}'
);

// Safety redirect: if client-login is selected while the client is already connected, render the shop.
code = code.replace(
  'if (page === "client-shop" && clientLoggedIn) {',
  'if ((page === "client-shop" || (page === "client-login" && clientLoggedIn)) && clientLoggedIn) {'
);

fs.writeFileSync(appPath, code, "utf8");
console.log("Espace client navigation fixed");
