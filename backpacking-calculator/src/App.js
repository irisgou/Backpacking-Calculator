import React, { useState } from "react";
import { Switch } from "@headlessui/react";
import {
  CheckCircleIcon,
  ExclamationCircleIcon,
} from "@heroicons/react/24/solid";
// import WebSocketComponent from "./WebSocketComponent";

const terrainOptions = [
  { label: "Slippery Terrain", value: "Slippery Terrain" },
  { label: "Vegetation", value: "Vegetation" }, // Will calculate based on speed
  { label: "Swamp", value: "Swamp" },
  { label: "Paved Road", value: "Paved Road" },
  { label: "Gravel Road", value: "Gravel Road" },
  { label: "Dirt Road", value: "Dirt Road" },
  { label: "Sand", value: "Sand" }, // Will calculate based on speed
];

function App() {
  const [weight, setWeight] = useState("");
  const [isWeightKg, setIsWeightKg] = useState(true);

  const [pack_weight, setPackWeight] = useState("");
  const [isPackWeightKg, setIsPackWeightKg] = useState(true);

  const [speed, setSpeed] = useState("");
  const [isSpeedMps, setIsSpeedMps] = useState(true);

  const [incline_grade, setGrade] = useState("");
  const [terrain, setTerrain] = useState("");
  const [hours, setHours] = useState("");

  const [caloriesPerHour, setCaloriesPerHour] = useState(null);
  const [totalCalories, setTotalCalories] = useState(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleCalculate = async (e) => {
    e.preventDefault();
    setError("");
    setCaloriesPerHour(null);
    setTotalCalories(null);

    // Input validation
    if (
      !weight ||
      !pack_weight ||
      !speed ||
      !incline_grade ||
      !terrain ||
      !hours
    ) {
      setError("Please fill in all fields.");
      return;
    }

    const parsedWeight = parseFloat(weight);
    const parsedPackWeight = parseFloat(pack_weight);
    const parsedSpeed = parseFloat(speed);
    const parsedGrade = parseFloat(incline_grade);
    const parsedHours = parseFloat(hours);

    if (
      isNaN(parsedWeight) ||
      isNaN(parsedPackWeight) ||
      isNaN(parsedSpeed) ||
      isNaN(parsedGrade) ||
      isNaN(parsedHours)
    ) {
      setError("Please enter valid numeric values.");
      return;
    }

    setLoading(true);

    // Prepare data
    const data = {
      weight: parsedWeight,
      isWeightKg,
      pack_weight: parsedPackWeight,
      isPackWeightKg,
      speed: parsedSpeed,
      isSpeedMps,
      incline_grade: parsedGrade,
      terrain_type: terrain,
      hours: parsedHours,
    };

    try {
      const response = await fetch("http://127.0.0.1:8080/calculate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("Failed to fetch results. Please try again.");
      }

      const result = await response.json();

      // Update state with the result
      setCaloriesPerHour(result.calories_per_hour);
      setTotalCalories(result.calories_per_hour * parsedHours);
    } catch (err) {
      setError(err.message || "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-lg w-full mx-auto">
        <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">
          Backpacking Calorie Burn Calculator
        </h1>
        <h2>
          Based on{" "}
          <a
            href="https://journals.physiology.org/doi/abs/10.1152/jappl.1977.43.4.577"
            target="_blank"
            rel="noopener noreferrer"
          >
            Pandolf, K. B., Givoni, B., & Goldman, R. F. (1977)
          </a>
        </h2>

        {/* <WebSocketComponent /> */}

        <form onSubmit={handleCalculate} className="space-y-6">
          {/* Weight Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Body Weight
            </label>
            <div className="flex">
              <input
                type="number"
                step="any"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                className="flex-1 border border-gray-300 rounded-l-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                placeholder={`Enter weight in ${isWeightKg ? "kg" : "lbs"}`}
                required
              />
              <Switch
                checked={isWeightKg}
                onChange={setIsWeightKg}
                className={`$ bg-gray-200
                  //{
                  // isWeightKg ? "bg-blue-600" : "bg-gray-200" } 
                
                relative inline-flex items-center h-10 rounded-r-md w-24 transition-colors focus:outline-none`}
              >
                <span
                  className={`${
                    isWeightKg ? "translate-x-0" : "translate-x-12"
                  } inline-block w-12 h-8 transform bg-white rounded-md shadow-md transition-transform`}
                />
                <span className="absolute left-2 text-sm font-medium text-gray-700">
                  kg
                </span>
                <span className="absolute right-2 text-sm font-medium text-gray-700">
                  lbs
                </span>
              </Switch>
            </div>
          </div>

          {/* Pack Weight Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Pack Weight
            </label>
            <div className="flex">
              <input
                type="number"
                step="any"
                value={pack_weight}
                onChange={(e) => setPackWeight(e.target.value)}
                className="flex-1 border border-gray-300 rounded-l-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                placeholder={`Enter pack weight in ${
                  isPackWeightKg ? "kg" : "lbs"
                }`}
                required
              />
              <Switch
                checked={isPackWeightKg}
                onChange={setIsPackWeightKg}
                className={`$  bg-gray-200
                  
                //   {
                //   isPackWeightKg ? "bg-blue-600" : "bg-gray-200"
                // } 
                  relative inline-flex items-center h-10 rounded-r-md w-24 transition-colors focus:outline-none`}
              >
                <span
                  className={`${
                    isPackWeightKg ? "translate-x-0" : "translate-x-12"
                  } inline-block w-12 h-8 transform bg-white rounded-md shadow-md transition-transform`}
                />
                <span className="absolute left-2 text-sm font-medium text-gray-700">
                  kg
                </span>
                <span className="absolute right-2 text-sm font-medium text-gray-700">
                  lbs
                </span>
              </Switch>
            </div>
          </div>

          {/* Speed Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Hiking Speed
            </label>
            <div className="flex">
              <input
                type="number"
                step="any"
                value={speed}
                onChange={(e) => setSpeed(e.target.value)}
                className="flex-1 border border-gray-300 rounded-l-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                placeholder={`Enter speed in ${isSpeedMps ? "m/s" : "mph"}`}
                required
              />
              <Switch
                checked={isSpeedMps}
                onChange={setIsSpeedMps}
                className={`$ bg-gray-200
                //   {
                //   isSpeedMps ? "bg-blue-600" : "bg-gray-200"
                // } 
                  relative inline-flex items-center h-10 rounded-r-md w-24 transition-colors focus:outline-none`}
              >
                <span
                  className={`${
                    isSpeedMps ? "translate-x-0" : "translate-x-12"
                  } inline-block w-12 h-8 transform bg-white rounded-md shadow-md transition-transform`}
                />
                <span className="absolute left-2 text-sm font-medium text-gray-700">
                  m/s
                </span>
                <span className="absolute right-2 text-sm font-medium text-gray-700">
                  mph
                </span>
              </Switch>
            </div>
          </div>

          {/* Grade Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Grade of Incline (%)
            </label>
            <input
              type="number"
              step="any"
              value={incline_grade}
              onChange={(e) => setGrade(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter incline grade percentage"
              required
            />
          </div>

          {/* Terrain Factor Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Terrain Type
            </label>
            <select
              value={terrain}
              onChange={(e) => setTerrain(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
              required
            >
              <option value="" disabled>
                Select terrain type
              </option>
              {terrainOptions.map((option) => (
                <option key={option.label} value={option.label}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {/* Hours Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Hours Spent Hiking
            </label>
            <input
              type="number"
              step="any"
              value={hours}
              onChange={(e) => setHours(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter number of hours"
              required
            />
          </div>

          {/* Submit Button */}
          <div>
            <button
              type="submit"
              className="w-full flex justify-center items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              disabled={loading}
            >
              {loading ? "Calculating..." : "Calculate"}
            </button>
          </div>

          {/* Error Message */}
          {error && (
            <div className="flex items-center text-red-600 text-sm mt-2">
              <ExclamationCircleIcon className="w-5 h-5 mr-1" />
              {error}
            </div>
          )}

          {/* Result Display */}
          {caloriesPerHour && totalCalories && (
            <div className="mt-6 p-4 bg-green-100 rounded-md">
              <div className="flex items-center text-green-700 mb-2">
                <CheckCircleIcon className="w-6 h-6 mr-2" />
                <h2 className="text-lg font-semibold">Results</h2>
              </div>
              <p className="text-gray-700">
                <span className="font-medium">Calories Burned Per Hour:</span>{" "}
                {caloriesPerHour} kcal
              </p>
              <p className="text-gray-700">
                <span className="font-medium">Total Calories Burned:</span>{" "}
                {totalCalories} kcal
              </p>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}

export default App;

// import React, { useState } from "react";
// import { Switch } from "@headlessui/react";
// import {
//   CheckCircleIcon,
//   ExclamationCircleIcon,
// } from "@heroicons/react/24/solid";
// import WebSocketComponent from "./WebSocketComponent";

// const terrainOptions = [
//   { label: "Slippery Terrain", value: 1.7 },
//   { label: "Vegetation", value: null }, // Will calculate based on speed
//   { label: "Swamp", value: 3.5 },
//   { label: "Paved Road", value: 1.0 },
//   { label: "Gravel Road", value: 1.0 },
//   { label: "Dirt Road", value: 1.2 },
//   { label: "Sand", value: null }, // Will calculate based on speed
// ];

// function App() {
//   const [weight, setWeight] = useState("");
//   const [isWeightKg, setIsWeightKg] = useState(true);

//   const [pack_weight, setPackWeight] = useState("");
//   const [isPackWeightKg, setIsPackWeightKg] = useState(true);

//   const [speed, setSpeed] = useState("");
//   const [isSpeedMps, setIsSpeedMps] = useState(true);

//   const [incline_grade, setGrade] = useState("");
//   const [terrain_factor, setTerrain] = useState("");
//   const [hours, setHours] = useState("");

//   const [caloriesPerHour, setCaloriesPerHour] = useState(null);
//   const [totalCalories, setTotalCalories] = useState(null);

//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");

//   const handleCalculate = async (e) => {
//     e.preventDefault();
//     setError("");
//     setCaloriesPerHour(null);
//     setTotalCalories(null);

//     // Input validation
//     if (
//       !weight ||
//       !pack_weight ||
//       !speed ||
//       !incline_grade ||
//       !terrain_factor ||
//       !hours
//     ) {
//       setError("Please fill in all fields.");
//       return;
//     }

//     const parsedWeight = parseFloat(weight);
//     const parsedPackWeight = parseFloat(pack_weight);
//     const parsedSpeed = parseFloat(speed);
//     const parsedGrade = parseFloat(incline_grade);
//     const parsedHours = parseFloat(hours);

//     if (
//       isNaN(parsedWeight) ||
//       isNaN(parsedPackWeight) ||
//       isNaN(parsedSpeed) ||
//       isNaN(parsedGrade) ||
//       isNaN(parsedHours)
//     ) {
//       setError("Please enter valid numeric values.");
//       return;
//     }

//     setLoading(true);

//     const terrainFactors = {
//       "Slippery Terrain": 1.7,
//       Vegetation: -1.0, // Handle this case separately if needed
//       Swamp: 3.5,
//       "Paved Road": 1.0,
//       "Gravel Road": 1.0,
//       "Dirt Road": 1.2,
//       Sand: -2.0, // Handle this case separately if needed
//     };

//     const terrain_factor = terrainFactors[terrain_factor];

//     // Prepare data
//     const data = {
//       weight: parsedWeight,
//       isWeightKg,
//       pack_weight: parsedPackWeight,
//       isPackWeightKg,
//       speed: parsedSpeed,
//       isSpeedMps,
//       incline_grade: parsedGrade,
//       terrain_factor,
//       hours: parsedHours,
//     };

//     try {
//       const response = await fetch("http://127.0.0.1:8080/calculate", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(data),
//       });

//       if (!response.ok) {
//         throw new Error("Failed to fetch results. Please try again.");
//       }

//       const result = await response.json();
//       setCaloriesPerHour(result.calories_per_hour.toFixed(2));
//       setTotalCalories(result.total_calories.toFixed(2));
//     } catch (err) {
//       setError(err.message || "An unexpected error occurred.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
//       <div className="bg-white rounded-lg shadow-lg p-8 max-w-lg w-full">
//         <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">
//           Backpacking Calorie Burn Calculator
//         </h1>

//         <WebSocketComponent />

//         <form onSubmit={handleCalculate} className="space-y-6">
//           {/* Weight Input */}
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">
//               Body Weight
//             </label>
//             <div className="flex">
//               <input
//                 type="number"
//                 step="any"
//                 value={weight}
//                 onChange={(e) => setWeight(e.target.value)}
//                 className="flex-1 border border-gray-300 rounded-l-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
//                 placeholder={`Enter weight in ${isWeightKg ? "kg" : "lbs"}`}
//                 required
//               />
//               <Switch
//                 checked={isWeightKg}
//                 onChange={setIsWeightKg}
//                 className={`${
//                   isWeightKg ? "bg-blue-600" : "bg-gray-200"
//                 } relative inline-flex items-center h-10 rounded-r-md w-24 transition-colors focus:outline-none`}
//               >
//                 <span
//                   className={`${
//                     isWeightKg ? "translate-x-0" : "translate-x-12"
//                   } inline-block w-12 h-8 transform bg-white rounded-md shadow-md transition-transform`}
//                 />
//                 <span className="absolute left-2 text-sm font-medium text-gray-700">
//                   kg
//                 </span>
//                 <span className="absolute right-2 text-sm font-medium text-gray-700">
//                   lbs
//                 </span>
//               </Switch>
//             </div>
//           </div>

//           {/* Pack Weight Input */}
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">
//               Pack Weight
//             </label>
//             <div className="flex">
//               <input
//                 type="number"
//                 step="any"
//                 value={pack_weight}
//                 onChange={(e) => setPackWeight(e.target.value)}
//                 className="flex-1 border border-gray-300 rounded-l-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
//                 placeholder={`Enter pack weight in ${
//                   isPackWeightKg ? "kg" : "lbs"
//                 }`}
//                 required
//               />
//               <Switch
//                 checked={isPackWeightKg}
//                 onChange={setIsPackWeightKg}
//                 className={`${
//                   isPackWeightKg ? "bg-blue-600" : "bg-gray-200"
//                 } relative inline-flex items-center h-10 rounded-r-md w-24 transition-colors focus:outline-none`}
//               >
//                 <span
//                   className={`${
//                     isPackWeightKg ? "translate-x-0" : "translate-x-12"
//                   } inline-block w-12 h-8 transform bg-white rounded-md shadow-md transition-transform`}
//                 />
//                 <span className="absolute left-2 text-sm font-medium text-gray-700">
//                   kg
//                 </span>
//                 <span className="absolute right-2 text-sm font-medium text-gray-700">
//                   lbs
//                 </span>
//               </Switch>
//             </div>
//           </div>

//           {/* Speed Input */}
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">
//               Hiking Speed
//             </label>
//             <div className="flex">
//               <input
//                 type="number"
//                 step="any"
//                 value={speed}
//                 onChange={(e) => setSpeed(e.target.value)}
//                 className="flex-1 border border-gray-300 rounded-l-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
//                 placeholder={`Enter speed in ${isSpeedMps ? "m/s" : "mph"}`}
//                 required
//               />
//               <Switch
//                 checked={isSpeedMps}
//                 onChange={setIsSpeedMps}
//                 className={`${
//                   isSpeedMps ? "bg-blue-600" : "bg-gray-200"
//                 } relative inline-flex items-center h-10 rounded-r-md w-24 transition-colors focus:outline-none`}
//               >
//                 <span
//                   className={`${
//                     isSpeedMps ? "translate-x-0" : "translate-x-12"
//                   } inline-block w-12 h-8 transform bg-white rounded-md shadow-md transition-transform`}
//                 />
//                 <span className="absolute left-2 text-sm font-medium text-gray-700">
//                   m/s
//                 </span>
//                 <span className="absolute right-2 text-sm font-medium text-gray-700">
//                   mph
//                 </span>
//               </Switch>
//             </div>
//           </div>

//           {/* Grade Input */}
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">
//               Grade of Incline (%)
//             </label>
//             <input
//               type="number"
//               step="any"
//               value={incline_grade}
//               onChange={(e) => setGrade(e.target.value)}
//               className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
//               placeholder="Enter incline grade percentage"
//               required
//             />
//           </div>

//           {/* Terrain Factor Input */}
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">
//               Terrain Type
//             </label>
//             <select
//               value={terrain_factor}
//               onChange={(e) => setTerrain(e.target.value)}
//               className="w-full border border-gray-300 rounded-md px-3 py-2 bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
//               required
//             >
//               <option value="" disabled>
//                 Select terrain_factor type
//               </option>
//               {terrainOptions.map((option) => (
//                 <option key={option.label} value={option.label}>
//                   {option.label}
//                 </option>
//               ))}
//             </select>
//           </div>

//           {/* Hours Input */}
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">
//               Hours Spent Hiking
//             </label>
//             <input
//               type="number"
//               step="any"
//               value={hours}
//               onChange={(e) => setHours(e.target.value)}
//               className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
//               placeholder="Enter number of hours"
//               required
//             />
//           </div>

//           {/* Submit Button */}
//           <div>
//             <button
//               type="submit"
//               className="w-full flex justify-center items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
//               disabled={loading}
//             >
//               {loading ? "Calculating..." : "Calculate"}
//             </button>
//           </div>

//           {/* Error Message */}
//           {error && (
//             <div className="flex items-center text-red-600 text-sm mt-2">
//               <ExclamationCircleIcon className="w-5 h-5 mr-1" />
//               {error}
//             </div>
//           )}

//           {/* Result Display */}
//           {caloriesPerHour && totalCalories && (
//             <div className="mt-6 p-4 bg-green-100 rounded-md">
//               <div className="flex items-center text-green-700 mb-2">
//                 <CheckCircleIcon className="w-6 h-6 mr-2" />
//                 <h2 className="text-lg font-semibold">Results</h2>
//               </div>
//               <p className="text-gray-700">
//                 <span className="font-medium">Calories Burned Per Hour:</span>{" "}
//                 {caloriesPerHour} kcal
//               </p>
//               <p className="text-gray-700">
//                 <span className="font-medium">Total Calories Burned:</span>{" "}
//                 {totalCalories} kcal
//               </p>
//             </div>
//           )}
//         </form>
//       </div>
//     </div>
//   );
// }

// export default App;
