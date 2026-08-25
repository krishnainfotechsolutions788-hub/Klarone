export interface LaptopRawSpecs {
  brand: string;
  processor_name: string;
  graphics: string;
  "ram(GB)": number;
  "ssd(GB)": number;
  "Hard Disk(GB)"?: number;
  "Operating System"?: string;
  "screen_size(inches)"?: number;
  no_of_cores?: number;
  no_of_threads?: number;
  spec_score?: number;
  "resolution (pixels)"?: string;
}

export interface MLEstimationResult {
  predicted_price: number;
  gaming_score: number;
  student_score: number;
  business_score: number;
}

export interface MLRecommendationItem {
  model_name: string;
  actual_price: number;
  recommendation_score: number;
  gaming_score: number;
  student_score: number;
  business_score: number;
  reason: string;
}

const ML_MODEL_URL = process.env.KLARONE_ML_MODEL_URL || "http://127.0.0.1:8080";

export async function estimateLaptopScoresAndValue(specs: Partial<LaptopRawSpecs>): Promise<MLEstimationResult | null> {
  try {
    const payload = {
      brand: specs.brand || "Generic",
      processor_name: specs.processor_name || "Intel Core i5",
      graphics: specs.graphics || "Intel Integrated Graphics",
      "ram(GB)": specs["ram(GB)"] ?? 8,
      "ssd(GB)": specs["ssd(GB)"] ?? 512,
      "Hard Disk(GB)": specs["Hard Disk(GB)"] ?? 0,
      "Operating System": specs["Operating System"] || "Windows 11",
      "screen_size(inches)": specs["screen_size(inches)"] ?? 15.6,
      no_of_cores: specs.no_of_cores ?? 8,
      no_of_threads: specs.no_of_threads ?? 12,
      spec_score: specs.spec_score ?? 60,
      "resolution (pixels)": specs["resolution (pixels)"] || "1920x1080",
    };

    const response = await fetch(`${ML_MODEL_URL}/estimate-value`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
      cache: "no-store",
    });

    if (!response.ok) {
      console.warn("ML model server returned error:", response.status, await response.text());
      return null;
    }

    return (await response.json()) as MLEstimationResult;
  } catch (error) {
    console.error("Failed to connect to Klarone ML Model service:", error);
    return null;
  }
}

export async function fetchMLRecommendations(query: string, laptops?: any[]): Promise<MLRecommendationItem[]> {
  try {
    const response = await fetch(`${ML_MODEL_URL}/recommend`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ query, laptops }),
      cache: "no-store",
    });

    if (!response.ok) {
      console.warn("ML recommendation engine returned error:", response.status);
      return [];
    }

    const data = await response.json();
    return data.recommendations || [];
  } catch (error) {
    console.info("Python ML service offline (http://127.0.0.1:8080). Using built-in dynamic DB scoring engine.");
    return [];
  }
}
