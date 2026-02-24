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
    getProducts();
  }, []);

  function getProducts() {
    const carsCollection = collection(db, "cars");
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
    <div className="min-h-screen bg-gray-50 px-4 py-10">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">
            🚘 Mavjud mashinalar
          </h1>
          <p className="text-gray-400 mt-1 text-sm">
            {filteredCars.length} ta mashina topildi
          </p>
        </div>

        {filteredCars.length === 0 ? (
          <div className="flex flex-col items-center justify-center mt-32 text-gray-400">
            <span className="text-8xl mb-4">🚗</span>
            <h4 className="text-2xl font-bold text-gray-500">No cars found</h4>
            <p className="text-sm mt-2">Try a different search keyword</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredCars.map((car) => {
              const carDays = days[car.id] ?? 1;
              const totalPrice = (car.price ?? 0) * carDays;

              return (
                <div
                  key={car.id}
                  className="group bg-white rounded-3xl shadow-md hover:shadow-2xl transition-all duration-300 overflow-hidden flex flex-col border border-gray-100"
                >
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={car.img}
                      alt={car.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                    <span className="absolute top-3 left-3 bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow">
                      {car.category}
                    </span>
                  </div>

                  <div className="p-5 flex flex-col flex-1">
                    <h2 className="text-lg font-bold text-gray-800 mb-1 group-hover:text-blue-600 transition-colors">
                      {car.name}
                    </h2>
                    <p className="text-sm text-gray-400 line-clamp-2 mb-4">
                      {car.desc}
                    </p>

                    <div className="border-t border-dashed border-gray-200 mb-4" />

                    <div className="bg-blue-50 rounded-2xl p-3 mb-4">
                      <label className="text-xs font-semibold text-gray-500 mb-2 block">
                        🗓 Necha kun ijaraga olasiz?
                      </label>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() =>
                            setDays((prev) => ({
                              ...prev,
                              [car.id]: Math.max(1, (prev[car.id] ?? 1) - 1),
                            }))
                          }
                          className="w-8 h-8 rounded-xl bg-white border border-gray-200 text-gray-600 font-bold hover:bg-red-50 hover:border-red-300 hover:text-red-500 transition flex items-center justify-center text-lg"
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
                          className="flex-1 text-center bg-white border border-gray-200 rounded-xl py-1.5 text-sm font-bold text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
                        />
                        <button
                          onClick={() =>
                            setDays((prev) => ({
                              ...prev,
                              [car.id]: (prev[car.id] ?? 1) + 1,
                            }))
                          }
                          className="w-8 h-8 rounded-xl bg-white border border-gray-200 text-gray-600 font-bold hover:bg-green-50 hover:border-green-300 hover:text-green-500 transition flex items-center justify-center text-lg"
                        >
                          +
                        </button>
                      </div>
                    </div>

                    <div className="flex items-center justify-between mb-4">
                      <p className="text-xs text-gray-400">
                        ${car.price?.toLocaleString()} × {carDays} kun
                      </p>
                      <p className="text-blue-600 text-xl font-extrabold">
                        ${totalPrice.toLocaleString()}
                      </p>
                    </div>

                    <button
                      onClick={() => handleBook(car)}
                      disabled={loading[car.id] || booked[car.id]}
                      className={`w-full py-3 rounded-2xl text-sm font-semibold transition-all duration-200 active:scale-95 shadow-md
                        ${
                          booked[car.id]
                            ? "bg-green-500 text-white cursor-default"
                            : "bg-blue-600 hover:bg-blue-700 text-white shadow-blue-200"
                        }`}
                    >
                      {loading[car.id]
                        ? "⏳ Yuklanmoqda..."
                        : booked[car.id]
                          ? "✅ Buyurtma berildi!"
                          : "🚘 Ijaraga olish"}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Book;