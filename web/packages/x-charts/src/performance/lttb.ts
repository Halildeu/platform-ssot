/**
 * LTTB — Largest Triangle Three Buckets Downsampling
 *
 * Reduces large datasets to a target number of points while
 * preserving visual shape. O(n) time complexity.
 *
 * @see Sveinn Steinarsson (2013) "Downsampling Time Series for Visual Representation"
 * @see contract P6 DoD: "LTTB downsampling for >50K points"
 */

export interface LTTBPoint {
  x: number;
  y: number;
  /** Original index in source array */
  originalIndex?: number;
}

/**
 * Downsample a series of points using LTTB algorithm.
 *
 * @param data - Input data points (must be sorted by x)
 * @param threshold - Target number of output points (must be >= 2)
 * @returns Downsampled points
 */
export function downsampleLTTB(data: LTTBPoint[], threshold: number): LTTBPoint[] {
  if (threshold >= data.length || threshold < 2) return [...data];
  if (data.length === 0) return [];

  const sampled: LTTBPoint[] = [];
  const bucketSize = (data.length - 2) / (threshold - 2);

  // Always keep first point
  sampled.push({ ...data[0], originalIndex: 0 });

  let prevSelected = 0;

  for (let i = 0; i < threshold - 2; i++) {
    // Calculate bucket boundaries
    const bucketStart = Math.floor((i + 0) * bucketSize) + 1;
    const bucketEnd = Math.min(Math.floor((i + 1) * bucketSize) + 1, data.length - 1);

    // Calculate average of NEXT bucket (for triangle area)
    const nextBucketStart = Math.floor((i + 1) * bucketSize) + 1;
    const nextBucketEnd = Math.min(Math.floor((i + 2) * bucketSize) + 1, data.length - 1);

    let avgX = 0;
    let avgY = 0;
    const nextBucketLen = nextBucketEnd - nextBucketStart;
    if (nextBucketLen > 0) {
      for (let j = nextBucketStart; j < nextBucketEnd; j++) {
        avgX += data[j].x;
        avgY += data[j].y;
      }
      avgX /= nextBucketLen;
      avgY /= nextBucketLen;
    } else {
      avgX = data[data.length - 1].x;
      avgY = data[data.length - 1].y;
    }

    // Find point in current bucket with largest triangle area
    let maxArea = -1;
    let maxIdx = bucketStart;

    const prevX = data[prevSelected].x;
    const prevY = data[prevSelected].y;

    for (let j = bucketStart; j < bucketEnd; j++) {
      // Triangle area = 0.5 * |x1(y2-y3) + x2(y3-y1) + x3(y1-y2)|
      const area = Math.abs(
        (prevX - avgX) * (data[j].y - prevY) -
        (prevX - data[j].x) * (avgY - prevY),
      );
      if (area > maxArea) {
        maxArea = area;
        maxIdx = j;
      }
    }

    sampled.push({ ...data[maxIdx], originalIndex: maxIdx });
    prevSelected = maxIdx;
  }

  // Always keep last point
  sampled.push({ ...data[data.length - 1], originalIndex: data.length - 1 });

  return sampled;
}
