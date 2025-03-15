// Get adjacent indices for a given index in a 5x5 grid
export function getAdjacentIndices(index: number): number[] {
  const row = Math.floor(index / 5);
  const col = index % 5;
  const adjacentIndices: number[] = [];
  
  // Check top
  if (row > 0) adjacentIndices.push(index - 5);
  
  // Check right
  if (col < 4) adjacentIndices.push(index + 1);
  
  // Check bottom
  if (row < 4) adjacentIndices.push(index + 5);
  
  // Check left
  if (col > 0) adjacentIndices.push(index - 1);
  
  return adjacentIndices;
}

// Fisher-Yates shuffle algorithm
export function shuffleArray<T>(array: T[]): T[] {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
}

// Format number with commas
export function formatNumber(num: number): string {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

// Generate a random ID
export function generateId(): string {
  return Math.random().toString(36).substring(2, 15);
}

// Delay function for animations
export function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}