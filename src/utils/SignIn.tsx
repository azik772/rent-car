import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import type { User } from "../App";
import logo from "../../public/rent car.jpg";

const SignIn = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User>({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [focused, setFocused] = useState<string | null>(null);

  const ADMIN_EMAIL = "azizbeknarzullayevo1o@gmail.com";
  const ADMIN_PASSWORD = "azizbek1";

  const checkUser = async () => {
    setError("");
    if (!user.email || !user.password) {
      setError("Email va parolni kiriting");
      return;
    }
    setLoading(true);
    await new Promise((r) => setTimeout(r, 700));
    if (user.email === ADMIN_EMAIL && user.password === ADMIN_PASSWORD) {
      localStorage.setItem("user", JSON.stringify(user));
      navigate("/home");
    } else {
      setError("Email yoki parol noto'g'ri");
      setLoading(false);
    }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=Inter:wght@300;400;500;600&display=swap');
        .si-page{min-height:100vh;display:flex;align-items:center;justify-content:center;font-family:'Inter',sans-serif;background:#050508;padding:32px 20px;position:relative;overflow:hidden}
        .si-glow1{position:absolute;top:-150px;left:-150px;width:500px;height:500px;background:radial-gradient(circle,rgba(99,102,241,.15) 0%,transparent 70%);border-radius:50%;pointer-events:none}
        .si-glow2{position:absolute;bottom:-150px;right:-150px;width:500px;height:500px;background:radial-gradient(circle,rgba(59,130,246,.12) 0%,transparent 70%);border-radius:50%;pointer-events:none}
        .si-grid{position:absolute;inset:0;background-image:linear-gradient(rgba(255,255,255,.018) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.018) 1px,transparent 1px);background-size:64px 64px;pointer-events:none}
        .si-card{width:100%;max-width:420px;position:relative;z-index:1}
        .si-brand{display:flex;align-items:center;justify-content:center;margin-bottom:36px}
        .si-brand img{height:60px;object-fit:contain;filter:drop-shadow(0 0 24px rgba(99,102,241,.35))}
        .si-head{margin-bottom:28px;text-align:center}
        .si-eye{display:block;font-size:11px;letter-spacing:2px;text-transform:uppercase;color:#818cf8;margin-bottom:10px}
        .si-htitle{font-family:'Syne',sans-serif;font-size:30px;font-weight:800;color:#fff;letter-spacing:-1px;line-height:1.05;margin:0 0 8px}
        .si-hsub{font-size:14px;color:rgba(255,255,255,.32);margin:0}
        .si-err{background:rgba(239,68,68,.08);border:1px solid rgba(239,68,68,.2);border-radius:12px;padding:13px 16px;font-size:13px;color:#f87171;margin-bottom:20px;display:flex;align-items:center;gap:8px}
        .si-fields{display:flex;flex-direction:column;gap:14px;margin-bottom:28px}
        .si-flbl{display:block;font-size:11px;font-weight:500;letter-spacing:1px;text-transform:uppercase;color:rgba(255,255,255,.38);margin-bottom:7px}
        .si-fwrap{display:flex;align-items:center;background:rgba(255,255,255,.05);border:1px solid rgba(255,255,255,.08);border-radius:14px;transition:all .25s}
        .si-fwrap.on{background:rgba(99,102,241,.08);border-color:rgba(99,102,241,.5);box-shadow:0 0 0 4px rgba(99,102,241,.07)}
        .si-fico{width:46px;text-align:center;font-size:15px;flex-shrink:0;opacity:.55}
        .si-finput{flex:1;background:transparent;border:none;outline:none;padding:14px 14px 14px 0;color:#fff;font-size:14px;font-family:'Inter',sans-serif;min-width:0}
        .si-finput::placeholder{color:rgba(255,255,255,.18)}
        .si-btn{width:100%;padding:16px;border-radius:14px;border:none;background:linear-gradient(135deg,#3b82f6,#6366f1);color:#fff;font-size:15px;font-weight:600;font-family:'Inter',sans-serif;cursor:pointer;transition:all .25s;display:flex;align-items:center;justify-content:center;gap:10px;box-shadow:0 8px 32px rgba(99,102,241,.35);letter-spacing:.3px;margin-bottom:24px}
        .si-btn:hover:not(:disabled){transform:translateY(-2px);box-shadow:0 14px 44px rgba(99,102,241,.48)}
        .si-btn:disabled{opacity:.6;cursor:not-allowed;transform:none}
        .si-spin{width:18px;height:18px;border:2px solid rgba(255,255,255,.25);border-top-color:#fff;border-radius:50%;animation:sispin .7s linear infinite}
        @keyframes sispin{to{transform:rotate(360deg)}}
        .si-divider{display:flex;align-items:center;gap:12px;margin-bottom:24px}
        .si-dline{flex:1;height:1px;background:rgba(255,255,255,.07)}
        .si-dtxt{font-size:12px;color:rgba(255,255,255,.25)}
        .si-foot{text-align:center;font-size:13px;color:rgba(255,255,255,.3)}
        .si-foot a{color:#818cf8;text-decoration:none;font-weight:600}
        .si-foot a:hover{color:#a5b4fc}
      `}</style>

      <div className="si-page">
        <div className="si-glow1" />
        <div className="si-glow2" />
        <div className="si-grid" />
        <div className="si-card">
          {/* Logo */}
          <div className="si-brand">
            <img src={logo} alt="logo" />
          </div>

          <div className="si-head">
            <span className="si-eye">Admin kirishi</span>
            <h1 className="si-htitle">Xush kelibsiz</h1>
            <p className="si-hsub">Davom etish uchun kiring</p>
          </div>

          {error && (
            <div className="si-err">
              <span>⚠️</span>
              {error}
            </div>
          )}

          <div className="si-fields">
            {[
              {
                key: "email",
                icon: "✉️",
                label: "Email",
                type: "email",
                ph: "admin@email.com",
              },
              {
                key: "password",
                icon: "🔑",
                label: "Parol",
                type: "password",
                ph: "••••••••",
              },
            ].map(({ key, icon, label, type, ph }) => (
              <div key={key}>
                <label className="si-flbl">{label}</label>
                <div className={`si-fwrap${focused === key ? " on" : ""}`}>
                  <span className="si-fico">{icon}</span>
                  <input
                    className="si-finput"
                    type={type}
                    placeholder={ph}
                    value={(user as any)[key]}
                    onChange={(e) =>
                      setUser({ ...user, [key]: e.target.value })
                    }
                    onFocus={() => setFocused(key)}
                    onBlur={() => setFocused(null)}
                    onKeyDown={(e) => e.key === "Enter" && checkUser()}
                  />
                </div>
              </div>
            ))}
          </div>

          <button className="si-btn" onClick={checkUser} disabled={loading}>
            {loading ? (
              <>
                <div className="si-spin" />
                Kirmoqda...
              </>
            ) : (
              <>Kirish →</>
            )}
          </button>

          <div className="si-divider">
            <span className="si-dline" />
            <span className="si-dtxt">yoki</span>
            <span className="si-dline" />
          </div>

          <p className="si-foot">
            Foydalanuvchimisiz? <Link to="/signup">Ro'yxatdan o'tish</Link>
          </p>
        </div>
      </div>
    </>
  );
};

export default SignIn;
