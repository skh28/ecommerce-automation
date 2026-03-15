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

  /** Container for the products list (optional; use to wait until list is loaded). */
  productsList(page: Page) {
    return page.getByRole('list', { name: /products?|catalog/i }).or(
      page.locator('[data-testid="product-list"], [data-testid="products"], .products, [class*="productList"]').first()
    );
  },

  /** First product card / item in the list. */
  firstProductCard(page: Page) {
    return page.getByRole('listitem').first().or(
      page.locator('[data-testid^="product-"], [data-testid="product-card"], .product-card').first()
    );
  },

  /** Product card or row by product name (partial match). */
  productCardByName(page: Page, name: string | RegExp) {
    const namePattern = typeof name === 'string' ? new RegExp(name, 'i') : name;
    return page.getByRole('listitem').filter({ has: page.getByText(namePattern) }).first().or(
      page.locator('[data-testid^="product-"], .product-card').filter({ has: page.getByText(namePattern) }).first()
    );
  },

  /** "Add to cart" button within a product card or on the page (first match). */
  addToCartButton(page: Page, within?: ReturnType<Page['locator']>) {
    const base = within ?? page;
    return base.getByRole('button', { name: /add\s*to\s*cart/i }).first();
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
