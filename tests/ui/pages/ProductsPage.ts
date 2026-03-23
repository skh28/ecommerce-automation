/**
 * Shared locators and helpers for the products list and product detail UI.
 * Reuse in any test that navigates to products, selects a product, or adds to cart.
 */
import type { Page } from '@playwright/test';

export const ProductsPage = {
  /** Link or button in nav that goes to the products list (Products / Shop / Store). */
  navLink(page: Page) {
    return page
      .getByRole('link', { name: /^Products$|^Shop$|^Store$|Catalog/i })
      .or(page.getByRole('button', { name: /^Products$|^Shop$|^Store$|Catalog/i }))
      .first();
  },

  /**
   * Products grid under <main>: <ul class="grid …"><li>…</li></ul>
   * Keeps listitems scoped to the products page (avoids other lists on the layout).
   */
  productCards(page: Page) {
    return page.getByRole('main').getByRole('listitem');
  },

  /** Container for the products list (optional; use to wait until list is loaded). */
  productsList(page: Page) {
    return page.getByRole('main').locator('ul.grid').first();
  },

  /** First product card / item in the list. */
  firstProductCard(page: Page) {
    return ProductsPage.productCards(page).first();
  },

  /** Nth product card (0-based index: 0 = first, 1 = second). */
  nthProductCard(page: Page, index: number) {
    return ProductsPage.productCards(page).nth(index);
  },

  /** Product card or row by product name (partial match; matches <h2> title in card). */
  productCardByName(page: Page, name: string | RegExp) {
    const namePattern = typeof name === 'string' ? new RegExp(name, 'i') : name;
    return ProductsPage.productCards(page).filter({ has: page.getByText(namePattern) }).first();
  },

  /**
   * "Add to cart" button; scoped to a product card when `within` is passed.
   * Matches visible text "Add to cart" and aria-label "Add {Product} to cart".
   */
  addToCartButton(page: Page, within?: ReturnType<Page['locator']>) {
    const base = within ?? page;
    return base
      .getByRole('button', { name: /add.*to\s*cart/i })
      .or(base.getByRole('link', { name: /add.*to\s*cart/i }))
      .first();
  },

  /** Link to product detail (by product name text). */
  productDetailLink(page: Page, name: string | RegExp) {
    const namePattern = typeof name === 'string' ? new RegExp(name, 'i') : name;
    return page.getByRole('link', { name: namePattern }).first();
  },

  /** Product detail page: main heading (product name). */
  detailHeading(page: Page) {
    return page.getByRole('heading', { level: 1 }).first();
  },

  /** Product detail page: price element. */
  detailPrice(page: Page) {
    return page.getByText(/\$[\d,]+\.?\d*/).first().or(
      page.locator('[data-testid="price"], .price, [class*="price"]').first()
    );
  },

  /** Product detail page: Add to cart button. */
  detailAddToCart(page: Page) {
    return page.getByRole('button', { name: /add\s*to\s*cart/i }).first();
  },
};

/**
 * Go to the products list from anywhere (clicks nav Products/Shop link).
 */
export async function goToProducts(page: Page): Promise<void> {
  await ProductsPage.navLink(page).click();
}

/** Reduce product card text to a short name (e.g. "Wireless Headphones") for cart matching. */
function toShortProductName(raw: string): string {
  const trimmed = raw.trim();
  if (!trimmed) return trimmed;
  const withoutPrice = trimmed.replace(/\$[\d,]+\.?\d*/, '').trim();
  const words = withoutPrice
    .split(/\s+/)
    .flatMap((w) => w.split(/(?=[A-Z])/).filter(Boolean));
  return words.slice(0, 2).join(' ') || trimmed.split(/\s+/)[0] || trimmed;
}

/**
 * Get the displayed name of the first product (for verifying the same product in the cart).
 * Always returns a short name (e.g. "Wireless Headphones") so the cart page can match it.
 */
export async function getFirstProductName(page: Page): Promise<string> {
  return getNthProductName(page, 0);
}

/**
 * Get the displayed name of the nth product (0-based). Use to verify the same products in the cart.
 */
export async function getNthProductName(page: Page, index: number): Promise<string> {
  const card = ProductsPage.nthProductCard(page, index);
  const title = await card.getByRole('heading', { level: 2 }).textContent().catch(() => null);
  if (title?.trim()) return title.trim();
  const nameLink = card.getByRole('link').first();
  const nameHeading = card.getByRole('heading').first();
  const linkText = await nameLink.textContent().catch(() => null);
  if (linkText?.trim()) return toShortProductName(linkText);
  const headingText = await nameHeading.textContent().catch(() => null);
  if (headingText?.trim()) return toShortProductName(headingText);
  let fullText = '';
  try {
    fullText = (await card.textContent())?.trim() ?? '';
  } catch {
    return `Product ${index + 1}`;
  }
  return toShortProductName(fullText);
}
