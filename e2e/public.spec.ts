import { expect, test } from '@playwright/test';

test('a visitor lands on the home page and browses a school', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' }); // Holds the school tape still.
  await page.goto('/');
  await expect(page.getByRole('heading', { level: 1, name: 'Sublet near campus.' })).toBeVisible();
  await expect(
    page.getByRole('link', { name: 'Create your free account' }).first(),
  ).toHaveAttribute('href', '/sign-up');
  await page
    .getByRole('navigation', { name: 'Schools on Student Subleases' })
    .getByRole('link', { name: /University of Michigan/ })
    .click();
  await expect(page).toHaveURL('/umich');
  await expect(
    page.getByRole('heading', { name: 'Subleases near University of Michigan' }),
  ).toBeVisible();
});

test('the landing search opens a school filtered to the chosen term', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');
  await page
    .getByRole('combobox', { name: 'School', exact: true })
    .selectOption({ label: 'Michigan' });
  const when = page.getByRole('combobox', { name: 'When', exact: true });
  const termKey = await when.locator('option').nth(1).getAttribute('value');
  await when.selectOption(termKey ?? '');
  await page.getByRole('button', { name: 'Post or find a place' }).click();
  await expect(page).toHaveURL(/\/umich\?from=\d{4}-\d{2}-\d{2}&to=\d{4}-\d{2}-\d{2}$/);

  await page.goto('/');
  await page
    .getByRole('combobox', { name: 'School', exact: true })
    .selectOption({ label: 'Michigan' });
  await page
    .getByRole('combobox', { name: 'When', exact: true })
    .selectOption({ label: 'Any dates' });
  await page.getByRole('button', { name: 'Post or find a place' }).click();
  await expect(page).toHaveURL('/umich');
});

test('unknown school slugs 404', async ({ page }) => {
  const response = await page.goto('/not-a-school');
  expect(response?.status()).toBe(404);
  await expect(page.getByRole('heading', { name: 'Page not found' })).toBeVisible();
});

test('a school page with a query string canonicalizes to the bare school URL', async ({
  page,
  baseURL,
}) => {
  await page.goto('/umich?q=test');
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
    'href',
    `${new URL(baseURL ?? 'http://localhost:3000').origin}/umich`,
  );
});
