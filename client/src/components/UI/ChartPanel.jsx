import { useEffect, useRef, useState } from "react";

const ChartPanel = ({ labels, values, type = "line", label = "Score" }) => {
  const canvasRef = useRef(null);
  const chartRef = useRef(null);
  const [available, setAvailable] = useState(false);
  const labelKey = labels.join("|");
  const valueKey = values.join("|");

  useEffect(() => {
    let mounted = true;

    import("chart.js/auto")
      .then(({ default: Chart }) => {
        if (!mounted || !canvasRef.current) return;
        const chartLabels = labelKey ? labelKey.split("|") : [];
        const chartValues = valueKey ? valueKey.split("|").map(Number) : [];
        setAvailable(true);
        chartRef.current?.destroy();
        chartRef.current = new Chart(canvasRef.current, {
          type,
          data: {
            labels: chartLabels,
            datasets: [
              {
                label,
                data: chartValues,
                borderColor: "#6366f1",
                backgroundColor: "rgba(34, 211, 238, 0.28)",
                tension: 0.35,
                fill: type === "line",
              },
            ],
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: { y: { beginAtZero: true, max: 100 } },
            plugins: { legend: { display: false } },
          },
        });
      })
      .catch(() => setAvailable(false));

    return () => {
      mounted = false;
      chartRef.current?.destroy();
    };
  }, [label, labelKey, type, valueKey]);

  if (!labels.length) {
    return <p className="empty-state">No data available.</p>;
  }

  return (
    <>
      <div className={available ? "chart-canvas" : "chart-canvas hidden"}>
        <canvas ref={canvasRef} aria-label={label} />
      </div>
      {!available ? (
        <div className="mini-chart progress-chart">
          {values.map((value, index) => (
            <span
              aria-label={`${labels[index]} ${value}%`}
              key={`${labels[index]}-${index}`}
              style={{ height: `${Math.max(value, 6)}%` }}
              title={`${labels[index]}: ${value}%`}
            />
          ))}
        </div>
      ) : null}
    </>
  );
};

export default ChartPanel;
