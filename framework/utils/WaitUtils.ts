import { expect } from '@playwright/test';

export class WaitUtils {
  /**
   * Waits until the producer returns an array with at least one element and returns it.
   * This utility avoids double execution of the producer function.
   * 
   * @param producer A function that returns a Promise of an array.
   * @param options Polling options (timeout, message, intervals).
   * @returns The non-empty array returned by the producer.
   */
  static async waitAndGetResults<T>(
    producer: () => Promise<T[]>,
    options?: { timeout?: number; message?: string; intervals?: number[] }
  ): Promise<T[]> {
    let results: T[] = [];
    await expect.poll(async () => {
      results = await producer();
      return results.length;
    }, options).toBeGreaterThan(0);
    return results;
  }

  /**
   * Waits until the producer returns an array with the exact expected count and returns it.
   * 
   * @param producer A function that returns a Promise of an array.
   * @param expectedCount The expected length of the array.
   * @param options Polling options (timeout, message, intervals).
   * @returns The array returned by the producer when it matches the expected count.
   */
  static async waitForCountAndGet<T>(
    producer: () => Promise<T[]>,
    expectedCount: number,
    options?: { timeout?: number; message?: string; intervals?: number[] }
  ): Promise<T[]> {
    let results: T[] = [];
    await expect.poll(async () => {
      results = await producer();
      return results.length;
    }, options).toBe(expectedCount);
    return results;
  }
}
