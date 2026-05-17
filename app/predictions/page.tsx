"use client";

import { useState } from "react";
import { fetchPitStopDemoPrediction } from "@/lib/api";

export default function PredictionsPage() {
  const [form, setForm] = useState({
    driver: "Max Verstappen",
    race: "Japanese Grand Prix",
    compound: "MEDIUM",
    lap_number: 25,
    tyre_life: 15,
    position: 2,
    lap_time_delta: 1.1,
    cumulative_degradation: 3.4,
    race_progress: 0.55,
    position_change: -1,
  });

  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function updateField(field: string, value: string) {
    setForm((previous) => ({
      ...previous,
      [field]:
        field === "driver" || field === "race" || field === "compound"
          ? value
          : Number(value),
    }));
  }

  async function handlePredict() {
    try {
      setLoading(true);
      setError("");
      setResult(null);

      const data = await fetchPitStopDemoPrediction(form);
      setResult(data);
    } catch (err) {
      setError("Prediction failed. Make sure the backend server is running.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-neutral-950 text-white p-8">
      <section className="max-w-5xl mx-auto">
        <p className="text-red-500 font-semibold mb-3">
          Formula 1 Strategy Demo
        </p>

        <h1 className="text-4xl font-bold mb-6">
          Pit Stop Prediction
        </h1>

        <p className="text-neutral-300 mb-8">
          This is a demo prediction form connected to your FastAPI backend.
          Later, this rule-based logic will be replaced with your real machine
          learning model.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="rounded-xl border border-neutral-800 bg-neutral-900 p-5">
            <h2 className="text-2xl font-bold mb-5">
              Input Race Situation
            </h2>

            <div className="grid gap-4">
              <label className="grid gap-2">
                <span className="text-neutral-300">Driver</span>
                <input
                  className="rounded-lg bg-neutral-800 border border-neutral-700 p-3"
                  value={form.driver}
                  onChange={(e) => updateField("driver", e.target.value)}
                />
              </label>

              <label className="grid gap-2">
                <span className="text-neutral-300">Race</span>
                <input
                  className="rounded-lg bg-neutral-800 border border-neutral-700 p-3"
                  value={form.race}
                  onChange={(e) => updateField("race", e.target.value)}
                />
              </label>

              <label className="grid gap-2">
                <span className="text-neutral-300">Compound</span>
                <select
                  className="rounded-lg bg-neutral-800 border border-neutral-700 p-3"
                  value={form.compound}
                  onChange={(e) => updateField("compound", e.target.value)}
                >
                  <option value="SOFT">SOFT</option>
                  <option value="MEDIUM">MEDIUM</option>
                  <option value="HARD">HARD</option>
                  <option value="INTERMEDIATE">INTERMEDIATE</option>
                  <option value="WET">WET</option>
                </select>
              </label>

              <label className="grid gap-2">
                <span className="text-neutral-300">Lap Number</span>
                <input
                  type="number"
                  className="rounded-lg bg-neutral-800 border border-neutral-700 p-3"
                  value={form.lap_number}
                  onChange={(e) => updateField("lap_number", e.target.value)}
                />
              </label>

              <label className="grid gap-2">
                <span className="text-neutral-300">Tyre Life</span>
                <input
                  type="number"
                  className="rounded-lg bg-neutral-800 border border-neutral-700 p-3"
                  value={form.tyre_life}
                  onChange={(e) => updateField("tyre_life", e.target.value)}
                />
              </label>

              <label className="grid gap-2">
                <span className="text-neutral-300">Position</span>
                <input
                  type="number"
                  className="rounded-lg bg-neutral-800 border border-neutral-700 p-3"
                  value={form.position}
                  onChange={(e) => updateField("position", e.target.value)}
                />
              </label>

              <label className="grid gap-2">
                <span className="text-neutral-300">Lap Time Delta</span>
                <input
                  type="number"
                  step="0.1"
                  className="rounded-lg bg-neutral-800 border border-neutral-700 p-3"
                  value={form.lap_time_delta}
                  onChange={(e) => updateField("lap_time_delta", e.target.value)}
                />
              </label>

              <label className="grid gap-2">
                <span className="text-neutral-300">Cumulative Degradation</span>
                <input
                  type="number"
                  step="0.1"
                  className="rounded-lg bg-neutral-800 border border-neutral-700 p-3"
                  value={form.cumulative_degradation}
                  onChange={(e) =>
                    updateField("cumulative_degradation", e.target.value)
                  }
                />
              </label>

              <label className="grid gap-2">
                <span className="text-neutral-300">
                  Race Progress 0 to 1
                </span>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  max="1"
                  className="rounded-lg bg-neutral-800 border border-neutral-700 p-3"
                  value={form.race_progress}
                  onChange={(e) => updateField("race_progress", e.target.value)}
                />
              </label>

              <label className="grid gap-2">
                <span className="text-neutral-300">
                  Position Change
                </span>
                <input
                  type="number"
                  className="rounded-lg bg-neutral-800 border border-neutral-700 p-3"
                  value={form.position_change}
                  onChange={(e) => updateField("position_change", e.target.value)}
                />
              </label>

              <button
                onClick={handlePredict}
                className="bg-red-600 hover:bg-red-700 rounded-lg px-6 py-3 font-semibold mt-2"
              >
                {loading ? "Predicting..." : "Predict Pit Stop"}
              </button>
            </div>
          </div>

          <div className="rounded-xl border border-neutral-800 bg-neutral-900 p-5">
            <h2 className="text-2xl font-bold mb-5">
              Prediction Result
            </h2>

            {!result && !error && (
              <p className="text-neutral-400">
                Fill the race situation and click Predict Pit Stop.
              </p>
            )}

            {error && (
              <div className="rounded-lg bg-red-950 border border-red-700 p-4">
                <p className="text-red-300">{error}</p>
              </div>
            )}

            {result && (
              <div className="grid gap-4">
                <div className="rounded-lg bg-neutral-800 p-4">
                  <p className="text-neutral-400 text-sm">Driver</p>
                  <p className="text-xl font-bold">{result.driver}</p>
                </div>

                <div className="rounded-lg bg-neutral-800 p-4">
                  <p className="text-neutral-400 text-sm">Will Pit Next Lap?</p>
                  <p
                    className={
                      result.will_pit
                        ? "text-3xl font-bold text-red-400"
                        : "text-3xl font-bold text-green-400"
                    }
                  >
                    {result.will_pit ? "YES" : "NO"}
                  </p>
                </div>

                <div className="rounded-lg bg-neutral-800 p-4">
                  <p className="text-neutral-400 text-sm">Probability</p>
                  <p className="text-3xl font-bold">
                    {result.percentage}%
                  </p>
                </div>

                <div className="rounded-lg bg-neutral-800 p-4">
                  <p className="text-neutral-400 text-sm mb-2">Reason</p>

                  <ul className="list-disc list-inside text-neutral-300 space-y-1">
                    {result.reason.map((item: string, index: number) => (
                      <li key={index}>{item}</li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}