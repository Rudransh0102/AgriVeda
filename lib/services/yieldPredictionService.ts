type YieldPredictResponse = {
  predicted_yield?: string | number;
};

class YieldPredictionService {
  /**
   * Uses the public sebl-ai model endpoint (no auth). If it ever goes down, UI should handle errors.
   */
  async predict(params: {
    cropIndex: number;
    rainfallMmPerYear: number;
    temperatureC: number;
    pesticideTons: number;
  }): Promise<{ predictedYield: string }> {
    const parameters = Array(115).fill(0);
    parameters[0] = 1990;
    parameters[1] = params.rainfallMmPerYear;
    parameters[2] = params.temperatureC;
    parameters[3] = params.pesticideTons;
    parameters[4] = 1;
    parameters[params.cropIndex] = 1;

    const res = await fetch("https://sebl-ai.onrender.com/predict", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ parameters }),
    });

    if (!res.ok) {
      throw new Error("Yield prediction service unavailable");
    }

    const data = (await res.json()) as YieldPredictResponse;
    const predicted = data?.predicted_yield;

    return {
      predictedYield: typeof predicted === "number" ? String(predicted) : String(predicted || "—"),
    };
  }
}

export const yieldPredictionService = new YieldPredictionService();
