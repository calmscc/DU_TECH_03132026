let chartInstance = null;

async function runAnalysis() {

  const product = document.getElementById("productInput").value;

  if (!product) {
    alert("Please enter a product name.");
    return;
  }

  try {

    const response = await fetch(`/run-analysis?product=${encodeURIComponent(product)}`);
    const data = await response.json();

    // show results section
    document.getElementById("results").style.display = "block";

    // update scores
    document.getElementById("visibilityScore").innerText =
      data.visibility_score + "%";

    document.getElementById("accuracyScore").innerText =
      data.accuracy_score + "%";

    // competitor data
    const labels = Object.keys(data.competitors);
    const values = Object.values(data.competitors);

    const ctx = document.getElementById("competitorChart");

    // destroy previous chart if exists
    if (chartInstance) {
      chartInstance.destroy();
    }

    chartInstance = new Chart(ctx, {
      type: "bar",
      data: {
        labels: labels,
        datasets: [
          {
            label: "AI Recommendation Frequency",
            data: values
          }
        ]
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            display: true
          }
        }
      }
    });

  } catch (error) {

    console.error("Error:", error);
    alert("Analysis failed. Check backend connection.");

  }
}
