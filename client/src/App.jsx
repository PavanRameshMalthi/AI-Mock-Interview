import { useEffect, useState } from "react";
import AppRoutes from "./routes/AppRoutes";

function App() {
  const [theme, setTheme] = useState(
    () => localStorage.getItem("theme") || "system"
  );

  useEffect(() => {
    localStorage.setItem("theme", theme);
    document.documentElement.dataset.theme = theme;
  }, [theme]);

  return (
    <>
      <div className="theme-switcher" aria-label="Theme selector">
        {["light", "dark", "system"].map((item) => (
          <button
            aria-pressed={theme === item}
            className={theme === item ? "active" : ""}
            key={item}
            onClick={() => setTheme(item)}
            type="button"
          >
            {item}
          </button>
        ))}
      </div>
      <AppRoutes />
    </>
  );
}

export default App;
