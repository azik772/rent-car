
import { collection, getDocs } from "firebase/firestore";
import { auth, db } from "../firebase.config";
import type { Car } from "./Home";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

interface Props {
  search?: string;
}

const Cars = ({ search = "" }: Props) => {
  const navigate = useNavigate();
  const [locationSearch, setLocationSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getProducts();
  }, []);

  async function getProducts() {
    setLoading(true);
    try {
      const carsCol = collection(db, "cars");
      const res = await getDocs(carsCol);
      const arr = res.docs.map((itm) => ({
        ...(itm.data() as Car),
        id: itm.id,
      }));
      setCars(arr);
    } catch (error) {
      console.error("❌ Mashinalarni olishda xatolik:", error);
    } finally {
      setLoading(false);
    }
  }

  async function addtobook(car: Car) {
    let userId: string | null = null;
    const localUser = localStorage.getItem("user");
    if (localUser) {
      const userData = JSON.parse(localUser);
      if (userData.email === "azizbeknarzullayevo1o@gmail.com")
        userId = "admin";
    }
    if (!userId && auth.currentUser) userId = auth.currentUser.uid;
    if (!userId) {
      alert("⚠️ Avval tizimga kiring!");
      navigate("/signup");
      return;
    }

  
      alert(`✅ ${car.name} savatga qo'shildi!`);
       navigate("/book", { state: { car } });
 
  }

  const filteredCars = cars.filter((car) => {
    const matchesSearch = (car.name ?? "")
      .toLowerCase()
      .includes(search.toLowerCase());
    const matchesLocation =
      locationSearch === "" ||
      (car.location ?? "")
        .toLowerCase()
        .startsWith(locationSearch.toLowerCase());
    const matchesCategory =
      categoryFilter === "" ||
      (car.category ?? "").toLowerCase().includes(categoryFilter.toLowerCase());
    return matchesSearch && matchesLocation && matchesCategory;
  });

  const categories = ["", "economy", "standart", "electro", "luxury"];
  const categoryLabels: Record<string, string> = {
    "": "Barchasi",
    economy: "Economy",
    standart: "Standart",
    electro: "Elektromobil",
    luxury: "Luxury",
  };

  if (loading) {
    return (
      <div style={styles.loadingWrapper}>
        <div style={styles.spinner} />
        <p style={styles.loadingText}>Yuklanmoqda...</p>
      </div>
    );
  }

  return (
    <div style={styles.page}>
      {/* Filter Bar */}
      <div style={styles.filterBar}>
        <div style={styles.filterGroup}>
          <label style={styles.filterLabel}>📍 Joylashuv</label>
          <input
            type="text"
            style={styles.input}
            placeholder="Shahar yoki manzil..."
            value={locationSearch}
            onChange={(e) => setLocationSearch(e.target.value)}
            onFocus={(e) => Object.assign(e.target.style, styles.inputFocus)}
            onBlur={(e) => Object.assign(e.target.style, styles.input)}
          />
        </div>

        <div style={styles.filterGroup}>
          <label style={styles.filterLabel}>🏷 Kategoriya</label>
          <div style={styles.categoryTabs}>
            {categories.map((cat) => (
              <button
                key={cat}
                style={{
                  ...styles.catTab,
                  ...(categoryFilter === cat ? styles.catTabActive : {}),
                }}
                onClick={() => setCategoryFilter(cat)}
              >
                {categoryLabels[cat]}
              </button>
            ))}
          </div>
        </div>

        {(locationSearch || categoryFilter) && (
          <button
            style={styles.clearBtn}
            onClick={() => {
              setLocationSearch("");
              setCategoryFilter("");
            }}
          >
            ✕ Tozalash
          </button>
        )}
      </div>

      {/* Results count */}
      <p style={styles.resultsCount}>
        {filteredCars.length} ta mashina topildi
      </p>

      {filteredCars.length === 0 ? (
        <div style={styles.emptyState}>
          <div style={styles.emptyIcon}>🚗</div>
          <h4 style={styles.emptyTitle}>Mashina topilmadi</h4>
          <p style={styles.emptyText}>
            Boshqa kalit so'z yoki filtr bilan urinib ko'ring
          </p>
        </div>
      ) : (
        <div style={styles.grid}>
          {filteredCars.map((car) => (
            <CarCard key={car.id} car={car} onBook={addtobook} />
          ))}
        </div>
      )}
    </div>
  );
};

const CarCard = ({ car, onBook }: { car: Car; onBook: (car: Car) => void }) => {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      style={{ ...styles.card, ...(hovered ? styles.cardHover : {}) }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Image */}
      <div style={styles.imgWrapper}>
        <img
          src={car.img}
          alt={car.name}
          style={{
            ...styles.img,
            transform: hovered ? "scale(1.06)" : "scale(1)",
          }}
        />
        <div style={styles.imgOverlay} />
        <span style={styles.categoryBadge}>{car.category}</span>
        <span style={styles.locationBadge}>📍 {car.location}</span>
      </div>

      {/* Content */}
      <div style={styles.cardBody}>
        <h2 style={styles.carName}>{car.name}</h2>
        <p style={styles.carDesc}>{car.desc}</p>

        <div style={styles.cardFooter}>
          <div>
            <span style={styles.priceLabel}>Kunlik narx</span>
            <div style={styles.price}>
              ${car.price?.toLocaleString()}
              <span style={styles.perDay}>/kun</span>
            </div>
          </div>
          <div style={styles.stars}>★★★★☆</div>
        </div>

        <button
          style={{ ...styles.bookBtn, ...(hovered ? styles.bookBtnHover : {}) }}
          onClick={() => onBook(car)}
        >
          Ijaraga Olish →
        </button>
      </div>
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  page: {
    minHeight: "100vh",
    background:
      "linear-gradient(135deg, #0a0a0f 0%, #0f0f1a 50%, #0a0a0f 100%)",
    padding: "40px 24px",
    fontFamily: "'DM Sans', 'Segoe UI', sans-serif",
    color: "#fff",
  },
  filterBar: {
    maxWidth: 1280,
    margin: "0 auto 32px auto",
    background: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: 20,
    padding: "24px 28px",
    display: "flex",
    flexWrap: "wrap",
    gap: 24,
    alignItems: "flex-end",
    backdropFilter: "blur(20px)",
  },
  filterGroup: {
    display: "flex",
    flexDirection: "column",
    gap: 8,
  },
  filterLabel: {
    fontSize: 11,
    color: "rgba(255,255,255,0.4)",
    textTransform: "uppercase",
    letterSpacing: 1.2,
    fontWeight: 600,
  },
  input: {
    background: "rgba(255,255,255,0.06)",
    border: "1px solid rgba(255,255,255,0.1)",
    borderRadius: 12,
    padding: "10px 16px",
    color: "#fff",
    fontSize: 14,
    width: 240,
    outline: "none",
    transition: "all 0.2s",
  },
  inputFocus: {
    background: "rgba(255,255,255,0.09)",
    border: "1px solid rgba(99,179,237,0.5)",
    borderRadius: 12,
    padding: "10px 16px",
    color: "#fff",
    fontSize: 14,
    width: 240,
    outline: "none",
  },
  categoryTabs: {
    display: "flex",
    gap: 8,
    flexWrap: "wrap",
  },
  catTab: {
    padding: "8px 16px",
    borderRadius: 50,
    border: "1px solid rgba(255,255,255,0.12)",
    background: "transparent",
    color: "rgba(255,255,255,0.5)",
    fontSize: 13,
    cursor: "pointer",
    transition: "all 0.2s",
    fontFamily: "'DM Sans', sans-serif",
  },
  catTabActive: {
    background: "linear-gradient(135deg, #3b82f6, #6366f1)",
    border: "1px solid transparent",
    color: "#fff",
    fontWeight: 600,
  },
  clearBtn: {
    background: "rgba(239,68,68,0.1)",
    border: "1px solid rgba(239,68,68,0.3)",
    color: "#f87171",
    borderRadius: 10,
    padding: "8px 16px",
    fontSize: 13,
    cursor: "pointer",
    fontFamily: "'DM Sans', sans-serif",
    alignSelf: "flex-end",
  },
  resultsCount: {
    maxWidth: 1280,
    margin: "0 auto 20px auto",
    fontSize: 13,
    color: "rgba(255,255,255,0.3)",
    letterSpacing: 0.5,
  },
  grid: {
    maxWidth: 1280,
    margin: "0 auto",
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
    gap: 24,
  },
  card: {
    background: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: 20,
    overflow: "hidden",
    display: "flex",
    flexDirection: "column",
    transition: "all 0.3s ease",
    cursor: "pointer",
  },
  cardHover: {
    background: "rgba(255,255,255,0.07)",
    border: "1px solid rgba(99,179,237,0.25)",
    transform: "translateY(-4px)",
    boxShadow: "0 20px 60px rgba(0,0,0,0.5), 0 0 30px rgba(59,130,246,0.1)",
  },
  imgWrapper: {
    position: "relative",
    overflow: "hidden",
    aspectRatio: "16/9",
  },
  img: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    transition: "transform 0.5s ease",
    display: "block",
  },
  imgOverlay: {
    position: "absolute",
    inset: 0,
    background: "linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 50%)",
  },
  categoryBadge: {
    position: "absolute",
    top: 12,
    left: 12,
    background: "rgba(59,130,246,0.85)",
    backdropFilter: "blur(8px)",
    color: "#fff",
    fontSize: 11,
    fontWeight: 600,
    padding: "4px 12px",
    borderRadius: 50,
    textTransform: "uppercase",
    letterSpacing: 0.8,
  },
  locationBadge: {
    position: "absolute",
    bottom: 12,
    left: 12,
    color: "rgba(255,255,255,0.85)",
    fontSize: 12,
    textShadow: "0 1px 4px rgba(0,0,0,0.5)",
  },
  cardBody: {
    padding: "20px",
    display: "flex",
    flexDirection: "column",
    flex: 1,
    gap: 8,
  },
  carName: {
    fontSize: 16,
    fontWeight: 400,
    color: "#fff",
    margin: 0,
    letterSpacing: 0.3,
  },
  carDesc: {
    fontSize: 13,
    color: "rgba(255,255,255,0.35)",
    lineHeight: 1.6,
    margin: 0,
    display: "-webkit-box",
    WebkitLineClamp: 2,
    WebkitBoxOrient: "vertical",
    overflow: "hidden",
  },
  cardFooter: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-end",
    marginTop: 8,
    paddingTop: 16,
    borderTop: "1px solid rgba(255,255,255,0.06)",
  },
  priceLabel: {
    fontSize: 10,
    color: "rgba(255,255,255,0.3)",
    display: "block",
    marginBottom: 2,
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  price: {
    fontSize: 22,
    fontWeight: 700,
    color: "#60a5fa",
    letterSpacing: -0.5,
  },
  perDay: {
    fontSize: 12,
    fontWeight: 400,
    color: "rgba(255,255,255,0.3)",
    marginLeft: 4,
  },
  stars: {
    color: "#fbbf24",
    fontSize: 13,
    letterSpacing: 1,
  },
  bookBtn: {
    marginTop: 16,
    width: "100%",
    background: "linear-gradient(135deg, #3b82f6 0%, #6366f1 100%)",
    border: "none",
    borderRadius: 12,
    padding: "12px",
    color: "#fff",
    fontSize: 14,
    fontWeight: 600,
    cursor: "pointer",
    fontFamily: "'DM Sans', sans-serif",
    transition: "all 0.2s",
    letterSpacing: 0.3,
  },
  bookBtnHover: {
    background: "linear-gradient(135deg, #2563eb 0%, #4f46e5 100%)",
    transform: "scale(1.01)",
    boxShadow: "0 8px 24px rgba(99,102,241,0.4)",
  },
  loadingWrapper: {
    minHeight: "100vh",
    background: "#0a0a0f",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: 16,
  },
  spinner: {
    width: 40,
    height: 40,
    border: "3px solid rgba(255,255,255,0.1)",
    borderTop: "3px solid #3b82f6",
    borderRadius: "50%",
  },
  loadingText: {
    color: "rgba(255,255,255,0.3)",
    fontSize: 14,
  },
  emptyState: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: "80px 0",
    gap: 12,
  },
  emptyIcon: {
    fontSize: 72,
    filter: "grayscale(1) opacity(0.3)",
  },
  emptyTitle: {
    fontSize: 22,
    fontWeight: 600,
    color: "rgba(255,255,255,0.3)",
    margin: 0,
  },
  emptyText: {
    fontSize: 14,
    color: "rgba(255,255,255,0.2)",
    margin: 0,
  },
};

export default Cars;
