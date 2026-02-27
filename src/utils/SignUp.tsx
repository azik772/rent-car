import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { useState } from "react";
import {  useNavigate } from "react-router-dom";
import { auth } from "../firebase.config";
import logo from "../../public/rent car.jpg";

interface User {
  name: string;
  phone: string;
  email: string;
  password: string;
}

const SignUp = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User>({
    name: "",
    phone: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [focused, setFocused] = useState<string | null>(null);

  const signUser = async () => {
    setError("");
    if (!user.name || !user.phone || !user.email || !user.password) {
      setError("Barcha maydonlarni to'ldiring");
      return;
    }
    if (user.password.length < 8) {
      setError("Parol kamida 8 ta belgidan iborat bo'lishi kerak");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(user.email)) {
      setError("Email formati noto'g'ri");
      return;
    }
    setLoading(true);
    try {
      const cred = await createUserWithEmailAndPassword(
        auth,
        user.email,
        user.password,
      );
      await updateProfile(cred.user, { displayName: user.name });
      localStorage.setItem(
        "user",
        JSON.stringify({
          name: user.name,
          email: user.email,
          phone: user.phone,
        }),
      );
      navigate("/");
    } catch (e: any) {
      const map: Record<string, string> = {
        "auth/email-already-in-use": "Bu email allaqachon ishlatilgan",
        "auth/weak-password": "Parol juda zaif",
        "auth/invalid-email": "Email noto'g'ri formatda",
      };
      setError(map[e.code] ?? "Xatolik yuz berdi");
    } finally {
      setLoading(false);
    }
  };

  const fields = [
    {
      key: "name",
      icon: "👤",
      label: "Ism",
      type: "text",
      ph: "To'liq ismingiz",
    },
    {
      key: "phone",
      icon: "📱",
      label: "Telefon",
      type: "tel",
      ph: "+998 90 000 00 00",
    },
    {
      key: "email",
      icon: "✉️",
      label: "Email",
      type: "email",
      ph: "email@gmail.com",
    },
    {
      key: "password",
      icon: "🔑",
      label: "Parol",
      type: "password",
      ph: "Kamida 8 ta belgi",
    },
  ] as const;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=Inter:wght@300;400;500;600&display=swap');
        .su-page{min-height:100vh;display:flex;align-items:center;justify-content:center;font-family:'Inter',sans-serif;background:#050508;padding:32px 20px;position:relative;overflow:hidden}
        .su-glow1{position:absolute;top:-150px;left:-150px;width:500px;height:500px;background:radial-gradient(circle,rgba(99,102,241,.15) 0%,transparent 70%);border-radius:50%;pointer-events:none}
        .su-glow2{position:absolute;bottom:-150px;right:-150px;width:500px;height:500px;background:radial-gradient(circle,rgba(59,130,246,.12) 0%,transparent 70%);border-radius:50%;pointer-events:none}
        .su-grid{position:absolute;inset:0;background-image:linear-gradient(rgba(255,255,255,.018) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.018) 1px,transparent 1px);background-size:64px 64px;pointer-events:none}
        .su-card{width:100%;max-width:420px;position:relative;z-index:1}
        .su-brand{display:flex;align-items:center;justify-content:center;margin-bottom:36px}
        .su-brand img{height:60px;object-fit:contain;filter:drop-shadow(0 0 24px rgba(99,102,241,.35))}
        .su-head{margin-bottom:28px;text-align:center}
        .su-eye{display:block;font-size:11px;letter-spacing:2px;text-transform:uppercase;color:#818cf8;margin-bottom:10px}
        .su-htitle{font-family:'Syne',sans-serif;font-size:30px;font-weight:800;color:#fff;letter-spacing:-1px;line-height:1.05;margin:0 0 8px}
        .su-hsub{font-size:14px;color:rgba(255,255,255,.32);margin:0}
        .su-err{background:rgba(239,68,68,.08);border:1px solid rgba(239,68,68,.2);border-radius:12px;padding:13px 16px;font-size:13px;color:#f87171;margin-bottom:20px;display:flex;align-items:center;gap:8px}
        .su-fields{display:flex;flex-direction:column;gap:14px;margin-bottom:20px}
        .su-flbl{display:block;font-size:11px;font-weight:500;letter-spacing:1px;text-transform:uppercase;color:rgba(255,255,255,.38);margin-bottom:7px}
        .su-fwrap{display:flex;align-items:center;background:rgba(255,255,255,.05);border:1px solid rgba(255,255,255,.08);border-radius:14px;transition:all .25s}
        .su-fwrap.on{background:rgba(99,102,241,.08);border-color:rgba(99,102,241,.5);box-shadow:0 0 0 4px rgba(99,102,241,.07)}
        .su-fico{width:46px;text-align:center;font-size:15px;flex-shrink:0;opacity:.55}
        .su-finput{flex:1;background:transparent;border:none;outline:none;padding:14px 14px 14px 0;color:#fff;font-size:14px;font-family:'Inter',sans-serif;min-width:0}
        .su-finput::placeholder{color:rgba(255,255,255,.18)}
        .su-hint{font-size:12px;color:rgba(255,255,255,.22);margin:0 0 22px;display:flex;align-items:center;gap:6px}
        .su-btn{width:100%;padding:16px;border-radius:14px;border:none;background:linear-gradient(135deg,#3b82f6,#6366f1);color:#fff;font-size:15px;font-weight:600;font-family:'Inter',sans-serif;cursor:pointer;transition:all .25s;display:flex;align-items:center;justify-content:center;gap:10px;box-shadow:0 8px 32px rgba(99,102,241,.35);letter-spacing:.3px;margin-bottom:24px}
        .su-btn:hover:not(:disabled){transform:translateY(-2px);box-shadow:0 14px 44px rgba(99,102,241,.48)}
        .su-btn:disabled{opacity:.6;cursor:not-allowed;transform:none}
        .su-spin{width:18px;height:18px;border:2px solid rgba(255,255,255,.25);border-top-color:#fff;border-radius:50%;animation:suspin .7s linear infinite}
        @keyframes suspin{to{transform:rotate(360deg)}}
        .su-foot{text-align:center;font-size:13px;color:rgba(255,255,255,.3)}
        .su-foot a{color:#818cf8;text-decoration:none;font-weight:600}
        .su-foot a:hover{color:#a5b4fc}
      `}</style>

      <div className="su-page">
        <div className="su-glow1" />
        <div className="su-glow2" />
        <div className="su-grid" />
        <div className="su-card">
          <div className="su-brand">
            <img src={logo} alt="logo" />
          </div>
          <div className="su-head">
            <span className="su-eye">Yangi hisob</span>
            <h1 className="su-htitle">Ro'yxatdan o'ting</h1>
            <p className="su-hsub">Bir necha soniyada boshlang</p>
          </div>
          {error && (
            <div className="su-err">
              <span>⚠️</span>
              {error}
            </div>
          )}
          <div className="su-fields">
            {fields.map(({ key, icon, label, type, ph }) => (
              <div key={key}>
                <label className="su-flbl">{label}</label>
                <div className={`su-fwrap${focused === key ? " on" : ""}`}>
                  <span className="su-fico">{icon}</span>
                  <input
                    className="su-finput"
                    type={type}
                    placeholder={ph}
                    value={user[key]}
                    onChange={(e) =>
                      setUser({ ...user, [key]: e.target.value })
                    }
                    onFocus={() => setFocused(key)}
                    onBlur={() => setFocused(null)}
                    onKeyDown={(e) => e.key === "Enter" && signUser()}
                  />
                </div>
              </div>
            ))}
          </div>
          <p className="su-hint">
            <span>🔒</span> Parol kamida 8 ta belgidan iborat bo'lsin
          </p>
          <button className="su-btn" onClick={signUser} disabled={loading}>
            {loading ? (
              <>
                <div className="su-spin" />
                Ro'yxatdan o'tilmoqda...
              </>
            ) : (
              <>Hisob yaratish →</>
            )}
          </button>
        
        </div>
      </div>
    </>
  );
};

export default SignUp;
