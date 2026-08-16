import { describe, it, expect } from "vitest";
import request from "supertest";
import app from "../src/app";

// Integration tests hit the real (virtual) dev database.
// They rely on the seeded ADMIN account.
const ADMIN = { email: "elrhezzalrim@gmail.com", password: "Password123!" };

async function loginAdmin(): Promise<string> {
  const res = await request(app).post("/api/auth/login").send(ADMIN);
  return res.body.token;
}

describe("POST /api/auth/login", () => {
  it("rejects invalid credentials with 401", async () => {
    const res = await request(app).post("/api/auth/login").send({ email: ADMIN.email, password: "wrong" });
    expect(res.status).toBe(401);
  });

  it("returns a token for valid credentials", async () => {
    const res = await request(app).post("/api/auth/login").send(ADMIN);
    expect(res.status).toBe(200);
    expect(res.body.token).toBeTruthy();
    expect(res.body.user.role).toBe("ADMIN");
  });
});

describe("/api/ai/history", () => {
  it("requires authentication", async () => {
    const res = await request(app).get("/api/ai/history");
    expect(res.status).toBe(401);
  });

  it("returns an array for an authenticated user", async () => {
    const token = await loginAdmin();
    const res = await request(app).get("/api/ai/history").set("Authorization", `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });
});
