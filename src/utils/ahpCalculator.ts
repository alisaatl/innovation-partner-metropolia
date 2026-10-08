import { AHPCriterion, SolutionAlternative, AHPAnalysisResult } from '../types/innovation';

const SAATY_RI: Record<number, number> = {
  1: 0.0,
  2: 0.0,
  3: 0.58,
  4: 0.90,
  5: 1.12,
  6: 1.24,
  7: 1.32,
  8: 1.41,
  9: 1.45,
  10: 1.49
};

/**
 * All discrete points on the fundamental Saaty AHP scale:
 * 9, 8, 7, 6, 5, 4, 3, 2, 1, 1/2, 1/3, 1/4, 1/5, 1/6, 1/7, 1/8, 1/9
 */
export interface AHPScaleItem {
  value: number;
  reciprocal: number;
  label: string;
  fractionText: string;
}

export const AHP_SCALE_ITEMS: AHPScaleItem[] = [
  { value: 9, reciprocal: 1 / 9, label: '9 - Extreme (Absolute preference)', fractionText: '9' },
  { value: 8, reciprocal: 1 / 8, label: '8 - Very, very strong', fractionText: '8' },
  { value: 7, reciprocal: 1 / 7, label: '7 - Very Strong preference', fractionText: '7' },
  { value: 6, reciprocal: 1 / 6, label: '6 - Strong plus', fractionText: '6' },
  { value: 5, reciprocal: 1 / 5, label: '5 - Strong preference', fractionText: '5' },
  { value: 4, reciprocal: 1 / 4, label: '4 - Moderate plus', fractionText: '4' },
  { value: 3, reciprocal: 1 / 3, label: '3 - Moderate preference', fractionText: '3' },
  { value: 2, reciprocal: 1 / 2, label: '2 - Slight preference', fractionText: '2' },
  { value: 1, reciprocal: 1, label: '1 - Equal Importance', fractionText: '1' },
  { value: 1 / 2, reciprocal: 2, label: '1/2 - Slight disfavor', fractionText: '1/2' },
  { value: 1 / 3, reciprocal: 3, label: '1/3 - Moderate disfavor', fractionText: '1/3' },
  { value: 1 / 4, reciprocal: 4, label: '1/4 - Moderate plus disfavor', fractionText: '1/4' },
  { value: 1 / 5, reciprocal: 5, label: '1/5 - Strong disfavor', fractionText: '1/5' },
  { value: 1 / 6, reciprocal: 6, label: '1/6 - Strong plus disfavor', fractionText: '1/6' },
  { value: 1 / 7, reciprocal: 7, label: '1/7 - Very strong disfavor', fractionText: '1/7' },
  { value: 1 / 8, reciprocal: 8, label: '1/8 - Very, very strong disfavor', fractionText: '1/8' },
  { value: 1 / 9, reciprocal: 9, label: '1/9 - Extreme disfavor', fractionText: '1/9' }
];

/**
 * Finds the exact canonical scale point closest to any given number
 * (handles any floating-point rounding like 0.333, 0.111, 0.143, etc.)
 */
export function getCanonicalScaleValue(val: number): number {
  if (val <= 0 || isNaN(val)) return 1;
  let bestItem = AHP_SCALE_ITEMS[8]; // default to 1
  let minDiff = Infinity;
  for (const item of AHP_SCALE_ITEMS) {
    const diff = Math.abs(item.value - val);
    if (diff < minDiff) {
      minDiff = diff;
      bestItem = item;
    }
  }
  return bestItem.value;
}

/**
 * Computes the exact mathematical reciprocal for any AHP scale point.
 * Guarantees that:
 * getExactReciprocal(9) === 1/9
 * getExactReciprocal(1/9) === 9
 * getExactReciprocal(getExactReciprocal(x)) === x
 */
export function getExactReciprocal(val: number): number {
  const canonical = getCanonicalScaleValue(val);
  const found = AHP_SCALE_ITEMS.find(item => Math.abs(item.value - canonical) < 1e-5);
  if (found) {
    return found.reciprocal;
  }
  return 1 / val;
}

/**
 * Validates and normalizes an entire pairwise matrix:
 * 1. Guarantees diagonal entries a_ii === 1
 * 2. Guarantees reciprocal symmetry a_ji === 1 / a_ij
 */
export function enforceMatrixReciprocals(
  items: string[],
  matrix: Record<string, Record<string, number>>
): Record<string, Record<string, number>> {
  const result: Record<string, Record<string, number>> = {};
  for (const id of items) {
    result[id] = {};
  }

  for (let i = 0; i < items.length; i++) {
    const rowId = items[i];
    result[rowId][rowId] = 1; // Diagonal always 1

    for (let j = i + 1; j < items.length; j++) {
      const colId = items[j];
      const rawVal = matrix[rowId]?.[colId];
      const rawReciprocal = matrix[colId]?.[rowId];

      let canonicalVal: number;
      if (rawVal !== undefined && !isNaN(rawVal)) {
        canonicalVal = getCanonicalScaleValue(rawVal);
      } else if (rawReciprocal !== undefined && !isNaN(rawReciprocal)) {
        canonicalVal = getExactReciprocal(rawReciprocal);
      } else {
        canonicalVal = 1;
      }

      const reciprocalVal = getExactReciprocal(canonicalVal);
      result[rowId][colId] = canonicalVal;
      result[colId][rowId] = reciprocalVal;
    }
  }

  return result;
}

/**
 * Calculates priority vector, lambda max, CI, and CR using the Geometric Mean method
 */
export function computePriorityVector(
  items: string[],
  matrix: Record<string, Record<string, number>>
): {
  weights: Record<string, number>;
  lambdaMax: number;
  ci: number;
  cr: number;
  isConsistent: boolean;
} {
  const n = items.length;
  if (n === 0) {
    return { weights: {}, lambdaMax: 0, ci: 0, cr: 0, isConsistent: true };
  }
  if (n === 1) {
    return {
      weights: { [items[0]]: 1.0 },
      lambdaMax: 1.0,
      ci: 0,
      cr: 0,
      isConsistent: true
    };
  }

  // Enforce reciprocal symmetry and diagonal 1 across matrix
  const normMatrix = enforceMatrixReciprocals(items, matrix);

  // 1. Geometric Mean for each row
  const geoMeans: Record<string, number> = {};
  let totalGeoMean = 0;

  for (const itemI of items) {
    let product = 1.0;
    for (const itemJ of items) {
      const val = normMatrix[itemI]?.[itemJ] ?? 1.0;
      product *= Math.max(0.0001, val);
    }
    const gm = Math.pow(product, 1 / n);
    geoMeans[itemI] = gm;
    totalGeoMean += gm;
  }

  // 2. Normalized Weights
  const weights: Record<string, number> = {};
  for (const item of items) {
    weights[item] = totalGeoMean > 0 ? geoMeans[item] / totalGeoMean : 1 / n;
  }

  // 3. Principal Eigenvalue (lambda_max) via (A * w) / w
  let lambdaSum = 0;
  for (const itemI of items) {
    let rowDotW = 0;
    for (const itemJ of items) {
      const val = normMatrix[itemI]?.[itemJ] ?? 1.0;
      rowDotW += val * (weights[itemJ] ?? 0);
    }
    const wi = weights[itemI] ?? 0.0001;
    lambdaSum += rowDotW / Math.max(0.00001, wi);
  }
  const lambdaMax = lambdaSum / n;

  // 4. Consistency Index (CI) and Ratio (CR)
  const ci = n > 1 ? Math.max(0, (lambdaMax - n) / (n - 1)) : 0;
  const ri = SAATY_RI[n] ?? 1.49;
  const cr = ri > 0 ? ci / ri : 0;

  return {
    weights,
    lambdaMax,
    ci,
    cr,
    isConsistent: cr <= 0.101 // Standard 10% threshold with rounding tolerance
  };
}

/**
 * Computes full AHP synthesis across criteria and alternatives
 */
export function calculateFullAHP(
  criteria: AHPCriterion[],
  alternatives: SolutionAlternative[],
  criteriaMatrix: Record<string, Record<string, number>>,
  alternativeMatrices: Record<string, Record<string, Record<string, number>>>
): AHPAnalysisResult {
  const criteriaIds = criteria.map(c => c.id);
  const altIds = alternatives.map(a => a.id);

  // Step 1: Compute Criteria Weights
  const critResult = computePriorityVector(criteriaIds, criteriaMatrix);

  // Step 2: Compute Local Weights for each Alternative under each Criterion
  const altScoresByCriterion: Record<string, Record<string, number>> = {};

  for (const crit of criteria) {
    const matrixForCrit = alternativeMatrices[crit.id] || {};
    const altResult = computePriorityVector(altIds, matrixForCrit);
    altScoresByCriterion[crit.id] = altResult.weights;
  }

  // Step 3: Global Weighted Synthesis (P_i = sum(w_c * s_ic))
  const overallScores: Record<string, number> = {};
  for (const altId of altIds) {
    let score = 0;
    for (const critId of criteriaIds) {
      const wCrit = critResult.weights[critId] ?? 0;
      const sAlt = altScoresByCriterion[critId]?.[altId] ?? 0;
      score += wCrit * sAlt;
    }
    overallScores[altId] = score;
  }

  // Step 4: Normalize overall scores and Rank
  const totalScore = Object.values(overallScores).reduce((a, b) => a + b, 0) || 1;
  const sorted = [...altIds].sort((a, b) => (overallScores[b] ?? 0) - (overallScores[a] ?? 0));

  const ranking = sorted.map((altId, idx) => {
    const rawScore = overallScores[altId] ?? 0;
    return {
      alternativeId: altId,
      score: rawScore,
      scorePct: Math.round((rawScore / totalScore) * 1000) / 10,
      rank: idx + 1
    };
  });

  return {
    criteriaWeights: critResult.weights,
    criteriaLambdaMax: critResult.lambdaMax,
    criteriaCI: critResult.ci,
    criteriaCR: critResult.cr,
    isConsistent: critResult.isConsistent,
    alternativeScoresByCriterion: altScoresByCriterion,
    overallScores,
    ranking
  };
}

export const SAATY_SCALE_LABELS: Record<number, string> = {
  1: '1 - Equal Importance',
  2: '2 - Weak or Slight',
  3: '3 - Moderate Importance',
  4: '4 - Moderate plus',
  5: '5 - Strong Importance',
  6: '6 - Strong plus',
  7: '7 - Very Strong Importance',
  8: '8 - Very, very strong',
  9: '9 - Extreme Importance'
};
