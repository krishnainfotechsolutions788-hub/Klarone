import { LaptopSpecs } from "./index";

/**
 * Explanation Engine (Rule-based)
 * Maps high-scoring attributes and specifications to natural language explanations.
 */
export function generateExplanations(useCase: string, specs: LaptopSpecs): string[] {
  const explanations: string[] = [];
  const u = useCase.toLowerCase();

  // Battery checks
  if (specs.battery) {
    const batMatch = specs.battery.match(/(\d+(?:\.\d+)?)\s*wh/i);
    const batVal = batMatch ? parseFloat(batMatch[1]) : 0;
    if (batVal >= 70) {
      if (u === 'student' || u === 'business') {
        explanations.push("Excellent battery life for all-day campus/office use without the charger.");
      } else {
        explanations.push("Massive battery capacity ensures excellent unplugged longevity.");
      }
    }
  }

  // Weight checks
  if (specs.weight) {
    if (specs.weight <= 1.4) {
      explanations.push("Ultra-lightweight design makes it incredibly easy to carry everywhere.");
    } else if (specs.weight <= 1.8 && u === 'student') {
      explanations.push("Good balance of portability and screen size for your backpack.");
    }
  }

  // RAM checks
  if (specs.ram) {
    const ramMatch = specs.ram.match(/(\d+)\s*(gb|tb)/i);
    let ramGB = 0;
    if (ramMatch) {
      ramGB = parseInt(ramMatch[1]);
      if (ramMatch[2].toLowerCase() === 'tb') ramGB *= 1024;
    }

    if (ramGB >= 32 && (u === 'developer' || u === 'designer')) {
      explanations.push("32GB+ RAM easily handles multiple virtual machines, heavy IDEs, and large datasets.");
    } else if (ramGB >= 16) {
      explanations.push("16GB RAM provides smooth multitasking without system slowdowns.");
    }
  }

  // CPU checks
  if (specs.cpu) {
    const cpu = specs.cpu.toLowerCase();
    if (cpu.includes('m2') || cpu.includes('m3') || cpu.includes('m4')) {
      explanations.push("Apple Silicon delivers industry-leading performance-per-watt and silent operation.");
    } else if (cpu.includes('i9') || cpu.includes('ryzen 9')) {
      explanations.push("Top-tier processor for uncompromised compilation and rendering speeds.");
    }
  }

  // GPU checks
  if (specs.gpu) {
    const gpu = specs.gpu.toLowerCase();
    if (gpu.includes('rtx 40') || gpu.includes('rtx 30')) {
      if (u === 'gaming' || u === 'designer') {
        explanations.push("Dedicated RTX graphics for high-FPS gaming and hardware-accelerated creative workflows.");
      }
    }
  }

  // Fallback if we didn't generate enough
  if (explanations.length < 2) {
    explanations.push("Overall balanced specifications tailored for your budget and workflow.");
  }

  return explanations.slice(0, 4); // Return top 4 explanations max
}
