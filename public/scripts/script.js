// public/scripts/script.js

document.addEventListener('DOMContentLoaded', () => {
  // Try to get token from a global JS var, body data-token, or hidden input
  const TOKEN =
    window.TOKEN ||
    document.body.dataset.token ||
    (document.querySelector('input[name="token"]')?.value) ||
    '';

  // Find the AJAX report generation form (should be only one on /reports/new)
  const reportForm = document.querySelector('form');
  if (!reportForm) return;

  // Result display container
  let resultDiv = document.querySelector('.report-result');
  if (!resultDiv) {
    resultDiv = document.createElement('div');
    resultDiv.className = 'report-result';
    reportForm.parentNode.appendChild(resultDiv);
  }

  reportForm.addEventListener('submit', async function (e) {
    // Only handle "Generate Report" forms (robust, but adjust as needed)
    const submitBtn = reportForm.querySelector('button[type="submit"]');
    if (!submitBtn || !submitBtn.innerText.toLowerCase().includes('generate')) return;

    e.preventDefault();

    // Get form values
    const plantId = this.plantId?.value;
    const periodStart = this.periodStart?.value;
    const periodEnd = this.periodEnd?.value;

    if (!plantId || !periodStart || !periodEnd) {
      resultDiv.innerHTML = `<span style="color:crimson">Please fill all fields.</span>`;
      return;
    }

    resultDiv.innerHTML = 'Generating report...';

    try {
      const response = await fetch('/api/reports/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(TOKEN && { 'Authorization': `Bearer ${TOKEN}` })
        },
        body: JSON.stringify({ plantId, periodStart, periodEnd })
      });

      // Check if response is valid JSON
      let data;
      try {
        data = await response.json();
      } catch (jsonErr) {
        const text = await response.text();
        resultDiv.innerHTML = `<span style="color:crimson">Invalid server response: <pre>${text}</pre></span>`;
        return;
      }

      if (response.ok && data) {
        // Show results
        resultDiv.innerHTML = `
          <h3>Report Generated!</h3>
          <ul>
            <li>Total Emissions: ${data.totalEmissions ?? 0} tons CO₂</li>
            <li>Total Energy: ${data.totalEnergy ?? 0} kWh</li>
            <li>Water Usage: ${data.waterUsage ?? 0} L</li>
            <li>Waste: ${data.waste ?? 0} kg</li>
            <li>Carbon Footprint: ${data.carbonFootprint ?? 0} CO₂-e</li>
            ${data.filename ? `<li>File: <a href="/reports/download?file=${encodeURIComponent(data.filename)}" target="_blank">Download Report</a></li>` : ''}
          </ul>
        `;
      } else {
        resultDiv.innerHTML = `<span style="color:crimson">Error: ${data.error || JSON.stringify(data)}</span>`;
      }
    } catch (err) {
      resultDiv.innerHTML = `<span style="color:crimson">Network Error: ${err.message}</span>`;
    }
  });
});
