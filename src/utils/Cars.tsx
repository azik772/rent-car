// import { addDoc, collection, getDocs } from "firebase/firestore";
// import { auth, db } from "../firebase.config";
// import type { Car } from "./Home";
// import { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";

// interface Props {
//   search?: string;
// }

// const Cars = ({ search = "" }: Props) => {
//   useEffect(() => {
//     getProducts();
//   }, []);
//   const navigate = useNavigate();
//   const [categorySearch, setCategorySearch] = useState("");
//   const [cars, setCars] = useState<Car[]>([]);
//   function getProducts() {
//     const cars = collection(db, "cars");
//     getDocs(cars).then((res) => {
//       const arr = res.docs.map((itm) => {
//         return { ...(itm.data() as Car), id: itm.id };
//       });
//       setCars(arr);
//     });
//   }
//   async function addtobook(i: number) {
//     const car = cars[i];

//     // User ID olish
//     let userId: string | null = null;

//     // Admin tekshirish
//     const localUser = localStorage.getItem("user");
//     if (localUser) {
//       const userData = JSON.parse(localUser);
//       if (userData.email === "azizbeknarzullayevo1o@gmail.com") {
//         userId = "admin";
//       }
//     }

//     if (!userId && auth.currentUser) {
//       userId = auth.currentUser.uid;
//     }

//     if (!userId) {
//       alert("⚠️ Avval tizimga kiring!");
//       navigate("/signup");
//       return;
//     }

//     try {
//       const booking = collection(db, "bookings");
//       await addDoc(booking, {
//         userId: userId,
//         carId: car.id,
//         name: car.name,
//         price: car.price,
//         img: car.img,
//         category: car.category,
//         desc: car.desc,
//         quantity: 1,
//         addedAt: new Date().toISOString(),
//       });

//       alert(`✅ ${car.name} savatga qo'shildi!`);
//     } catch (error) {
//       console.error("❌ Xatolik:", error);
//     }
//     navigate("/bookings");
//   }

//   const filteredCars = cars.filter((car) => {
//     const matchesSearch = car.name
//       .toLowerCase()
//       .includes(search.toLowerCase());
//     const matchesCategory =
//       categorySearch === "" ||
//       car.category.toLowerCase().includes(categorySearch.toLowerCase());

//     return matchesSearch && matchesCategory;
//   });

//   return (
//     <div className="max-w-7xl mx-auto px-4 py-8">
//       {filteredCars.length === 0 ? (
//         <div className="flex flex-col items-center justify-center mt-20 text-gray-400">
//           <span className="text-8xl mb-4">🚗</span>
//           <h4 className="text-2xl font-bold text-gray-500">No cars found</h4>
//           <p className="text-sm mt-2 text-gray-400">
//             Try a different search keyword
//           </p>
//         </div>
//       ) : (
//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
//           <div className="max-w-7xl mx-auto mb-12 relative z-10">
//             <div className="bg-white/60 backdrop-blur-xl border border-white/40 shadow-xl rounded-3xl px-6 py-5 flex flex-wrap gap-4 items-center justify-between transition hover:shadow-2xl">
//               {/* CATEGORY */}
//               <div className="flex flex-col gap-1">
//                 <label className="text-xs text-gray-500 font-medium">
//                   Location
//                 </label>
//                 <input
//                   type="text"
//                   className="form-control"
//                   placeholder="City, address, airport, or hotel"
//                   value={categorySearch}
//                   onChange={(e) => setCategorySearch(e.target.value)}
//                 />
//               </div>
//             </div>
//           </div>

//           {filteredCars.map((car, i) => (
//             <div
//               key={car.id}
//               className="group bg-white rounded-3xl shadow-md hover:shadow-2xl transition-all duration-300 overflow-hidden flex flex-col border border-gray-100"
//             >
//               <div className="relative overflow-hidden h-52">
//                 <img
//                   src={car.img}
//                   alt={car.name}
//                   className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
//                 />
//                 <span className="absolute top-3 left-3 bg-blue-600 text-white text-xs font-semibold px-3 py-1 rounded-full shadow">
//                   {car.category}
//                 </span>
//                 <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
//               </div>

//               <div className="p-5 flex flex-col flex-1">
//                 <h2 className="text-lg font-bold text-gray-800 mb-2 group-hover:text-blue-600 transition-colors duration-200">
//                   {car.name}
//                 </h2>

//                 <p className="text-sm text-gray-500 leading-relaxed line-clamp-2 mb-4">
//                   {car.desc}
//                 </p>
//                 <p className="text-sm text-gray-500 leading-relaxed line-clamp-2 mb-4">
//                   {car.location}
//                 </p>

//                 <div className="border-t border-dashed border-gray-200 my-3" />

//                 <div className="mt-auto">
//                   <div className="flex items-center justify-between mb-4">
//                     <div>
//                       <p className="text-xs text-gray-400 mb-0.5">Narxi</p>
//                       <p className="text-blue-600 text-2xl font-extrabold">
//                         ${car.price?.toLocaleString()}
//                         <span className="text-sm font-medium text-gray-400 ml-1">
//                           / kun
//                         </span>
//                       </p>
//                     </div>
//                     <div className="flex gap-0.5 text-yellow-400 text-sm">
//                       {"★★★★☆"}
//                     </div>
//                   </div>

//                   <button
//                     className="w-full bg-blue-600 hover:bg-blue-700 active:scale-95 text-white text-sm font-semibold py-3 rounded-2xl transition-all duration-200 flex items-center justify-center gap-2 shadow-md shadow-blue-200"
//                     onClick={() => addtobook(i)}
//                   >
//                     🚘 Ijaraga Olish
//                   </button>
//                 </div>
//               </div>
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// };

// export default Cars;
// import { addDoc, collection, getDocs } from "firebase/firestore";
// import { auth, db } from "../firebase.config";
// import type { Car } from "./Home";
// import { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";

// interface Props {
//   search?: string;
// }

// const Cars = ({ search = "" }: Props) => {
//   const navigate = useNavigate();
//   const [locationSearch, setLocationSearch] = useState(""); // ✅ nom to'g'rilandi: categorySearch → locationSearch
//   const [categoryFilter, setCategoryFilter] = useState(""); // ✅ alohida kategoriya filter
//   const [cars, setCars] = useState<Car[]>([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     getProducts();
//   }, []);

//   async function getProducts() {
//     setLoading(true);
//     try {
//       const carsCol = collection(db, "cars");
//       const res = await getDocs(carsCol);
//       const arr = res.docs.map((itm) => ({
//         ...(itm.data() as Car),
//         id: itm.id,
//       }));
//       setCars(arr);
//     } catch (error) {
//       console.error("❌ Mashinalarni olishda xatolik:", error);
//     } finally {
//       setLoading(false);
//     }
//   }

//   // ✅ indeks o'rniga to'g'ridan-to'g'ri Car obyektini qabul qiladi — xavfsiz!
//   async function addtobook(car: Car) {
//     let userId: string | null = null;

//     const localUser = localStorage.getItem("user");
//     if (localUser) {
//       const userData = JSON.parse(localUser);
//       if (userData.email === "azizbeknarzullayevo1o@gmail.com") {
//         userId = "admin";
//       }
//     }

//     if (!userId && auth.currentUser) {
//       userId = auth.currentUser.uid;
//     }

//     if (!userId) {
//       alert("⚠️ Avval tizimga kiring!");
//       navigate("/signup");
//       return;
//     }

//     try {
//       const booking = collection(db, "bookings");
//       await addDoc(booking, {
//         userId: userId,
//         carId: car.id,
//         name: car.name,
//         price: car.price,
//         img: car.img,
//         category: car.category,
//         location: car.location,
//         desc: car.desc,
//         quantity: 1,
//         addedAt: new Date().toISOString(),
//       });

//       alert(`✅ ${car.name} savatga qo'shildi!`);
//       navigate("/bookings");
//     } catch (error) {
//       console.error("❌ Xatolik:", error);
//       alert("❌ Xatolik yuz berdi. Qayta urinib ko'ring.");
//     }
//   }

//   // ✅ Uchta filter birga ishlaydi: nom, joylashuv, kategoriya
//  const filteredCars = cars.filter((car) => {
//    const matchesSearch = (car.name ?? "")
//      .toLowerCase()
//      .includes(search.toLowerCase());
// const matchesLocation =
//   locationSearch === "" ||
//   (car.location ?? "").toLowerCase().startsWith(locationSearch.toLowerCase());
//    const matchesCategory =
//      categoryFilter === "" ||
//      (car.category ?? "").toLowerCase().includes(categoryFilter.toLowerCase());

//    return matchesSearch && matchesLocation && matchesCategory;
//  });

//   if (loading) {
//     return (
//       <div className="flex items-center justify-center mt-20 text-gray-400">
//         <p className="text-lg">Yuklanmoqda...</p>
//       </div>
//     );
//   }

//   return (
//     <div className="max-w-7xl mx-auto px-4 py-8">
//       {/* Filter paneli */}
//       <div className="bg-white/70 backdrop-blur-xl border border-gray-200 shadow-lg rounded-2xl px-6 py-5 flex flex-wrap gap-4 items-end justify-between mb-10">
//         <div className="flex flex-col gap-1">
//           <label className="text-xs text-gray-400 font-medium tracking-wide uppercase">
//             Joylashuv
//           </label>
//           <input
//             type="text"
//             className="border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 w-64 bg-gray-50"
//             placeholder="Shahar yoki manzil..."
//             value={locationSearch}
//             onChange={(e) => setLocationSearch(e.target.value)}
//           />
//         </div>

//         <div className="flex flex-col gap-1">
//           <label className="text-xs text-gray-400 font-medium tracking-wide uppercase">
//             Kategoriya
//           </label>
//           <select
//             className="border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 h-[42px] bg-gray-50 w-48"
//             value={categoryFilter}
//             onChange={(e) => setCategoryFilter(e.target.value)}
//           >
//             <option value="">Barchasi</option>
//             <option value="economy">Economy</option>
//             <option value="standart">Standart</option>
//             <option value="electro">Elektromobil</option>
//             <option value="luxury">Luxury</option>
//           </select>
//         </div>

//         {(locationSearch || categoryFilter) && (
//           <button
//             className="text-sm text-red-400 hover:text-red-600 underline transition"
//             onClick={() => {
//               setLocationSearch("");
//               setCategoryFilter("");
//             }}
//           >
//             Filterni tozalash
//           </button>
//         )}
//       </div>

//       {filteredCars.length === 0 ? (
//         <div className="flex flex-col items-center justify-center mt-24 text-gray-300">
//           <span className="text-9xl mb-4">🚗</span>
//           <h4 className="text-2xl font-semibold text-gray-400">
//             Mashina topilmadi
//           </h4>
//           <p className="text-sm mt-2 text-gray-300">
//             Boshqa kalit so'z yoki filtr bilan urinib ko'ring
//           </p>
//         </div>
//       ) : (
//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
//           {filteredCars.map((car) => (
//             <div
//               key={car.id}
//               className="group bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col border border-gray-100"
//             >
//               {/* Rasm — katta */}
//               <div className="relative overflow-hidden aspect-video">
//                 <img
//                   src={car.img}
//                   alt={car.name}
//                   className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
//                 />
//                 <span className="absolute top-3 left-3 bg-blue-600 text-white text-xs font-medium px-3 py-1 rounded-full">
//                   {car.category}
//                 </span>
//                 <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
//                 {/* Location overlay rasmning pastida */}
//                 <p className="absolute bottom-3 left-3 text-white text-xs flex items-center gap-1">
//                   📍 {car.location}
//                 </p>
//               </div>

//               {/* Kontent */}
//               <div className="p-4 flex flex-col flex-1">
//                 <h2 className="text-base font-normal text-gray-800 mb-1">
//                   {car.name}
//                 </h2>
//                 <p className="text-xs text-gray-400 leading-relaxed line-clamp-2 mb-4">
//                   {car.desc}
//                 </p>

//                 <div className="mt-auto">
//                   <div className="flex items-center justify-between mb-3">
//                     <div>
//                       <p className="text-xs text-gray-400 mb-0.5">Narxi</p>
//                       <p className="text-blue-600 text-xl font-bold">
//                         ${car.price?.toLocaleString()}
//                         <span className="text-xs font-normal text-gray-400 ml-1">
//                           / kun
//                         </span>
//                       </p>
//                     </div>
//                     <div className="text-yellow-400 text-sm">★★★★☆</div>
//                   </div>

//                   <button
//                     className="w-full bg-blue-600 hover:bg-blue-700 active:scale-95 text-white text-sm font-medium py-2.5 rounded-xl transition-all duration-200 flex items-center justify-center gap-2"
//                     onClick={() => addtobook(car)}
//                   >
//                     🚘 Ijaraga Olish
//                   </button>
//                 </div>
//               </div>
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// };

// export default Cars;
import { addDoc, collection, getDocs } from "firebase/firestore";
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
    try {
      const booking = collection(db, "bookings");
      await addDoc(booking, {
        userId,
        carId: car.id,
        name: car.name,
        price: car.price,
        img: car.img,
        category: car.category,
        location: car.location,
        desc: car.desc,
        quantity: 1,
        addedAt: new Date().toISOString(),
      });
      alert(`✅ ${car.name} savatga qo'shildi!`);
      navigate("/bookings");
    } catch (error) {
      console.error("❌ Xatolik:", error);
      alert("❌ Xatolik yuz berdi. Qayta urinib ko'ring.");
    }
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
