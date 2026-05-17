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
    } catch {
      setError("Prediction failed. Make sure the backend server is running.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-neutral-950 text-white">
      <section className="relative px-6 py-24 overflow-hidden">
        <img
          src="/images/prediction-f1-car.jpg"
          alt="F1 pit stop prediction background"
          className="absolute inset-0 w-full h-full object-cover"
        />

        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/85 to-black/30" />

        <div className="relative max-w-6xl mx-auto animate-fade-up">
          <p className="text-red-500 font-bold uppercase tracking-[0.2em] mb-4">
            Strategy Predictor
          </p>

          <h1 className="text-5xl font-black mb-5">
            Pit Stop Prediction
          </h1>

          <p className="text-neutral-300 max-w-2xl">
            A professional demo prediction page that estimates whether a driver
            may pit on the next lap based on tyre life, lap degradation,
            compound and race situation.
          </p>
        </div>
      </section>

      <section className="px-6 py-12">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="professional-card rounded-2xl p-6">
            <h2 className="text-2xl font-black mb-5">
              Input Race Situation
            </h2>

            <div className="grid gap-4">
              <input
                className="rounded-lg bg-neutral-800 border border-neutral-700 p-3"
                value={form.driver}
                onChange={(e) => updateField("driver", e.target.value)}
                placeholder="Driver"
              />

              <input
                className="rounded-lg bg-neutral-800 border border-neutral-700 p-3"
                value={form.race}
                onChange={(e) => updateField("race", e.target.value)}
                placeholder="Race"
              />

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

              {[
                ["lap_number", "Lap Number"],
                ["tyre_life", "Tyre Life"],
                ["position", "Position"],
                ["lap_time_delta", "Lap Time Delta"],
                ["cumulative_degradation", "Cumulative Degradation"],
                ["race_progress", "Race Progress 0 to 1"],
                ["position_change", "Position Change"],
              ].map(([field, label]) => (
                <label key={field} className="grid gap-2">
                  <span className="text-neutral-300">{label}</span>
                  <input
                    type="number"
                    step="0.1"
                    className="rounded-lg bg-neutral-800 border border-neutral-700 p-3"
                    value={(form as any)[field]}
                    onChange={(e) => updateField(field, e.target.value)}
                  />
                </label>
              ))}

              <button
                onClick={handlePredict}
                className="bg-red-600 hover:bg-red-700 rounded-xl px-6 py-4 font-bold mt-2 transition"
              >
                {loading ? "Predicting..." : "Predict Pit Stop"}
              </button>
            </div>
          </div>

          <div className="professional-card rounded-2xl p-6">
            <h2 className="text-2xl font-black mb-5">
              Prediction Result
            </h2>

            {!result && !error && (
              <p className="text-neutral-400">
                Fill the race situation and click Predict Pit Stop.
              </p>
            )}

            {error && (
              <div className="rounded-xl bg-red-950 border border-red-700 p-4">
                <p className="text-red-300">{error}</p>
              </div>
            )}

            {result && (
              <div className="grid gap-4 animate-fade-up">
                <div className="rounded-xl bg-neutral-800 p-5">
                  <p className="text-neutral-400 text-sm">Driver</p>
                  <p className="text-2xl font-black">{result.driver}</p>
                </div>

                <div className="rounded-xl bg-neutral-800 p-5">
                  <p className="text-neutral-400 text-sm">
                    Will Pit Next Lap?
                  </p>

                  <p
                    className={
                      result.will_pit
                        ? "text-4xl font-black text-red-400"
                        : "text-4xl font-black text-green-400"
                    }
                  >
                    {result.will_pit ? "YES" : "NO"}
                  </p>
                </div>

                <div className="rounded-xl bg-neutral-800 p-5">
                  <p className="text-neutral-400 text-sm">Probability</p>
                  <p className="text-4xl font-black">{result.percentage}%</p>
                </div>

                <div className="rounded-xl bg-neutral-800 p-5">
                  <p className="text-neutral-400 text-sm mb-3">Reason</p>

                  <ul className="list-disc list-inside text-neutral-300 space-y-2">
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