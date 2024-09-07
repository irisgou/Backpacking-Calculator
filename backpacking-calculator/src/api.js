const API_URL =
  "https://backpacking-energy-expenditure-calculator.onrender.com"; // Replace with your Flask app URL

export async function calculateCalories(data) {
  try {
    const response = await fetch(`${API_URL}/calculate`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    return response.json();
  } catch (error) {
    console.error("There was a problem with the fetch operation:", error);
  }
}
