export interface LaptopSpecs {
  cpu?: string;
  gpu?: string;
  ram?: string;
  storage?: string;
  display?: string;
  battery?: string;
  weight?: number; // kg
  msrp?: number;
}

export interface LaptopScores {
  programming: number;
  gaming: number;
  student: number;
  business: number;
}

/**
 * Basic heuristic scoring engine for V1.
 * Evaluates a laptop's objective specs to calculate scores (0-100) for different profiles.
 */
export function calculateScores(specs: LaptopSpecs): LaptopScores {
  return {
    programming: calculateProgrammingScore(specs),
    gaming: calculateGamingScore(specs),
    student: calculateStudentScore(specs),
    business: calculateBusinessScore(specs)
  };
}

function parseRamGB(ram?: string): number {
  if (!ram) return 8; // Default assumption
  const match = ram.match(/(\d+)\s*(gb|tb)/i);
  if (match) {
    let val = parseInt(match[1]);
    if (match[2].toLowerCase() === 'tb') val *= 1024;
    return val;
  }
  return 8;
}

function parseBatteryWh(battery?: string): number {
  if (!battery) return 50; // Default assumption
  const match = battery.match(/(\d+(?:\.\d+)?)\s*wh/i);
  return match ? parseFloat(match[1]) : 50;
}

function isHighEndGPU(gpu?: string): boolean {
  if (!gpu) return false;
  const g = gpu.toLowerCase();
  return g.includes('rtx 40') || g.includes('rtx 30') || g.includes('rx 7000') || g.includes('rx 6000') || g.includes('m3 max');
}

function calculateProgrammingScore(specs: LaptopSpecs): number {
  let score = 50;
  const ramGB = parseRamGB(specs.ram);
  
  if (ramGB >= 32) score += 30;
  else if (ramGB >= 16) score += 20;
  
  if (specs.cpu && (specs.cpu.toLowerCase().includes('i7') || specs.cpu.toLowerCase().includes('i9') || specs.cpu.toLowerCase().includes('ryzen 7') || specs.cpu.toLowerCase().includes('ryzen 9') || specs.cpu.toLowerCase().includes('m'))) {
    score += 15;
  }
  
  const battery = parseBatteryWh(specs.battery);
  if (battery > 70) score += 5;
  
  return Math.min(100, Math.max(0, score));
}

function calculateGamingScore(specs: LaptopSpecs): number {
  let score = 20;
  
  if (isHighEndGPU(specs.gpu)) {
    score += 50;
  } else if (specs.gpu && !specs.gpu.toLowerCase().includes('integrated')) {
    score += 30;
  }
  
  const ramGB = parseRamGB(specs.ram);
  if (ramGB >= 16) score += 15;
  
  if (specs.cpu && (specs.cpu.toLowerCase().includes('i7') || specs.cpu.toLowerCase().includes('i9') || specs.cpu.toLowerCase().includes('ryzen 7') || specs.cpu.toLowerCase().includes('ryzen 9'))) {
    score += 15;
  }
  
  return Math.min(100, Math.max(0, score));
}

function calculateStudentScore(specs: LaptopSpecs): number {
  let score = 50;
  
  // Lower weight is better for students
  if (specs.weight && specs.weight < 1.5) {
    score += 20;
  } else if (specs.weight && specs.weight < 2.0) {
    score += 10;
  }
  
  const battery = parseBatteryWh(specs.battery);
  if (battery > 65) score += 20;
  else if (battery > 50) score += 10;
  
  // Lower price is better for students
  if (specs.msrp && specs.msrp < 60000) score += 10;
  
  return Math.min(100, Math.max(0, score));
}

function calculateBusinessScore(specs: LaptopSpecs): number {
  let score = 50;
  
  if (specs.weight && specs.weight < 1.6) {
    score += 15;
  }
  
  const battery = parseBatteryWh(specs.battery);
  if (battery > 70) score += 20;
  
  const ramGB = parseRamGB(specs.ram);
  if (ramGB >= 16) score += 15;
  
  return Math.min(100, Math.max(0, score));
}
