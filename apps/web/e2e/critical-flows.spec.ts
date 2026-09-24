import { test, expect } from "@playwright/test";

// End-to-end smoke tests for the most important user flows.
// Requires both the API (port 4000) and web app (port 5173) running,
// with the database migrated and seeded (npm run prisma:seed).

test.describe("Password analyser never contacts the network", () => {
  test("typing a password issues no outgoing requests containing it", async ({ page }) => {
    const requestBodies: string[] = [];
    page.on("request", (req) => {
      const data = req.postData();
      if (data) requestBodies.push(data);
    });

    await page.goto("/login");
    await page.getByLabel("Email").fill("student@localhost.test");
    await page.getByLabel("Password").fill("Student-Demo-2026!");
    await page.getByRole("button", { name: "Log in" }).click();
    await page.waitForURL("**/app");

    await page.goto("/app/analyser");
    const secret = "My-Very-Secret-Passphrase-42!";
    await page.getByLabel("Password to analyse").fill(secret);
    await expect(page.getByText("Password Strength")).toBeVisible();

    for (const body of requestBodies) {
      expect(body).not.toContain(secret);
    }
  });
});

test.describe("Student authentication", () => {
  test("a logged-out user is redirected away from the dashboard", async ({ page }) => {
    await page.goto("/app");
    await page.waitForURL("**/login");
  });

  test("logging in with demo credentials reaches the dashboard", async ({ page }) => {
    await page.goto("/login");
    await page.getByLabel("Email").fill("student@localhost.test");
    await page.getByLabel("Password").fill("Student-Demo-2026!");
    await page.getByRole("button", { name: "Log in" }).click();
    await page.waitForURL("**/app");
    await expect(page.getByText("Welcome back")).toBeVisible();
  });
});

test.describe("Role separation", () => {
  test("a student cannot open an admin page", async ({ page }) => {
    await page.goto("/login");
    await page.getByLabel("Email").fill("student@localhost.test");
    await page.getByLabel("Password").fill("Student-Demo-2026!");
    await page.getByRole("button", { name: "Log in" }).click();
    await page.waitForURL("**/app");

    await page.goto("/admin");
    await page.waitForURL("**/forbidden");
  });
});
