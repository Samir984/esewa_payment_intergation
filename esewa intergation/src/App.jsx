import { useEffect } from "react";
import {
  BrowserRouter,
  Route,
  Routes,
  useSearchParams,
} from "react-router-dom";

const handlePayment = async () => {
  try {
    const response = await fetch("http://localhost:5505/order", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();
    console.log(data);
    if (data.status === "success") {
      const form = document.createElement("form");
      form.action = "https://rc-epay.esewa.com.np/api/epay/main/v2/form";
      form.method = "POST";
      console.log(data.data);

      Object.entries(data.data).forEach(([key, value]) => {
        const input = document.createElement("input");
        input.type = "hidden";
        input.name = key;
        input.value = value;
        form.appendChild(input);
      });

      document.body.appendChild(form);
      form.submit();
    }
  } catch (error) {
    console.error("Payment error:", error);
  }
};

export function Home() {
  return (
    <div className="flex min-h-screen justify-center items-center">
      <button
        className="rounded-lg px-3 py-1 bg-blue-600 text-white hover:bg-blue-700"
        onClick={handlePayment}
      >
        Pay
      </button>
    </div>
  );
}

export function Success() {
  const [searchParam] = useSearchParams();
  const data = searchParam.get("data");
  console.log(data);
  useEffect(() => {
    async function update() {
      const response = await fetch(
        `http://localhost:5505/success?data=${data}`
      );
      const resondData = await response.json();
      console.log(resondData);
    }
    update();
  }, [data]);

  return (
    <div className="mt-12 p-4">
      <h1 className=" font-bold text-4xl w-fit mx-auto">
        Payment is success full remove
      </h1>
    </div>
  );
}
const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route index element={<Home />} />
        <Route path="/success" element={<Success />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
