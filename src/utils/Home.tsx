import { addDoc, collection, getDocs } from "firebase/firestore";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { db } from "../firebase.config";

interface Props {
  search: string;
}

export interface Car {
  id: string;
  img: string;
  name: string;
  category: string;
  quantity: number;
  location: string;
  desc: string;
  price: number;
}

const LOCATIONS = [
  "Bukhara",
  "Samarkand",
  "Navoiy",
  "Tashkent",
  "Andijan",
  "Fergana",
  "Namangan",
  "Jizzakh",
  "Khorezm",
  "Karakalpakistan",
  "Kashkadarya",
  "Surkhandarya",
];

const CATEGORIES = [
  { value: "economy", label: "Economy", icon: "🚗" },
  { value: "standart", label: "Standart", icon: "🚙" },
  { value: "electro", label: "Elektromobil", icon: "⚡" },
  { value: "luxury", label: "Luxury", icon: "💎" },
];

const Home = ({}: Props) => {
  const [imagePreview, setImagePreview] = useState<string>("");
  const [open, setOpen] = useState(false);
  const [, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const [car, setCar] = useState<Car>({
    id: "",
    img: "",
    location: "",
    name: "",
    category: "",
    quantity: 0,
    desc: "",
    price: 0,
  });

  const getCars = async () => {
    const snapshot = await getDocs(collection(db, "cars"));
    const data = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Car[];
    setCars(data);
  };

  useEffect(() => {
    getCars();
  }, []);

  const addproduct = async () => {
    setLoading(true);
    await addDoc(collection(db, "cars"), {
      img: car.img,
      name: car.name,
      price: car.price,
      quantity: car.quantity,
      desc: car.desc,
      location: car.location,
      category: car.category,
    });
    setLoading(false);
    setCar({
      id: "",
      img: "",
      name: "",
      price: 0,
      quantity: 0,
      desc: "",
      location: "",
      category: "",
    });
    setImagePreview("");
    setOpen(false);
    navigate("/");
    getCars();
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=Epilogue:wght@300;400;500&display=swap');

        .home-wrap * { box-sizing: border-box; }

        .home-wrap {
          min-height: 100vh;
          background: linear-gradient(135deg, #060610 0%, #0c0c20 50%, #060610 100%);
          font-family: 'Epilogue', sans-serif;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 40px 20px;
        }

        .hero-card {
          width: 100%;
          max-width: 540px;
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 28px;
          padding: 48px 40px;
          position: relative;
          overflow: hidden;
        }

        .hero-card::before {
          content: '';
          position: absolute;
          top: -60px; right: -60px;
          width: 200px; height: 200px;
          background: radial-gradient(circle, rgba(99,102,241,0.15) 0%, transparent 70%);
          pointer-events: none;
        }

        .hero-card::after {
          content: '';
          position: absolute;
          bottom: -40px; left: -40px;
          width: 160px; height: 160px;
          background: radial-gradient(circle, rgba(59,130,246,0.1) 0%, transparent 70%);
          pointer-events: none;
        }

        .hero-label {
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 3px;
          text-transform: uppercase;
          color: rgba(99,102,241,0.8);
          margin-bottom: 12px;
        }

        .hero-title {
          font-family: 'Syne', sans-serif;
          font-size: clamp(28px, 5vw, 40px);
          font-weight: 800;
          color: #fff;
          margin: 0 0 8px;
          line-height: 1.1;
          letter-spacing: -1px;
        }

        .hero-sub {
          font-size: 14px;
          color: rgba(255,255,255,0.3);
          margin: 0 0 40px;
          line-height: 1.6;
        }

        .add-btn {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          background: linear-gradient(135deg, #3b82f6, #6366f1);
          color: #fff;
          border: none;
          border-radius: 16px;
          padding: 16px 32px;
          font-size: 15px;
          font-weight: 600;
          font-family: 'Epilogue', sans-serif;
          cursor: pointer;
          transition: all 0.25s;
          box-shadow: 0 8px 32px rgba(99,102,241,0.35);
          letter-spacing: 0.3px;
          width: 100%;
          justify-content: center;
        }

        .add-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 12px 40px rgba(99,102,241,0.5);
        }

        .add-btn-icon {
          width: 22px; height: 22px;
          background: rgba(255,255,255,0.2);
          border-radius: 6px;
          display: flex; align-items: center; justify-content: center;
          font-size: 14px;
          flex-shrink: 0;
        }

        .stats-row {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 12px;
          margin-top: 32px;
        }

        .stat-box {
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.06);
          border-radius: 16px;
          padding: 16px;
          text-align: center;
        }

        .stat-icon { font-size: 20px; margin-bottom: 6px; }
        .stat-label { font-size: 10px; color: rgba(255,255,255,0.3); letter-spacing: 1px; text-transform: uppercase; }
        .stat-val { font-size: 18px; font-weight: 700; color: #60a5fa; font-family: 'Syne', sans-serif; }

        /* OVERLAY */
        .modal-overlay {
          position: fixed; inset: 0;
          background: rgba(0,0,0,0.8);
          backdrop-filter: blur(12px);
          z-index: 1000;
          display: flex;
          align-items: flex-end;
          justify-content: center;
          padding: 0;
          animation: fadeIn 0.2s ease;
        }

        @media (min-width: 640px) {
          .modal-overlay {
            align-items: center;
            padding: 20px;
          }
        }

        @keyframes fadeIn { from { opacity: 0 } to { opacity: 1 } }
        @keyframes slideUp { from { transform: translateY(40px); opacity: 0 } to { transform: translateY(0); opacity: 1 } }

        /* MODAL */
        .modal-box {
          background: #0e0e1e;
          border: 1px solid rgba(255,255,255,0.09);
          border-radius: 28px 28px 0 0;
          width: 100%;
          max-height: 95vh;
          overflow-y: auto;
          padding: 28px 24px 40px;
          animation: slideUp 0.3s cubic-bezier(0.34,1.56,0.64,1);
          position: relative;
        }

        @media (min-width: 640px) {
          .modal-box {
            border-radius: 28px;
            max-width: 560px;
            padding: 36px 36px 36px;
            max-height: 90vh;
            box-shadow: 0 40px 100px rgba(0,0,0,0.9), 0 0 80px rgba(59,130,246,0.06);
          }
        }

        .drag-handle {
          width: 36px; height: 4px;
          background: rgba(255,255,255,0.1);
          border-radius: 2px;
          margin: 0 auto 24px;
        }

        @media (min-width: 640px) { .drag-handle { display: none; } }

        .modal-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 28px;
        }

        .modal-title {
          font-family: 'Syne', sans-serif;
          font-size: 22px;
          font-weight: 700;
          color: #fff;
          margin: 0;
          letter-spacing: -0.5px;
        }

        .modal-sub {
          font-size: 13px;
          color: rgba(255,255,255,0.3);
          margin: 4px 0 0;
        }

        .close-btn {
          width: 34px; height: 34px;
          border-radius: 10px;
          border: 1px solid rgba(255,255,255,0.1);
          background: rgba(255,255,255,0.05);
          color: rgba(255,255,255,0.4);
          cursor: pointer;
          font-size: 14px;
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0;
          transition: all 0.2s;
        }

        .close-btn:hover { background: rgba(255,255,255,0.1); color: #fff; }

        /* IMAGE UPLOAD */
        .upload-zone {
          border: 2px dashed rgba(255,255,255,0.1);
          border-radius: 18px;
          padding: 28px;
          text-align: center;
          cursor: pointer;
          transition: all 0.25s;
          margin-bottom: 20px;
          position: relative;
          overflow: hidden;
        }

        .upload-zone:hover {
          border-color: rgba(99,102,241,0.5);
          background: rgba(99,102,241,0.04);
        }

        .upload-zone input[type="file"] {
          position: absolute; inset: 0;
          opacity: 0; cursor: pointer; z-index: 2;
        }

        .upload-preview {
          width: 100%; height: 160px;
          object-fit: cover;
          border-radius: 12px;
          margin-bottom: 8px;
        }

        .upload-icon { font-size: 32px; margin-bottom: 8px; }
        .upload-text { font-size: 13px; color: rgba(255,255,255,0.4); }
        .upload-hint { font-size: 11px; color: rgba(255,255,255,0.2); margin-top: 4px; }

        /* FORM GRID */
        .form-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
          margin-bottom: 12px;
        }

        @media (max-width: 480px) { .form-grid { grid-template-columns: 1fr; } }

        .form-field {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .field-label {
          font-size: 11px;
          font-weight: 500;
          color: rgba(255,255,255,0.35);
          letter-spacing: 0.8px;
          text-transform: uppercase;
        }

        .field-input, .field-select, .field-textarea {
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.09);
          border-radius: 12px;
          padding: 11px 14px;
          color: #fff;
          font-size: 14px;
          font-family: 'Epilogue', sans-serif;
          outline: none;
          transition: all 0.2s;
          width: 100%;
        }

        .field-input:focus, .field-select:focus, .field-textarea:focus {
          border-color: rgba(99,102,241,0.5);
          background: rgba(99,102,241,0.06);
          box-shadow: 0 0 0 3px rgba(99,102,241,0.1);
        }

        .field-select option { background: #0e0e1e; color: #fff; }

        .field-textarea {
          height: 80px;
          resize: none;
          grid-column: 1 / -1;
        }

        /* CATEGORY PICKER */
        .cat-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 8px;
          margin-bottom: 12px;
        }

        @media (max-width: 400px) { .cat-grid { grid-template-columns: repeat(2, 1fr); } }

        .cat-btn {
          padding: 10px 6px;
          border-radius: 12px;
          border: 1px solid rgba(255,255,255,0.08);
          background: rgba(255,255,255,0.03);
          color: rgba(255,255,255,0.4);
          font-size: 12px;
          font-family: 'Epilogue', sans-serif;
          cursor: pointer;
          transition: all 0.2s;
          text-align: center;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 4px;
        }

        .cat-btn.active {
          background: rgba(99,102,241,0.15);
          border-color: rgba(99,102,241,0.4);
          color: #a5b4fc;
        }

        .cat-btn-icon { font-size: 18px; }
        .cat-btn-label { font-size: 10px; font-weight: 500; letter-spacing: 0.3px; }

        /* SECTION LABEL */
        .section-label {
          font-size: 11px;
          font-weight: 500;
          color: rgba(255,255,255,0.25);
          letter-spacing: 1px;
          text-transform: uppercase;
          margin: 16px 0 8px;
        }

        /* DIVIDER */
        .divider {
          height: 1px;
          background: rgba(255,255,255,0.06);
          margin: 20px 0;
        }

        /* FOOTER BUTTONS */
        .modal-footer {
          display: flex;
          gap: 10px;
          margin-top: 24px;
        }

        .btn-cancel {
          flex: 1;
          padding: 13px;
          border-radius: 14px;
          border: 1px solid rgba(255,255,255,0.09);
          background: rgba(255,255,255,0.04);
          color: rgba(255,255,255,0.5);
          font-size: 14px;
          font-weight: 500;
          font-family: 'Epilogue', sans-serif;
          cursor: pointer;
          transition: all 0.2s;
        }

        .btn-cancel:hover { background: rgba(255,255,255,0.08); color: #fff; }

        .btn-save {
          flex: 2;
          padding: 13px;
          border-radius: 14px;
          border: none;
          background: linear-gradient(135deg, #3b82f6, #6366f1);
          color: #fff;
          font-size: 14px;
          font-weight: 600;
          font-family: 'Epilogue', sans-serif;
          cursor: pointer;
          transition: all 0.2s;
          box-shadow: 0 4px 20px rgba(99,102,241,0.35);
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
        }

        .btn-save:hover:not(:disabled) { transform: translateY(-1px); box-shadow: 0 8px 28px rgba(99,102,241,0.45); }
        .btn-save:disabled { opacity: 0.6; cursor: not-allowed; }

        /* SPINNER */
        .spinner {
          width: 16px; height: 16px;
          border: 2px solid rgba(255,255,255,0.3);
          border-top-color: #fff;
          border-radius: 50%;
          animation: spin 0.7s linear infinite;
        }
        @keyframes spin { to { transform: rotate(360deg) } }
      `}</style>

      <div className="home-wrap">
        <div className="hero-card">
          <p className="hero-label">Admin Panel</p>
          <h1 className="hero-title">Mashina qo'shish</h1>
          <p className="hero-sub">
            Yangi mashinalarni ijaraga berish uchun quyidagi tugmani bosing
          </p>

          <button className="add-btn" onClick={() => setOpen(true)}>
            <span className="add-btn-icon">+</span>
            Yangi mashina qo'shish
          </button>

          <div className="stats-row">
            <div className="stat-box">
              <div className="stat-icon">🚗</div>
              <div className="stat-val">∞</div>
              <div className="stat-label">Mashinalar</div>
            </div>
            <div className="stat-box">
              <div className="stat-icon">📍</div>
              <div className="stat-val">12</div>
              <div className="stat-label">Shaharlar</div>
            </div>
            <div className="stat-box">
              <div className="stat-icon">⚡</div>
              <div className="stat-val">4</div>
              <div className="stat-label">Kategoriya</div>
            </div>
          </div>
        </div>
      </div>

      {/* ===== MODAL ===== */}
      {open && (
        <div className="modal-overlay" onClick={() => setOpen(false)}>
          <div className="modal-box" onClick={(e) => e.stopPropagation()}>
            <div className="drag-handle" />

            <div className="modal-header">
              <div>
                <h2 className="modal-title">Yangi mashina</h2>
                <p className="modal-sub">Barcha maydonlarni to'ldiring</p>
              </div>
              <button className="close-btn" onClick={() => setOpen(false)}>
                ✕
              </button>
            </div>

            {/* IMAGE UPLOAD */}
            <p className="section-label">📸 Rasm</p>
            <div className="upload-zone">
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    const reader = new FileReader();
                    reader.readAsDataURL(file);
                    reader.onload = () => {
                      const result = reader.result as string;
                      setCar((p) => ({ ...p, img: result }));
                      setImagePreview(result);
                    };
                  }
                }}
              />
              {imagePreview ? (
                <>
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="upload-preview"
                  />
                  <p className="upload-hint">
                    Rasmni o'zgartirish uchun bosing
                  </p>
                </>
              ) : (
                <>
                  <div className="upload-icon">🖼️</div>
                  <p className="upload-text">Rasm yuklash uchun bosing</p>
                  <p className="upload-hint">JPG, PNG, WEBP • max 5MB</p>
                </>
              )}
            </div>

            {/* CATEGORY */}
            <p className="section-label">🏷 Kategoriya</p>
            <div className="cat-grid">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.value}
                  className={`cat-btn${car.category === cat.value ? " active" : ""}`}
                  onClick={() => setCar((p) => ({ ...p, category: cat.value }))}
                >
                  <span className="cat-btn-icon">{cat.icon}</span>
                  <span className="cat-btn-label">{cat.label}</span>
                </button>
              ))}
            </div>

            <div className="divider" />

            {/* FORM FIELDS */}
            <p className="section-label">📋 Ma'lumotlar</p>
            <div className="form-grid">
              <div className="form-field" style={{ gridColumn: "1 / -1" }}>
                <label className="field-label">Nomi</label>
                <input
                  className="field-input"
                  placeholder="Masalan: Toyota Camry"
                  value={car.name}
                  onChange={(e) =>
                    setCar((p) => ({ ...p, name: e.target.value }))
                  }
                />
              </div>

              <div className="form-field">
                <label className="field-label">Narxi ($)</label>
                <input
                  className="field-input"
                  placeholder="0"
                  type="number"
                  value={car.price || ""}
                  onChange={(e) =>
                    setCar((p) => ({ ...p, price: Number(e.target.value) }))
                  }
                />
              </div>

              <div className="form-field">
                <label className="field-label">Joylashuv</label>
                <select
                  className="field-select"
                  value={car.location}
                  onChange={(e) =>
                    setCar((p) => ({ ...p, location: e.target.value }))
                  }
                >
                  <option value="" disabled>
                    Tanlang...
                  </option>
                  {LOCATIONS.map((loc) => (
                    <option key={loc} value={loc}>
                      {loc}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-field" style={{ gridColumn: "1 / -1" }}>
                <label className="field-label">Tavsif</label>
                <textarea
                  className="field-textarea"
                  placeholder="Mashina haqida qisqacha ma'lumot..."
                  value={car.desc}
                  onChange={(e) =>
                    setCar((p) => ({ ...p, desc: e.target.value }))
                  }
                />
              </div>
            </div>

            {/* FOOTER */}
            <div className="modal-footer">
              <button className="btn-cancel" onClick={() => setOpen(false)}>
                Bekor
              </button>
              <button
                className="btn-save"
                onClick={addproduct}
                disabled={loading || !car.name || !car.img || !car.price}
              >
                {loading ? (
                  <>
                    <div className="spinner" /> Saqlanmoqda...
                  </>
                ) : (
                  <>✓ Saqlash</>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Home;
