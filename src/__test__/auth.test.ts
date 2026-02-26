import "./env.js"; // must be first 
import { describe, it, expect, beforeAll, afterAll, beforeEach } from "vitest";
import request from "supertest";
import { app } from "../app.js";
import { connectTestDB, clearTestDB, disconnectTestDB } from "./setup.js";

const base = "/api/auth";
const workoutsBase = "/api/workouts";

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

describe("Workout id params validation", () => {
  async function createAccessToken() {
    const email = `workout-${Date.now()}@test.com`;
    const password = "Salasana123";

    await request(app)
      .post(`${base}/register`)
      .send({ email, password });

    const loginRes = await request(app)
      .post(`${base}/login`)
      .send({ email, password });

    return loginRes.body.accessToken as string;
  }

  it("GET /api/workouts/:id returns 400 on invalid id format", async () => {
    const accessToken = await createAccessToken();

    const res = await request(app)
      .get(`${workoutsBase}/abc`)
      .set("Authorization", `Bearer ${accessToken}`);

    expect(res.status).toBe(400);
    expect(res.body.error).toBe("Validation error");
    expect(res.body.details).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ path: "id" }),
      ]),
    );
  });

  it("DELETE /api/workouts/:id returns 400 on invalid id format", async () => {
    const accessToken = await createAccessToken();

    const res = await request(app)
      .delete(`${workoutsBase}/invalid-id`)
      .set("Authorization", `Bearer ${accessToken}`);

    expect(res.status).toBe(400);
    expect(res.body.error).toBe("Validation error");
    expect(res.body.details).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ path: "id" }),
      ]),
    );
  });

  it("PUT /api/workouts/:id returns 400 on invalid id format", async () => {
    const accessToken = await createAccessToken();

    const res = await request(app)
      .put(`${workoutsBase}/123`)
      .set("Authorization", `Bearer ${accessToken}`)
      .send({ title: "Updated workout" });

    expect(res.status).toBe(400);
    expect(res.body.error).toBe("Validation error");
  });

  it("GET /api/workouts/:id returns 404 for valid ObjectId format that does not exist", async () => {
    const accessToken = await createAccessToken();
    const nonExistingId = "507f1f77bcf86cd799439011";

    const res = await request(app)
      .get(`${workoutsBase}/${nonExistingId}`)
      .set("Authorization", `Bearer ${accessToken}`);

    expect(res.status).toBe(404);
  });
});
