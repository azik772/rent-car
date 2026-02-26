// import React, { useEffect, useState } from 'react'
// import { useNavigate } from 'react-router-dom';
// import type { Car } from '../utils/Home';
// import { collection, getDocs } from 'firebase/firestore';
// import { db } from '../firebase.config';

// const Book = () => {
//      useEffect(() => {
//        getProducts();
//      }, []);
//      const navigate = useNavigate();
//      const [cars, setCars] = useState<Car[]>([]);
//      function getProducts() {
//        const cars = collection(db, "bookings");
//        getDocs(cars).then((res) => {
//          const arr = res.docs.map((itm) => {
//            return { ...(itm.data() as Car), id: itm.id };
//          });
//          setCars(arr);
//        });
//      }
//   return (
//     <div>

//     </div>
//   )
// }

// export default Book
import { collection, addDoc, getDocs } from "firebase/firestore";
import { db } from "../firebase.config";
import { useEffect, useState } from "react";
import type { Car } from "../utils/Home";

interface Props {
  search: string;
}

const Book = ({ search }: Props) => {
  const [cars, setCars] = useState<(Car & { id: string })[]>([]);
  const [days, setDays] = useState<{ [id: string]: number }>({});
  const [loading, setLoading] = useState<{ [id: string]: boolean }>({});
  const [booked, setBooked] = useState<{ [id: string]: boolean }>({});

  useEffect(() => {
    getCars();
  }, []);

  function getCars() {
    const carsCollection = collection(db, "bookings");
    getDocs(carsCollection).then((res) => {
      const arr = res.docs.map((itm) => ({
        ...(itm.data() as Car),
        id: itm.id,
      }));
      setCars(arr);
      const initialDays: { [id: string]: number } = {};
      arr.forEach((car) => (initialDays[car.id] = 1));
      setDays(initialDays);
    });
  }

  async function handleBook(car: Car & { id: string }) {
    const carDays = days[car.id] ?? 1;
    const totalPrice = (car.price ?? 0) * carDays;

    setLoading((prev) => ({ ...prev, [car.id]: true }));
    try {
      await addDoc(collection(db, "bookings"), {
        ...car,
        days: carDays,
        totalPrice,
        bookedAt: new Date().toISOString(),
      });
      setBooked((prev) => ({ ...prev, [car.id]: true }));
    } catch (e) {
      console.error(e);
    } finally {
      setLoading((prev) => ({ ...prev, [car.id]: false }));
    }
  }

  const filteredCars = cars.filter((car) =>
    car.name?.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div style={S.page}>
      <div style={S.container}>
        {/* Header */}
        <div style={S.header}>
          <div>
            <h1 style={S.title}>Mashinalar</h1>
            <p style={S.subtitle}>{filteredCars.length} ta mavjud</p>
          </div>
          <div style={S.titleAccent} />
        </div>

        {filteredCars.length === 0 ? (
          <div style={S.empty}>
            <span style={S.emptyIcon}>🚗</span>
            <h4 style={S.emptyTitle}>Mashina topilmadi</h4>
            <p style={S.emptyText}>Boshqa kalit so'z bilan urinib ko'ring</p>
          </div>
        ) : (
          <div style={S.grid}>
            {filteredCars.map((car) => {
              const carDays = days[car.id] ?? 1;
              const totalPrice = (car.price ?? 0) * carDays;
              const isBooked = booked[car.id];
              const isLoading = loading[car.id];

              return (
                <div
                  key={car.id}
                  style={S.card}
                  onMouseEnter={(e) =>
                    Object.assign(
                      (e.currentTarget as HTMLDivElement).style,
                      S.cardHoverStyle,
                    )
                  }
                  onMouseLeave={(e) =>
                    Object.assign(
                      (e.currentTarget as HTMLDivElement).style,
                      S.cardBaseStyle,
                    )
                  }
                >
                  {/* Image */}
                  <div style={S.imgBox}>
                    <img
                      src={car.img}
                      alt={car.name}
                      style={S.img}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.transform = "scale(1.07)")
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.transform = "scale(1)")
                      }
                    />
                    <div style={S.imgGradient} />
                    <span style={S.badge}>{car.category}</span>
                    {isBooked && <span style={S.bookedBadge}>✓ Buyurtma</span>}
                  </div>

                  {/* Body */}
                  <div style={S.body}>
                    <h2 style={S.carName}>{car.name}</h2>
                    <p style={S.carDesc}>{car.desc}</p>

                    <div style={S.divider} />

                    {/* Days picker */}
                    <div style={S.pickerBox}>
                      <label style={S.pickerLabel}>🗓 Necha kun?</label>
                      <div style={S.pickerRow}>
                        <button
                          style={S.pickerBtn}
                          onClick={() =>
                            setDays((prev) => ({
                              ...prev,
                              [car.id]: Math.max(1, (prev[car.id] ?? 1) - 1),
                            }))
                          }
                        >
                          −
                        </button>
                        <input
                          type="number"
                          min={1}
                          value={carDays}
                          onChange={(e) =>
                            setDays((prev) => ({
                              ...prev,
                              [car.id]: Math.max(1, Number(e.target.value)),
                            }))
                          }
                          style={S.pickerInput}
                        />
                        <button
                          style={S.pickerBtn}
                          onClick={() =>
                            setDays((prev) => ({
                              ...prev,
                              [car.id]: (prev[car.id] ?? 1) + 1,
                            }))
                          }
                        >
                          +
                        </button>
                      </div>
                    </div>

                    {/* Price row */}
                    <div style={S.priceRow}>
                      <span style={S.priceSmall}>
                        ${car.price?.toLocaleString()} × {carDays} kun
                      </span>
                      <span style={S.priceBig}>
                        ${totalPrice.toLocaleString()}
                      </span>
                    </div>

                    {/* Book button */}
                    <button
                      onClick={() => handleBook(car)}
                      disabled={isLoading || isBooked}
                      style={{
                        ...S.btn,
                        ...(isBooked
                          ? S.btnBooked
                          : isLoading
                            ? S.btnLoading
                            : S.btnNormal),
                      }}
                    >
                      {isLoading
                        ? "⏳ Yuklanmoqda..."
                        : isBooked
                          ? "✅ Buyurtma berildi!"
                          : "Ijaraga olish →"}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
    // <div className="min-h-screen bg-gray-50 px-4 py-10">
    //   <div className="max-w-7xl mx-auto">
    //     <div className="mb-8">
    //       <h1 className="text-3xl font-bold text-gray-800">
    //         🚘 Mavjud mashinalar
    //       </h1>
    //       <p className="text-gray-400 mt-1 text-sm">
    //         {filteredCars.length} ta mashina topildi
    //       </p>
    //     </div>

    //     {filteredCars.length === 0 ? (
    //       <div className="flex flex-col items-center justify-center mt-32 text-gray-400">
    //         <span className="text-8xl mb-4">🚗</span>
    //         <h4 className="text-2xl font-bold text-gray-500">No cars found</h4>
    //         <p className="text-sm mt-2">Try a different search keyword</p>
    //       </div>
    //     ) : (
    //       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
    //         {filteredCars.map((car) => {
    //           const carDays = days[car.id] ?? 1;
    //           const totalPrice = (car.price ?? 0) * carDays;

    //           return (
    //             <div
    //               key={car.id}
    //               className="group bg-white rounded-3xl shadow-md hover:shadow-2xl transition-all duration-300 overflow-hidden flex flex-col border border-gray-100"
    //             >
    //               <div className="relative h-48 overflow-hidden">
    //                 <img
    //                   src={car.img}
    //                   alt={car.name}
    //                   className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
    //                 />
    //                 <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
    //                 <span className="absolute top-3 left-3 bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow">
    //                   {car.category}
    //                 </span>
    //               </div>

    //               <div className="p-5 flex flex-col flex-1">
    //                 <h2 className="text-lg font-bold text-gray-800 mb-1 group-hover:text-blue-600 transition-colors">
    //                   {car.name}
    //                 </h2>
    //                 <p className="text-sm text-gray-400 line-clamp-2 mb-4">
    //                   {car.desc}
    //                 </p>

    //                 <div className="border-t border-dashed border-gray-200 mb-4" />

    //                 <div className="bg-blue-50 rounded-2xl p-3 mb-4">
    //                   <label className="text-xs font-semibold text-gray-500 mb-2 block">
    //                     🗓 Necha kun ijaraga olasiz?
    //                   </label>
    //                   <div className="flex items-center gap-2">
    //                     <button
    //                       onClick={() =>
    //                         setDays((prev) => ({
    //                           ...prev,
    //                           [car.id]: Math.max(1, (prev[car.id] ?? 1) - 1),
    //                         }))
    //                       }
    //                       className="w-8 h-8 rounded-xl bg-white border border-gray-200 text-gray-600 font-bold hover:bg-red-50 hover:border-red-300 hover:text-red-500 transition flex items-center justify-center text-lg"
    //                     >
    //                       −
    //                     </button>
    //                     <input
    //                       type="number"
    //                       min={1}
    //                       value={carDays}
    //                       onChange={(e) =>
    //                         setDays((prev) => ({
    //                           ...prev,
    //                           [car.id]: Math.max(1, Number(e.target.value)),
    //                         }))
    //                       }
    //                       className="flex-1 text-center bg-white border border-gray-200 rounded-xl py-1.5 text-sm font-bold text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
    //                     />
    //                     <button
    //                       onClick={() =>
    //                         setDays((prev) => ({
    //                           ...prev,
    //                           [car.id]: (prev[car.id] ?? 1) + 1,
    //                         }))
    //                       }
    //                       className="w-8 h-8 rounded-xl bg-white border border-gray-200 text-gray-600 font-bold hover:bg-green-50 hover:border-green-300 hover:text-green-500 transition flex items-center justify-center text-lg"
    //                     >
    //                       +
    //                     </button>
    //                   </div>
    //                 </div>

    //                 <div className="flex items-center justify-between mb-4">
    //                   <p className="text-xs text-gray-400">
    //                     ${car.price?.toLocaleString()} × {carDays} kun
    //                   </p>
    //                   <p className="text-blue-600 text-xl font-extrabold">
    //                     ${totalPrice.toLocaleString()}
    //                   </p>
    //                 </div>

    //                 <button
    //                   onClick={() => handleBook(car)}
    //                   disabled={loading[car.id] || booked[car.id]}
    //                   className={`w-full py-3 rounded-2xl text-sm font-semibold transition-all duration-200 active:scale-95 shadow-md
    //                     ${
    //                       booked[car.id]
    //                         ? "bg-green-500 text-white cursor-default"
    //                         : "bg-blue-600 hover:bg-blue-700 text-white shadow-blue-200"
    //                     }`}
    //                 >
    //                   {loading[car.id]
    //                     ? "⏳ Yuklanmoqda..."
    //                     : booked[car.id]
    //                       ? "✅ Buyurtma berildi!"
    //                       : "🚘 Ijaraga olish"}
    //                 </button>
    //               </div>
    //             </div>
    //           );
    //         })}
    //       </div>
    //     )}
    //   </div>
    // </div>
  );
  
};
const S: Record<string, React.CSSProperties> = {
  page: {
    minHeight: "100vh",
    background: "linear-gradient(160deg, #07070f 0%, #0d0d1f 60%, #07070f 100%)",
    padding: "48px 20px",
    fontFamily: "'DM Sans', 'Segoe UI', sans-serif",
    color: "#fff",
  },
  container: {
    maxWidth: 1300,
    margin: "0 auto",
  },
  header: {
    marginBottom: 40,
    position: "relative",
    display: "inline-block",
  },
  title: {
    fontSize: 32,
    fontWeight: 300,
    letterSpacing: -0.5,
    margin: 0,
    color: "#fff",
  },
  subtitle: {
    fontSize: 13,
    color: "rgba(255,255,255,0.3)",
    marginTop: 6,
    letterSpacing: 0.5,
  },
  titleAccent: {
    position: "absolute",
    bottom: -8,
    left: 0,
    width: 48,
    height: 2,
    background: "linear-gradient(90deg, #3b82f6, #6366f1)",
    borderRadius: 2,
  },
  empty: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    paddingTop: 100,
    gap: 12,
  },
  emptyIcon: { fontSize: 72, filter: "grayscale(1) opacity(0.25)" },
  emptyTitle: { fontSize: 20, fontWeight: 500, color: "rgba(255,255,255,0.25)", margin: 0 },
  emptyText: { fontSize: 13, color: "rgba(255,255,255,0.15)", margin: 0 },

  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(290px, 1fr))",
    gap: 24,
  },

  // Card base & hover (applied via JS)
  card: {
    background: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(255,255,255,0.07)",
    borderRadius: 22,
    overflow: "hidden",
    display: "flex",
    flexDirection: "column",
    transition: "all 0.3s ease",
  },
  cardBaseStyle: {
    background: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(255,255,255,0.07)",
    transform: "translateY(0px)",
    boxShadow: "none",
  },
  cardHoverStyle: {
    background: "rgba(255,255,255,0.07)",
    border: "1px solid rgba(99,130,246,0.3)",
    transform: "translateY(-5px)",
    boxShadow: "0 24px 64px rgba(0,0,0,0.5), 0 0 40px rgba(59,130,246,0.08)",
  },

  imgBox: {
    position: "relative",
    aspectRatio: "16/9",
    overflow: "hidden",
  },
  img: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    display: "block",
    transition: "transform 0.5s ease",
  },
  imgGradient: {
    position: "absolute",
    inset: 0,
    background: "linear-gradient(to top, rgba(7,7,15,0.85) 0%, transparent 55%)",
  },
  badge: {
    position: "absolute",
    top: 12,
    left: 12,
    background: "rgba(59,130,246,0.8)",
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
    top: 12,
    right: 12,
    background: "rgba(16,185,129,0.85)",
    backdropFilter: "blur(10px)",
    color: "#fff",
    fontSize: 10,
    fontWeight: 700,
    padding: "4px 12px",
    borderRadius: 50,
    letterSpacing: 0.5,
  },

  body: {
    padding: "20px",
    display: "flex",
    flexDirection: "column",
    flex: 1,
    gap: 10,
  },
  carName: {
    fontSize: 16,
    fontWeight: 400,
    color: "#f0f0ff",
    margin: 0,
    letterSpacing: 0.2,
  },
  carDesc: {
    fontSize: 12,
    color: "rgba(255,255,255,0.3)",
    lineHeight: 1.65,
    margin: 0,
    display: "-webkit-box",
    WebkitLineClamp: 2,
    WebkitBoxOrient: "vertical",
    overflow: "hidden",
  },
  divider: {
    height: 1,
    background: "rgba(255,255,255,0.06)",
    margin: "4px 0",
  },

  pickerBox: {
    background: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(255,255,255,0.07)",
    borderRadius: 14,
    padding: "12px 14px",
  },
  pickerLabel: {
    fontSize: 11,
    color: "rgba(255,255,255,0.35)",
    display: "block",
    marginBottom: 10,
    letterSpacing: 0.5,
  },
  pickerRow: {
    display: "flex",
    alignItems: "center",
    gap: 8,
  },
  pickerBtn: {
    width: 34,
    height: 34,
    borderRadius: 10,
    border: "1px solid rgba(255,255,255,0.1)",
    background: "rgba(255,255,255,0.06)",
    color: "#fff",
    fontSize: 18,
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontFamily: "inherit",
    transition: "all 0.15s",
    flexShrink: 0,
  },
  pickerInput: {
    flex: 1,
    textAlign: "center",
    background: "rgba(255,255,255,0.08)",
    border: "1px solid rgba(255,255,255,0.1)",
    borderRadius: 10,
    padding: "6px",
    color: "#fff",
    fontSize: 15,
    fontWeight: 700,
    outline: "none",
    fontFamily: "inherit",
  },

  priceRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "8px 0",
  },
  priceSmall: {
    fontSize: 12,
    color: "rgba(255,255,255,0.3)",
  },
  priceBig: {
    fontSize: 24,
    fontWeight: 700,
    color: "#60a5fa",
    letterSpacing: -0.5,
  },

  btn: {
    width: "100%",
    padding: "13px",
    borderRadius: 14,
    border: "none",
    fontSize: 14,
    fontWeight: 600,
    cursor: "pointer",
    fontFamily: "'DM Sans', sans-serif",
    transition: "all 0.2s",
    letterSpacing: 0.3,
    marginTop: 4,
  },
  btnNormal: {
    background: "linear-gradient(135deg, #3b82f6 0%, #6366f1 100%)",
    color: "#fff",
    boxShadow: "0 4px 20px rgba(99,102,241,0.3)",
  },
  btnBooked: {
    background: "rgba(16,185,129,0.15)",
    border: "1px solid rgba(16,185,129,0.3)",
    color: "#34d399",
    cursor: "default",
  },
  btnLoading: {
    background: "rgba(255,255,255,0.05)",
    color: "rgba(255,255,255,0.4)",
    cursor: "not-allowed",
  },
};

export default Book;