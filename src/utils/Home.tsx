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
  desc: string;
  price: number;
}
const Home = ({ search }: Props) => {
  const [imagePreview, setImagePreview] = useState<string>("");
  const [open, setOpen] = useState(false);
  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [car, setCar] = useState<Car>({
    id: "",
    img: "",
    name: "",
    category: "",
    quantity: 0,
    desc: "",
    price: 0,
  });
  const getCars = async () => {
    setLoading(true);
    const snapshot = await getDocs(collection(db, "cars"));
    const data = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Car[];
    setCars(data);
    setLoading(false);
  };

  useEffect(() => {
    getCars();
  }, []);
  const addproduct = () => {
    addDoc(collection(db, "cars"), {
      img: car.img,
      name: car.name,
      price: car.price,
      quantity: car.quantity,
      desc: car.desc,
      category: car.category,
    });

    alert("Mahsulot muvaffaqiyatli qo'shildi!");

    setCar({
      id: "",
      img: "",
      name: "",
      price: 0,
      quantity: 0,
      desc: "",
      category: "",
    });
    setOpen(false);
    navigate("/");
    getCars();
  };

  return (
    <div className="p-4 md:p-6">
      <button
        className="w-full sm:w-auto bg-blue-500 hover:bg-blue-600 text-white font-semibold px-5 py-2.5 rounded-lg text-sm"
        onClick={() => setOpen(true)}
      >
        + Mahsulot qo'shish
      </button>

      {open && (
        <div
          className="fixed inset-0 bg-black/50 flex items-end sm:items-center justify-center z-50 p-0 sm:px-4"
          onClick={() => setOpen(false)}
        >
          <div
            className="bg-white w-full sm:max-w-md rounded-t-3xl sm:rounded-2xl p-5 sm:p-6 max-h-[95vh] sm:max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-10 h-1 bg-gray-200 rounded-full mx-auto mb-4 sm:hidden" />

            <div className="flex justify-between items-center mb-4">
              <h2 className="text-base sm:text-lg font-bold">Yangi Mahsulot</h2>
              <button
                className="text-gray-400 hover:text-gray-600 text-xl hidden sm:block"
                onClick={() => setOpen(false)}
              >
                ✕
              </button>
            </div>

            <div className="flex flex-col gap-3">
              <input
                type="file"
                accept="image/*"
                className="form-control mb-3"
                required
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    const reader = new FileReader();
                    reader.readAsDataURL(file);
                    reader.onload = () => {
                      const result = reader.result as string;
                      setCar((prev) => ({ ...prev, img: result }));
                      setImagePreview(result);
                    };
                  }
                }}
              />

              {imagePreview && (
                <div className="mb-3 text-center">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-[140px] h-[140px] sm:w-[200px] sm:h-[200px] object-cover mx-auto rounded-lg"
                  />
                </div>
              )}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input
                  className="border border-gray-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-blue-400 w-full"
                  placeholder="Nomi *"
                  value={car.name}
                  onChange={(e) => setCar({ ...car, name: e.target.value })}
                />
                <input
                  className="border border-gray-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-blue-400 w-full"
                  placeholder="Kategoriya"
                  value={car.category}
                  onChange={(e) => setCar({ ...car, category: e.target.value })}
                />
                <input
                  className="border border-gray-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-blue-400 w-full"
                  placeholder="Narxi ($)"
                  type="number"
                  value={car.price || ""}
                  onChange={(e) =>
                    setCar({ ...car, price: Number(e.target.value) })
                  }
                />
                <select
                  value={car.category}
                  onChange={(e) =>
                    setCar({ ...car, category: e.target.value })
                  }
                  className="form-control mb-4 h-[50px]"
                >
                  <option value="" disabled>
                    Kategoriya
                  </option>
                  <option value="economy">Economy</option>
                  <option value="standart">Standart</option>
                  <option value="electro">Elektromobil</option>
                  <option value="luxury">Luxury</option>
                </select>
              </div>

              <textarea
                className="border border-gray-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-blue-400 w-full h-20 resize-none"
                placeholder="Tavsif"
                value={car.desc}
                onChange={(e) => setCar({ ...car, desc: e.target.value })}
              />

              <div className="flex flex-col sm:flex-row gap-2 mt-1">
                <button
                  className="w-full sm:flex-1 py-2.5 border border-gray-200 rounded-lg text-sm font-medium text-gray-500 hover:bg-gray-50"
                  onClick={() => setOpen(false)}
                >
                  Bekor qilish
                </button>
                <button
                  className="w-full sm:flex-1 py-2.5 bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-sm font-semibold"
                  onClick={addproduct}
                >
                  Saqlash
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
