import { test, expect } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.goto("/");
});

test("shows name, role and page title", async ({ page }) => {
  await expect(page).toHaveTitle(/Pallavi Patil/);
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Pallavi Patil");
  await expect(page.getByText("Software developer building in Python, SQL and Java")).toBeVisible();
});

test("loads every project from projects.json", async ({ page }) => {
  const projects = page.locator(".project");
  await expect(projects).toHaveCount(5);
  await expect(page.getByTestId("project-retail-sales-sql")).toContainText("Retail Sales SQL Analysis");
});

test("filters projects by technology", async ({ page }) => {
  await page.getByRole("button", { name: "SQL", exact: true }).click();
  await expect(page.locator(".project")).toHaveCount(2);
  await expect(page.getByRole("button", { name: "SQL", exact: true })).toHaveAttribute("aria-pressed", "true");

  await page.getByRole("button", { name: "JavaScript" }).click();
  await expect(page.locator(".project")).toHaveCount(1);

  await page.getByRole("button", { name: "Testing" }).click();
  await expect(page.locator(".project")).toHaveCount(4);

  await page.getByRole("button", { name: "All" }).click();
  await expect(page.locator(".project")).toHaveCount(5);
});

test("theme toggle switches theme and remembers it after reload", async ({ page }) => {
  const html = page.locator("html");
  const before = (await html.getAttribute("data-theme")) ?? "light";
  await page.getByRole("button", { name: /Switch to (dark|light) theme/ }).click();
  const after = await html.getAttribute("data-theme");
  expect(after).not.toBe(before);
  await page.reload();
  await expect(html).toHaveAttribute("data-theme", after!);
});

test("contact form explains what is wrong with empty fields", async ({ page }) => {
  await page.getByRole("button", { name: "Open in my email app" }).click();
  await expect(page.getByText("Enter your name.")).toBeVisible();
  await expect(page.getByText(/Enter a valid email address/)).toBeVisible();
  await expect(page.getByText(/at least 10 characters/)).toBeVisible();
  await expect(page.getByLabel("Your name")).toBeFocused();
});

test("contact form accepts valid input", async ({ page }) => {
  await page.getByLabel("Your name").fill("Asha Recruiter");
  await page.getByLabel("Your email").fill("asha@example.com");
  await page.getByLabel("Message").fill("We'd like to invite you to an interview.");
  await page.getByLabel("Message").blur();
  for (const id of ["cf-name", "cf-email", "cf-message"]) {
    await expect(page.locator(`#${id}-error`)).toHaveText("");
    await expect(page.locator(`#${id}`)).toHaveAttribute("aria-invalid", "false");
  }
});

test("resume download points to a real PDF", async ({ page, request }) => {
  const href = await page.getByRole("link", { name: "Download resume" }).getAttribute("href");
  const res = await request.get(href!);
  expect(res.status()).toBe(200);
  expect(res.headers()["content-type"]).toContain("pdf");
});

test("page never scrolls sideways", async ({ page }) => {
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  expect(overflow).toBeLessThanOrEqual(0);
});
