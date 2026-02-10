import { describe, it, expect, beforeAll, afterAll, beforeEach } from "vitest";
import request from "supertest";
import { app } from "../app.js";
import { connectTestDB, clearTestDB, disconnectTestDB } from "./setup.js";

const base = "/api/auth";

beforeAll(async () => {
  await connectTestDB();
});

beforeEach(async () => {
  await clearTestDB();
});

afterAll(async () => {
  await disconnectTestDB();
});

describe("Auth endpoints", () => {
  it("register: 201 on valid input", async () => {
    const res = await request(app)
      .post(`${base}/register`)
      .send({ email: "test@test.com", password: "Salasana123" });

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty("id");
    expect(res.body.email).toBe("test@test.com");
  });

  it("register: 409 on duplicate email", async () => {
    await request(app)
      .post(`${base}/register`)
      .send({ email: "test@test.com", password: "Salasana123" });

    const res2 = await request(app)
      .post(`${base}/register`)
      .send({ email: "test@test.com", password: "Salasana123" });

    expect(res2.status).toBe(409);
  });

  it("login: 200 and returns accessToken on valid credentials", async () => {
    await request(app)
      .post(`${base}/register`)
      .send({ email: "test@test.com", password: "Salasana123" });

    const res = await request(app)
      .post(`${base}/login`)
      .send({ email: "test@test.com", password: "Salasana123" });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("accessToken");
  });

  it("login: 401 on wrong password", async () => {
    await request(app)
      .post(`${base}/register`)
      .send({ email: "test@test.com", password: "Salasana123" });

    const res = await request(app)
      .post(`${base}/login`)
      .send({ email: "test@test.com", password: "VääräSalasana123" });

    expect(res.status).toBe(401);
  });
});