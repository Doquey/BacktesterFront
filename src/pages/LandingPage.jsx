import React, { useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  BarChart,
  Bar,
} from "recharts";

const LandingPage = () => {
  const [formData, setFormData] = useState({
    method: "",
    years: "",
    stockInput: "",
    stocks: [],
    initial_investiment: 0,
  });

  const [montanteFinal, setMontanteFinal] = useState(null);
  const [portifolioReturns, setPortifolioReturns] = useState([]);
  const [stockData, setStockData] = useState([]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleStockAdd = (e) => {
    e.preventDefault();
    if (formData.stockInput.trim() === "") return;

    setFormData((prevState) => ({
      ...prevState,
      stocks: [...prevState.stocks, prevState.stockInput.trim()],
      stockInput: "",
    }));
  };

  const handleStockRemove = (indexToRemove) => {
    setFormData((prevState) => ({
      ...prevState,
      stocks: prevState.stocks.filter((_, index) => index !== indexToRemove),
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const dataToSend = {
      method: formData.method,
      years: parseInt(formData.years, 10),
      stocks: formData.stocks,
      initial_investiment: parseFloat(formData.initial_investiment),
    };

    fetch("https://backend-tester-4wzc.onrender.com/start_test/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(dataToSend),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        setMontanteFinal(data.montante_final);
        setPortifolioReturns(data.portifolio_returns);
        setStockData(data.return_per_stock);
      })
      .catch((error) => {
        console.error(
          "There has been a problem with your fetch operation:",
          error
        );
      });
  };

  const round = (value, decimals) => {
    return Number(Math.round(value + "e" + decimals) + "e-" + decimals);
  };

  const chartData = portifolioReturns.map((value, index) => ({
    name: index + 1,
    value: round(value, 2),
  }));

  const barChartData = Object.entries(stockData).map(([key, value]) => ({
    name: key,
    value: round(value, 2),
  }));

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-500 to-purple-600 flex flex-col items-center py-10 px-4 sm:px-6 lg:px-8">
      <h1 className="text-5xl font-extrabold text-white mb-4 animate-bounce text-center">
        Bem vindo ao <span className="text-yellow-400">BRBT</span>
      </h1>
      <p className="text-lg text-gray-200 max-w-2xl mx-auto mb-8 text-center">
        Utilize nossa plataforma para testar diferentes estratégias de
        investimento, e obtenha insights valiosos sobre o desempenho histórico
        de suas carteiras.
      </p>
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md bg-white p-6 rounded-lg shadow-lg"
      >
        <div className="mb-4">
          <input
            type="text"
            placeholder="Method"
            name="method"
            value={formData.method}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="mb-4">
          <input
            type="number"
            placeholder="Years"
            name="years"
            value={formData.years}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="mb-4">
          <input
            type="number"
            placeholder="Initial Investment"
            name="initial_investiment"
            value={formData.initial_investiment}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="mb-4 flex">
          <input
            type="text"
            placeholder="Enter a stock ticker"
            name="stockInput"
            value={formData.stockInput}
            onChange={handleChange}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleStockAdd(e);
            }}
            className="flex-grow px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="button"
            onClick={handleStockAdd}
            className="ml-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
          >
            Add
          </button>
        </div>
        <div className="mb-4">
          <button
            type="submit"
            className="w-full px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            Submit
          </button>
        </div>
      </form>
      <ul className="mt-10 space-y-2 w-full max-w-md">
        {formData.stocks.map((stock, index) => (
          <li
            key={index}
            className="px-4 py-2 bg-white rounded-lg shadow-md flex justify-between items-center"
          >
            {stock}
            <button
              onClick={() => handleStockRemove(index)}
              className="ml-2 px-2 py-1 bg-red-500 text-white rounded-lg hover:bg-red-600"
            >
              &times;
            </button>
          </li>
        ))}
      </ul>
      {montanteFinal !== null && (
        <div className="mt-10 w-full max-w-4xl bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold mb-4">
            Montante total : {round(montanteFinal, 2)}
          </h2>
          <div className="overflow-x-auto">
            <LineChart
              width={800}
              height={400}
              data={chartData}
              margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="value"
                stroke="#8884d8"
                activeDot={{ r: 8 }}
              />
            </LineChart>
          </div>
        </div>
      )}
      {montanteFinal !== null && (
        <div className="mt-10 w-full max-w-4xl bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold mb-4">Retorno por ação</h2>
          <div className="overflow-x-auto">
            <BarChart
              width={800}
              height={400}
              data={barChartData}
              margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="value" fill="#82ca9d" />
            </BarChart>
          </div>
        </div>
      )}
    </div>
  );
};

export default LandingPage;
