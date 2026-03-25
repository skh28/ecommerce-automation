/** Fixed sleep for rare timing gaps. Prefer waiting on locators/network when possible. */
export function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
