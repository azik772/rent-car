import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { db, auth } from "../firebase.config";
import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { useNavigate, useLocation } from "react-router-dom";
import type { Car } from "../utils/Home";

interface Booking {
  id: string;
  carId: string;
  userId: string;
  name: string;
  price: number;
  img: string;
  category: string;
  desc: string;
  days: number;
  totalPrice: number;
  bookedAt: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
}

interface BookingForm {
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  days: number;
}

interface Props {
  search?: string;
}

const Book = ({}: Props) => {
  const location = useLocation();
  const navigate = useNavigate();

  const selectedCar =
    (location.state as { car?: Car & { id: string } })?.car ?? null;

  const [bookings, setBookings] = useState<Booking[]>([]);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  // ✅ Tab boshlang'ich qiymati: car kelgan bo'lsa "car", aks holda "bookings"
  const [tab, setTab] = useState<"car" | "bookings">(
    selectedCar ? "car" : "bookings",
  );

  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState<BookingForm>({
    customerName: "",
    customerEmail: "",
    customerPhone: "",
    days: 1,
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [formErrors, setFormErrors] = useState<Partial<Record<string, string>>>(
    {},
  );

  useEffect(() => {
    const localUser = localStorage.getItem("user");
    if (localUser) {
      const userData = JSON.parse(localUser);
      if (userData.email === "azizbeknarzullayevo1o@gmail.com") {
        setCurrentUserId("admin");
        getBookings("admin");
        return;
      }
    }
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setCurrentUserId(user.uid);
        getBookings(user.uid);
      } else {
        setCurrentUserId(null);
        setBookings([]);
      }
    });
    return () => unsubscribe();
  }, []);

  async function getBookings(userId: string) {
    const q = query(collection(db, "bookings"), where("userId", "==", userId));
    const snapshot = await getDocs(q);
    const items = snapshot.docs.map((d) => ({
      id: d.id,
      ...d.data(),
    })) as Booking[];
    setBookings(items);
  }

  function validateForm(): boolean {
    const errors: Partial<Record<string, string>> = {};
    if (!form.customerName.trim()) errors.customerName = "Ism kiritilmadi";
    if (!form.customerEmail.trim()) errors.customerEmail = "Email kiritilmadi";
    else if (!/\S+@\S+\.\S+/.test(form.customerEmail))
      errors.customerEmail = "Email noto'g'ri";
    if (!form.customerPhone.trim())
      errors.customerPhone = "Telefon kiritilmadi";
    if (!form.days || form.days < 1) errors.days = "Kun 1 dan kam bo'lmasin";
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  }

  async function handleSubmitBooking() {
    if (!currentUserId || !selectedCar) return;
    if (!validateForm()) return;
    const totalPrice = (selectedCar.price ?? 0) * form.days;
    setSubmitting(true);
    try {
      await addDoc(collection(db, "bookings"), {
        carId: selectedCar.id,
        userId: currentUserId,
        name: selectedCar.name,
        price: selectedCar.price,
        img: selectedCar.img,
        category: selectedCar.category,
        desc: selectedCar.desc,
        days: form.days,
        totalPrice,
        bookedAt: new Date().toISOString(),
        customerName: form.customerName,
        customerEmail: form.customerEmail,
        customerPhone: form.customerPhone,
      });
      setSubmitted(true);
      getBookings(currentUserId);
      setTimeout(() => {
        setModalOpen(false);
        setSubmitted(false);
        setForm({
          customerName: "",
          customerEmail: "",
          customerPhone: "",
          days: 1,
        });
      }, 2000);
    } catch (e) {
      console.error(e);
    } finally {
      setSubmitting(false);
    }
  }

  async function cancelBooking(bookingId: string) {
    await deleteDoc(doc(db, "bookings", bookingId));
    if (currentUserId) getBookings(currentUserId);
  }

  // ---------- Login bo'lmagan ----------
  if (!currentUserId) {
    return (
      <div style={S.page}>
        <div style={S.centered}>
          <div style={S.loginBox}>
            <p style={{ fontSize: 48, marginBottom: 16 }}>🔒</p>
            <h2
              style={{
                color: "#fff",
                fontSize: 20,
                fontWeight: 400,
                marginBottom: 8,
              }}
            >
              Ijaraga olish uchun tizimga kiring
            </h2>
            <p
              style={{
                color: "rgba(255,255,255,0.3)",
                fontSize: 13,
                marginBottom: 28,
              }}
            >
              Hisobingizga kiring yoki yangi hisob yarating
            </p>
            <button onClick={() => navigate("/signup")} style={S.signupBtn}>
              Ro'yxatdan o'tish
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ✅ selectedCar null bo'lsa ham crash bermaydi
  const isAlreadyBooked = selectedCar
    ? bookings.some((b) => b.carId === selectedCar.id)
    : false;
  const totalPrice = selectedCar ? (selectedCar.price ?? 0) * form.days : 0;

  return (
    <div style={S.page}>
      {/* ===== MODAL ===== */}
      {modalOpen && selectedCar && (
        <div
          style={S.overlay}
          onClick={() => !submitting && setModalOpen(false)}
        >
          <div style={S.modal} onClick={(e) => e.stopPropagation()}>
            {submitted ? (
              <div style={S.successBox}>
                <div style={S.successIcon}>✅</div>
                <h3
                  style={{
                    color: "#34d399",
                    fontSize: 18,
                    margin: "12px 0 6px",
                  }}
                >
                  Buyurtma qabul qilindi!
                </h3>
                <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 13 }}>
                  Tez orada siz bilan bog'lanamiz
                </p>
              </div>
            ) : (
              <>
                <div style={S.modalHeader}>
                  <div>
                    <h2 style={S.modalTitle}>Buyurtma rasmiylashtirish</h2>
                    <p style={S.modalSub}>{selectedCar.name}</p>
                  </div>
                  <button
                    onClick={() => setModalOpen(false)}
                    style={S.closeBtn}
                  >
                    ✕
                  </button>
                </div>

                <div style={S.miniPreview}>
                  <img
                    src={selectedCar.img}
                    alt={selectedCar.name}
                    style={S.miniImg}
                  />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p
                      style={{
                        color: "#fff",
                        fontSize: 14,
                        fontWeight: 600,
                        margin: 0,
                      }}
                    >
                      {selectedCar.name}
                    </p>
                    <p
                      style={{
                        color: "rgba(255,255,255,0.35)",
                        fontSize: 12,
                        margin: "4px 0 0",
                      }}
                    >
                      ${selectedCar.price?.toLocaleString()} / kun
                    </p>
                  </div>
                  <div style={S.miniTotal}>
                    <span
                      style={{ fontSize: 11, color: "rgba(255,255,255,0.3)" }}
                    >
                      JAMI
                    </span>
                    <span
                      style={{
                        fontSize: 22,
                        fontWeight: 700,
                        color: "#60a5fa",
                      }}
                    >
                      ${totalPrice.toLocaleString()}
                    </span>
                  </div>
                </div>

                <div style={S.formGrid}>
                  <Field
                    icon="👤"
                    label="Ism Sharif"
                    value={form.customerName}
                    placeholder="Ism Sharif..."
                    error={formErrors.customerName}
                    onChange={(v) =>
                      setForm((p) => ({ ...p, customerName: v }))
                    }
                  />
                  <Field
                    icon="📧"
                    label="Email"
                    value={form.customerEmail}
                    type="email"
                    placeholder="email@gmail.com"
                    error={formErrors.customerEmail}
                    onChange={(v) =>
                      setForm((p) => ({ ...p, customerEmail: v }))
                    }
                  />
                  <Field
                    icon="📞"
                    label="Telefon raqam"
                    value={form.customerPhone}
                    type="tel"
                    placeholder="+998 90 123 45 67"
                    error={formErrors.customerPhone}
                    onChange={(v) =>
                      setForm((p) => ({ ...p, customerPhone: v }))
                    }
                  />

                  <div style={S.fieldWrap}>
                    <label style={S.fieldLabel}>
                      <span style={S.fieldIcon}>🗓</span> Necha kun?
                    </label>
                    <div style={S.pickerRow}>
                      <button
                        style={S.pickerBtn}
                        onClick={() =>
                          setForm((p) => ({
                            ...p,
                            days: Math.max(1, p.days - 1),
                          }))
                        }
                      >
                        −
                      </button>
                      <input
                        type="number"
                        min={1}
                        value={form.days}
                        onChange={(e) =>
                          setForm((p) => ({
                            ...p,
                            days: Math.max(1, Number(e.target.value)),
                          }))
                        }
                        style={S.pickerInput}
                      />
                      <button
                        style={S.pickerBtn}
                        onClick={() =>
                          setForm((p) => ({ ...p, days: p.days + 1 }))
                        }
                      >
                        +
                      </button>
                    </div>
                    {formErrors.days && (
                      <p style={S.errorText}>{formErrors.days}</p>
                    )}
                  </div>
                </div>

                <div style={S.priceSummary}>
                  <span
                    style={{ color: "rgba(255,255,255,0.4)", fontSize: 13 }}
                  >
                    ${selectedCar.price?.toLocaleString()} × {form.days} kun
                  </span>
                  <span
                    style={{ color: "#60a5fa", fontSize: 22, fontWeight: 700 }}
                  >
                    ${totalPrice.toLocaleString()}
                  </span>
                </div>

                <button
                  onClick={handleSubmitBooking}
                  disabled={submitting}
                  style={{
                    ...S.submitBtn,
                    opacity: submitting ? 0.6 : 1,
                    cursor: submitting ? "not-allowed" : "pointer",
                  }}
                >
                  {submitting
                    ? "⏳ Yuborilmoqda..."
                    : "✅ Buyurtmani tasdiqlash"}
                </button>
              </>
            )}
          </div>
        </div>
      )}

      {/* ===== MAIN CONTENT ===== */}
      <div style={S.container}>
        <button onClick={() => navigate(-1)} style={S.backBtn}>
          ← Orqaga
        </button>

        <div style={S.tabRow}>
          <div>
            {/* ✅ selectedCar null bo'lsa crash bermaydi */}
            <h1 style={S.pageTitle}>
              {tab === "car" && selectedCar
                ? selectedCar.name
                : "Mening buyurtmalarim"}
            </h1>
            <div style={S.titleAccent} />
          </div>
          <div style={S.tabGroup}>
            {/* ✅ Mashina tab faqat selectedCar bor bo'lsa ko'rinadi */}
            {selectedCar && (
              <button
                onClick={() => setTab("car")}
                style={{
                  ...S.tabBtn,
                  ...(tab === "car" ? S.tabActive : S.tabInactive),
                }}
              >
                🚗 Mashina
              </button>
            )}
            <button
              onClick={() => setTab("bookings")}
              style={{
                ...S.tabBtn,
                ...(tab === "bookings" ? S.tabActive : S.tabInactive),
              }}
            >
              📋 Buyurtmalarim{" "}
              {bookings.length > 0 && (
                <span style={S.tabBadge}>{bookings.length}</span>
              )}
            </button>
          </div>
        </div>

        {/* ===== CAR TAB ===== */}
        {/* ✅ selectedCar null bo'lsa bu blok render bo'lmaydi */}
        {tab === "car" && selectedCar && (
          <div style={S.carLayout}>
            <div style={S.carImgWrap}>
              <img
                src={selectedCar.img}
                alt={selectedCar.name}
                style={S.carImg}
              />
              <div style={S.carImgGradient} />
              <span style={S.catBadge}>{selectedCar.category}</span>
              {isAlreadyBooked && (
                <span style={S.bookedBadge}>✓ Buyurtma berilgan</span>
              )}
            </div>

            <div style={S.infoPanel}>
              <div style={S.infoPanelInner}>
                <h2 style={S.carTitle}>{selectedCar.name}</h2>
                <p style={S.carDesc}>{selectedCar.desc}</p>
                <div style={S.divider} />
                <div style={S.priceDisplay}>
                  <div>
                    <p
                      style={{
                        color: "rgba(255,255,255,0.35)",
                        fontSize: 12,
                        margin: 0,
                      }}
                    >
                      Kunlik narx
                    </p>
                    <p style={S.priceValue}>
                      ${selectedCar.price?.toLocaleString()}
                      <span
                        style={{
                          fontSize: 14,
                          color: "rgba(255,255,255,0.3)",
                          fontWeight: 400,
                        }}
                      >
                        {" "}
                        /kun
                      </span>
                    </p>
                  </div>
                </div>

                {isAlreadyBooked ? (
                  <div style={S.alreadyBookedBox}>
                    <span>✅ Bu mashina allaqachon buyurtma qilingan</span>
                    <button
                      onClick={() => setTab("bookings")}
                      style={S.viewBookingBtn}
                    >
                      Buyurtmani ko'rish →
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setModalOpen(true)}
                    style={S.bookBtn}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.transform = "translateY(-2px)")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.transform = "translateY(0)")
                    }
                  >
                    📋 Buyurtma berish
                  </button>
                )}

                <div style={S.infoCards}>
                  <div style={S.infoCard}>
                    <span style={S.infoCardIcon}>📦</span>
                    <span style={S.infoCardLabel}>Kategoriya</span>
                    <span style={S.infoCardValue}>{selectedCar.category}</span>
                  </div>
                  <div style={S.infoCard}>
                    <span style={S.infoCardIcon}>✅</span>
                    <span style={S.infoCardLabel}>Holat</span>
                    <span style={{ ...S.infoCardValue, color: "#34d399" }}>
                      Mavjud
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ===== BOOKINGS TAB ===== */}
        {tab === "bookings" && (
          <>
            {bookings.length === 0 ? (
              <div style={S.empty}>
                <span
                  style={{ fontSize: 72, filter: "grayscale(1) opacity(0.2)" }}
                >
                  📋
                </span>
                <h4
                  style={{
                    color: "rgba(255,255,255,0.25)",
                    fontSize: 20,
                    margin: 0,
                  }}
                >
                  Buyurtma yo'q
                </h4>
                <p
                  style={{
                    color: "rgba(255,255,255,0.15)",
                    fontSize: 13,
                    margin: 0,
                  }}
                >
                  Hali hech qanday mashina ijaraga olinmagan
                </p>
              </div>
            ) : (
              <div style={S.bookingsGrid}>
                {bookings.map((booking) => (
                  <div key={booking.id} style={S.bookingCard}>
                    <div style={S.bookingImgWrap}>
                      <img
                        src={booking.img}
                        alt={booking.name}
                        style={S.bookingImg}
                      />
                      <div style={S.carImgGradient} />
                      <span style={S.catBadge}>{booking.category}</span>
                      <span style={S.activeBadge}>✓ Aktiv</span>
                    </div>
                    <div style={S.bookingBody}>
                      <h3 style={S.bookingName}>{booking.name}</h3>
                      <div style={S.bookingMeta}>
                        <Row
                          icon="👤"
                          label="Mijoz"
                          value={booking.customerName || "—"}
                        />
                        <Row
                          icon="📧"
                          label="Email"
                          value={booking.customerEmail || "—"}
                        />
                        <Row
                          icon="📞"
                          label="Telefon"
                          value={booking.customerPhone || "—"}
                        />
                        <Row
                          icon="🗓"
                          label="Muddat"
                          value={`${booking.days} kun`}
                        />
                        <Row
                          icon="🕒"
                          label="Sana"
                          value={new Date(
                            booking.bookedAt,
                          ).toLocaleDateString()}
                        />
                      </div>
                      <div style={S.divider} />
                      <div style={S.bookingPriceRow}>
                        <span
                          style={{
                            color: "rgba(255,255,255,0.35)",
                            fontSize: 12,
                          }}
                        >
                          ${booking.price?.toLocaleString()} × {booking.days}{" "}
                          kun
                        </span>
                        <span
                          style={{
                            color: "#60a5fa",
                            fontSize: 22,
                            fontWeight: 700,
                          }}
                        >
                          ${booking.totalPrice?.toLocaleString()}
                        </span>
                      </div>
                      <button
                        onClick={() => cancelBooking(booking.id)}
                        style={S.cancelBtn}
                      >
                        ✕ Bekor qilish
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

function Field({
  icon,
  label,
  value,
  placeholder,
  onChange,
  type = "text",
  error,
}: {
  icon: string;
  label: string;
  value: string;
  placeholder: string;
  onChange: (v: string) => void;
  type?: string;
  error?: string;
}) {
  return (
    <div style={S.fieldWrap}>
      <label style={S.fieldLabel}>
        <span style={S.fieldIcon}>{icon}</span> {label}
      </label>
      <input
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        style={{
          ...S.fieldInput,
          ...(error ? { borderColor: "rgba(239,68,68,0.5)" } : {}),
        }}
      />
      {error && <p style={S.errorText}>{error}</p>}
    </div>
  );
}

function Row({
  icon,
  label,
  value,
}: {
  icon: string;
  label: string;
  value: string;
}) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        padding: "4px 0",
      }}
    >
      <span style={{ fontSize: 12, color: "rgba(255,255,255,0.35)" }}>
        {icon} {label}
      </span>
      <span style={{ fontSize: 13, color: "#fff" }}>{value}</span>
    </div>
  );
}

const S: Record<string, any> = {
  page: {
    minHeight: "100vh",
    background:
      "linear-gradient(160deg, #07070f 0%, #0d0d1f 60%, #07070f 100%)",
    padding: "40px 20px",
    fontFamily: "'DM Sans', 'Segoe UI', sans-serif",
    color: "#fff",
  },
  container: { maxWidth: 1200, margin: "0 auto" },
  centered: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  loginBox: {
    textAlign: "center",
    background: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: 24,
    padding: "48px 40px",
  },
  signupBtn: {
    padding: "12px 28px",
    borderRadius: 12,
    border: "1px solid rgba(255,255,255,0.1)",
    background: "rgba(255,255,255,0.06)",
    color: "#fff",
    fontSize: 14,
    cursor: "pointer",
    fontFamily: "inherit",
  },
  backBtn: {
    background: "rgba(255,255,255,0.06)",
    border: "1px solid rgba(255,255,255,0.1)",
    color: "rgba(255,255,255,0.6)",
    padding: "8px 18px",
    borderRadius: 10,
    cursor: "pointer",
    fontSize: 13,
    fontFamily: "inherit",
    marginBottom: 32,
  },
  tabRow: {
    display: "flex",
    flexWrap: "wrap",
    alignItems: "flex-end",
    justifyContent: "space-between",
    marginBottom: 40,
    gap: 16,
  },
  pageTitle: {
    fontSize: 28,
    fontWeight: 300,
    letterSpacing: -0.5,
    margin: "0 0 8px",
    color: "#fff",
  },
  titleAccent: {
    width: 48,
    height: 2,
    background: "linear-gradient(90deg, #3b82f6, #6366f1)",
    borderRadius: 2,
  },
  tabGroup: {
    display: "flex",
    gap: 6,
    background: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(255,255,255,0.07)",
    borderRadius: 14,
    padding: 4,
  },
  tabBtn: {
    padding: "6px 16px",
    borderRadius: 10,
    border: "none",
    cursor: "pointer",
    fontSize: 13,
    fontWeight: 600,
    transition: "all 0.2s",
    fontFamily: "inherit",
  },
  tabActive: {
    background: "linear-gradient(135deg, #3b82f6, #6366f1)",
    color: "#fff",
  },
  tabInactive: { background: "transparent", color: "rgba(255,255,255,0.35)" },
  tabBadge: {
    background: "rgba(255,255,255,0.2)",
    borderRadius: 50,
    padding: "1px 7px",
    fontSize: 11,
    marginLeft: 4,
  },
  // carLayout: {
  //   display: "grid",
  //   gridTemplateColumns: "1fr 420px",
  //   gap: 32,
  //   alignItems: "start",
  // },
  carLayout: {
    display: "flex",
    gap: 20,
    alignItems: "stretch",
    justifyContent: "center",
    flexWrap: "wrap", // 🔥 responsive uchun muhim
  },
  // carImgWrap: {
  //   position: "relative",
  //   borderRadius: 22,
  //   overflow: "hidden",
  //   aspectRatio: "16/9",
  // },
  carImgWrap: {
    flex: "1 1 400px", // min 400px, kichik ekranda full bo'ladi
    maxWidth: "600px",
    width: "100%",
    position: "relative",
  },
  // carImg: {
  //   width: "100%",
  //   height: "100%",
  //   objectFit: "cover",
  //   display: "block",
  //   transition: "transform 0.6s ease",
  // },
  carImg: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    borderRadius: 16,
  },
  carImgGradient: {
    position: "absolute",
    inset: 0,
    background:
      "linear-gradient(to top, rgba(7,7,15,0.85) 0%, transparent 55%)",
  },
  catBadge: {
    position: "absolute",
    top: 14,
    left: 14,
    background: "rgba(59,130,246,0.85)",
    backdropFilter: "blur(10px)",
    color: "#fff",
    fontSize: 10,
    fontWeight: 700,
    padding: "4px 12px",
    borderRadius: 50,
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  bookedBadge: {
    position: "absolute",
    top: 14,
    right: 14,
    background: "rgba(16,185,129,0.85)",
    backdropFilter: "blur(10px)",
    color: "#fff",
    fontSize: 10,
    fontWeight: 700,
    padding: "4px 12px",
    borderRadius: 50,
  },
  activeBadge: {
    position: "absolute",
    top: 14,
    right: 14,
    background: "rgba(16,185,129,0.85)",
    backdropFilter: "blur(10px)",
    color: "#fff",
    fontSize: 10,
    fontWeight: 700,
    padding: "4px 12px",
    borderRadius: 50,
  },
  // infoPanel: {
  //   background: "rgba(255,255,255,0.04)",
  //   border: "1px solid rgba(255,255,255,0.07)",
  //   borderRadius: 22,
  //   overflow: "hidden",
  // },
  infoPanel: {
    flex: "1 1 400px",
    maxWidth: "600px",
    width: "100%",
    display: "flex",
  },
  infoPanelInner: {
    padding: 28,
    display: "flex",
    flexDirection: "column",
    gap: 16,
  },
  carTitle: {
    fontSize: 24,
    fontWeight: 400,
    margin: 0,
    color: "#f0f0ff",
    letterSpacing: -0.3,
  },
  carDesc: {
    fontSize: 13,
    color: "rgba(255,255,255,0.4)",
    lineHeight: 1.7,
    margin: 0,
  },
  divider: { height: 1, background: "rgba(255,255,255,0.07)" },
  priceDisplay: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  priceValue: {
    fontSize: 32,
    fontWeight: 700,
    color: "#60a5fa",
    margin: "4px 0 0",
    letterSpacing: -1,
  },
  bookBtn: {
    width: "100%",
    padding: "15px",
    borderRadius: 14,
    border: "none",
    background: "linear-gradient(135deg, #3b82f6 0%, #6366f1 100%)",
    color: "#fff",
    fontSize: 15,
    fontWeight: 600,
    cursor: "pointer",
    fontFamily: "inherit",
    boxShadow: "0 4px 24px rgba(99,102,241,0.35)",
    transition: "transform 0.2s",
    letterSpacing: 0.3,
  },
  alreadyBookedBox: {
    background: "rgba(16,185,129,0.08)",
    border: "1px solid rgba(16,185,129,0.2)",
    borderRadius: 14,
    padding: "14px 16px",
    color: "#34d399",
    fontSize: 13,
    display: "flex",
    flexDirection: "column",
    gap: 10,
  },
  viewBookingBtn: {
    background: "rgba(16,185,129,0.15)",
    border: "1px solid rgba(16,185,129,0.3)",
    color: "#34d399",
    padding: "8px 14px",
    borderRadius: 10,
    cursor: "pointer",
    fontSize: 13,
    fontFamily: "inherit",
    alignSelf: "flex-start",
  },
  infoCards: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: 10,
    marginTop: 4,
  },
  infoCard: {
    background: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(255,255,255,0.07)",
    borderRadius: 14,
    padding: "12px 14px",
    display: "flex",
    flexDirection: "column",
    gap: 4,
  },
  infoCardIcon: { fontSize: 18 },
  infoCardLabel: {
    fontSize: 11,
    color: "rgba(255,255,255,0.3)",
    letterSpacing: 0.5,
  },
  infoCardValue: { fontSize: 13, color: "#fff", fontWeight: 500 },
  empty: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    paddingTop: 100,
    gap: 12,
  },
  bookingsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
    gap: 24,
  },
  bookingCard: {
    background: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(255,255,255,0.07)",
    borderRadius: 22,
    overflow: "hidden",
  },
  bookingImgWrap: {
    position: "relative",
    aspectRatio: "16/9",
    overflow: "hidden",
  },
  bookingImg: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    display: "block",
  },
  bookingBody: {
    padding: "18px 20px",
    display: "flex",
    flexDirection: "column",
    gap: 10,
  },
  bookingName: { fontSize: 16, fontWeight: 400, margin: 0, color: "#f0f0ff" },
  bookingMeta: {
    background: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(255,255,255,0.07)",
    borderRadius: 12,
    padding: "10px 12px",
  },
  bookingPriceRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "4px 0",
  },
  cancelBtn: {
    width: "100%",
    padding: "12px",
    borderRadius: 12,
    border: "1px solid rgba(239,68,68,0.25)",
    background: "rgba(239,68,68,0.08)",
    color: "#f87171",
    fontSize: 13,
    fontWeight: 600,
    cursor: "pointer",
    fontFamily: "inherit",
  },
  overlay: {
    position: "fixed",
    inset: 0,
    background: "rgba(0,0,0,0.75)",
    backdropFilter: "blur(8px)",
    zIndex: 1000,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  modal: {
    background: "#0d0d1f",
    border: "1px solid rgba(255,255,255,0.1)",
    borderRadius: 24,
    width: "100%",
    maxWidth: 520,
    maxHeight: "90vh",
    overflowY: "auto",
    padding: 28,
    display: "flex",
    flexDirection: "column",
    gap: 18,
    boxShadow: "0 32px 80px rgba(0,0,0,0.8)",
  },
  modalHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  modalTitle: { fontSize: 20, fontWeight: 400, margin: 0, color: "#fff" },
  modalSub: {
    fontSize: 13,
    color: "rgba(255,255,255,0.35)",
    margin: "4px 0 0",
  },
  closeBtn: {
    background: "rgba(255,255,255,0.06)",
    border: "1px solid rgba(255,255,255,0.1)",
    color: "rgba(255,255,255,0.5)",
    width: 32,
    height: 32,
    borderRadius: 8,
    cursor: "pointer",
    fontSize: 14,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontFamily: "inherit",
    flexShrink: 0,
  },
  miniPreview: {
    display: "flex",
    gap: 14,
    alignItems: "center",
    background: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(255,255,255,0.07)",
    borderRadius: 14,
    padding: "12px 14px",
  },
  miniImg: {
    width: 72,
    height: 50,
    borderRadius: 10,
    objectFit: "cover",
    flexShrink: 0,
  },
  miniTotal: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-end",
    gap: 2,
    flexShrink: 0,
  },
  formGrid: { display: "flex", flexDirection: "column", gap: 14 },
  fieldWrap: { display: "flex", flexDirection: "column", gap: 8 },
  fieldLabel: {
    fontSize: 12,
    color: "rgba(255,255,255,0.45)",
    letterSpacing: 0.3,
    display: "flex",
    alignItems: "center",
    gap: 6,
  },
  fieldIcon: { fontSize: 14 },
  fieldInput: {
    background: "rgba(255,255,255,0.06)",
    border: "1px solid rgba(255,255,255,0.1)",
    borderRadius: 12,
    padding: "12px 14px",
    color: "#fff",
    fontSize: 14,
    outline: "none",
    fontFamily: "inherit",
    width: "100%",
    boxSizing: "border-box",
  },
  errorText: { color: "#f87171", fontSize: 11, margin: 0 },
  pickerRow: { display: "flex", alignItems: "center", gap: 10 },
  pickerBtn: {
    width: 38,
    height: 38,
    borderRadius: 10,
    border: "1px solid rgba(255,255,255,0.1)",
    background: "rgba(255,255,255,0.06)",
    color: "#fff",
    fontSize: 20,
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontFamily: "inherit",
    flexShrink: 0,
  },
  pickerInput: {
    flex: 1,
    textAlign: "center",
    background: "rgba(255,255,255,0.08)",
    border: "1px solid rgba(255,255,255,0.1)",
    borderRadius: 10,
    padding: "8px",
    color: "#fff",
    fontSize: 16,
    fontWeight: 700,
    outline: "none",
    fontFamily: "inherit",
  },
  priceSummary: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    background: "rgba(59,130,246,0.07)",
    border: "1px solid rgba(59,130,246,0.15)",
    borderRadius: 14,
    padding: "12px 16px",
  },
  submitBtn: {
    width: "100%",
    padding: "15px",
    borderRadius: 14,
    border: "none",
    background: "linear-gradient(135deg, #3b82f6 0%, #6366f1 100%)",
    color: "#fff",
    fontSize: 15,
    fontWeight: 600,
    cursor: "pointer",
    fontFamily: "inherit",
    boxShadow: "0 4px 24px rgba(99,102,241,0.35)",
    transition: "all 0.2s",
    letterSpacing: 0.3,
  },
  successBox: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: "40px 20px",
    textAlign: "center",
  },
  successIcon: { fontSize: 56 },
};

export default Book;
