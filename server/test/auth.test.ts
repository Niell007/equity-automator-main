import { afterAll, beforeAll, describe, expect, it } from "vitest";
import request from "supertest";
import { app } from "../src";
import { cleanupTestDb, setupTestDb, testUsers } from "./setup";

describe("Authentication", () => {
    beforeAll(async () => {
        await setupTestDb();
    });

    afterAll(async () => {
        await cleanupTestDb();
    });

    describe("POST /api/auth/register", () => {
        it("should register a new user successfully", async () => {
            const res = await request(app)
                .post("/api/auth/register")
                .send({
                    email: "new.user@example.com",
                    password: "password123",
                    fullName: "New User",
                });

            expect(res.status).toBe(201);
            expect(res.body).toHaveProperty("token");
            expect(res.body.user).toHaveProperty(
                "email",
                "new.user@example.com",
            );
            expect(res.body.user).not.toHaveProperty("password");
        });

        it("should return 400 for invalid input", async () => {
            const res = await request(app)
                .post("/api/auth/register")
                .send({
                    email: "invalid-email",
                    password: "123", // too short
                });

            expect(res.status).toBe(400);
            expect(res.body).toHaveProperty("message");
        });

        it("should return 409 for duplicate email", async () => {
            const res = await request(app)
                .post("/api/auth/register")
                .send({
                    email: testUsers.user.email,
                    password: "password123",
                    fullName: "Duplicate User",
                });

            expect(res.status).toBe(409);
            expect(res.body).toHaveProperty("message");
        });
    });

    describe("POST /api/auth/login", () => {
        it("should login successfully with correct credentials", async () => {
            const res = await request(app)
                .post("/api/auth/login")
                .send({
                    email: testUsers.user.email,
                    password: testUsers.user.password,
                });

            expect(res.status).toBe(200);
            expect(res.body).toHaveProperty("token");
            expect(res.body.user).toHaveProperty("email", testUsers.user.email);
            expect(res.body.user).not.toHaveProperty("password");
        });

        it("should return 401 for incorrect password", async () => {
            const res = await request(app)
                .post("/api/auth/login")
                .send({
                    email: testUsers.user.email,
                    password: "wrongpassword",
                });

            expect(res.status).toBe(401);
            expect(res.body).toHaveProperty("message");
        });

        it("should return 401 for non-existent user", async () => {
            const res = await request(app)
                .post("/api/auth/login")
                .send({
                    email: "nonexistent@example.com",
                    password: "password123",
                });

            expect(res.status).toBe(401);
            expect(res.body).toHaveProperty("message");
        });
    });

    describe("GET /api/auth/me", () => {
        let userToken: string;

        beforeAll(async () => {
            const res = await request(app)
                .post("/api/auth/login")
                .send({
                    email: testUsers.user.email,
                    password: testUsers.user.password,
                });
            userToken = res.body.token;
        });

        it("should return user profile for authenticated user", async () => {
            const res = await request(app)
                .get("/api/auth/me")
                .set("Authorization", `Bearer ${userToken}`);

            expect(res.status).toBe(200);
            expect(res.body).toHaveProperty("email", testUsers.user.email);
            expect(res.body).not.toHaveProperty("password");
        });

        it("should return 401 without auth token", async () => {
            const res = await request(app).get("/api/auth/me");

            expect(res.status).toBe(401);
            expect(res.body).toHaveProperty("message");
        });

        it("should return 401 with invalid auth token", async () => {
            const res = await request(app)
                .get("/api/auth/me")
                .set("Authorization", "Bearer invalid-token");

            expect(res.status).toBe(401);
            expect(res.body).toHaveProperty("message");
        });
    });
});
