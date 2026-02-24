import { addDoc, collection, getDocs } from "firebase/firestore";
import { auth, db } from "../firebase.config";
import type { Car } from "./Home";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

interface Props {
  search: string;
}

const Cars = ({ search }: Props) => {
  useEffect(() => {
    getProducts();
  }, []);
  const navigate = useNavigate()
  const [cars, setCars] = useState<Car[]>([]);
  function getProducts() {
    const cars = collection(db, "cars");
    getDocs(cars).then((res) => {
      const arr = res.docs.map((itm) => {
        return { ...(itm.data() as Car), id: itm.id };
      });
      setCars(arr);
    });
  }
   async function addtobook(i: number) {
     const car = cars[i];

     // User ID olish
     let userId: string | null = null;

     // Admin tekshirish
     const localUser = localStorage.getItem("user");
     if (localUser) {
       const userData = JSON.parse(localUser);
       if (userData.email === "azizbeknarzullayevo1o@gmail.com") {
         userId = "admin";
       }
     }

     if (!userId && auth.currentUser) {
       userId = auth.currentUser.uid;
     }

     if (!userId) {
       alert("⚠️ Avval tizimga kiring!");
       navigate("/signup");
     }

     try {
       const booking = collection(db, "bookings");
       await addDoc(booking, {
         userId: userId,
         carId: car.id,
         name: car.name,
         price: car.price,
         img: car.img,
         category: car.category,
         desc: car.desc,
         quantity: 1,
         addedAt: new Date().toISOString(),
       });

       alert(`✅ ${car.name} savatga qo'shildi!`);
     } catch (error) {
       console.error("❌ Xatolik:", error);
     }
     navigate("/bookings");
   }

  const filteredCars = cars.filter((car) =>
    car.name?.toLowerCase().includes(search.toLowerCase()),
  );
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {filteredCars.length === 0 ? (
        <div className="flex flex-col items-center justify-center mt-20 text-gray-400">
          <span className="text-8xl mb-4">🚗</span>
          <h4 className="text-2xl font-bold text-gray-500">No cars found</h4>
          <p className="text-sm mt-2 text-gray-400">
            Try a different search keyword
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredCars.map((car,i) => (
            <div
              key={car.id}
              className="group bg-white rounded-3xl shadow-md hover:shadow-2xl transition-all duration-300 overflow-hidden flex flex-col border border-gray-100"
            >
              <div className="relative overflow-hidden h-52">
                <img
                  src={car.img}
                  alt={car.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <span className="absolute top-3 left-3 bg-blue-600 text-white text-xs font-semibold px-3 py-1 rounded-full shadow">
                  {car.category}
                </span>
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
              </div>

              <div className="p-5 flex flex-col flex-1">
                <h2 className="text-lg font-bold text-gray-800 mb-2 group-hover:text-blue-600 transition-colors duration-200">
                  {car.name}
                </h2>

                <p className="text-sm text-gray-500 leading-relaxed line-clamp-2 mb-4">
                  {car.desc}
                </p>

                <div className="border-t border-dashed border-gray-200 my-3" />

                <div className="mt-auto">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <p className="text-xs text-gray-400 mb-0.5">Narxi</p>
                      <p className="text-blue-600 text-2xl font-extrabold">
                        ${car.price?.toLocaleString()}
                        <span className="text-sm font-medium text-gray-400 ml-1">
                          / kun
                        </span>
                      </p>
                    </div>
                    <div className="flex gap-0.5 text-yellow-400 text-sm">
                      {"★★★★☆"}
                    </div>
                  </div>

                  <button className="w-full bg-blue-600 hover:bg-blue-700 active:scale-95 text-white text-sm font-semibold py-3 rounded-2xl transition-all duration-200 flex items-center justify-center gap-2 shadow-md shadow-blue-200" onClick={() =>addtobook(i)}>
                    🚘 Ijaraga Olish
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Cars;
