import { afterAll, beforeAll, beforeEach, describe, expect, it } from "vitest";
import request from "supertest";
import { app } from "../src";
import {
    cleanupTestDb,
    createAuthHeader,
    generateAuthToken,
    setupTestDb,
} from "./setup";
import { prisma } from "./setup";

describe("Documents", () => {
    let adminToken: string;
    let userToken: string;
    let testUsers: { admin: any; user: any };

    beforeAll(async () => {
        testUsers = await setupTestDb();
        adminToken = generateAuthToken(testUsers.admin.id);
        userToken = generateAuthToken(testUsers.user.id);
    });

    afterAll(async () => {
        await cleanupTestDb();
    });

    beforeEach(async () => {
        await prisma.document.deleteMany();
    });

    describe("POST /api/documents", () => {
        it("should create a document successfully", async () => {
            const documentData = {
                title: "Test Document",
                content: "Test content",
                type: "CERTIFICATE",
            };

            const res = await request(app)
                .post("/api/documents")
                .set(createAuthHeader(userToken))
                .send(documentData);

            expect(res.status).toBe(201);
            expect(res.body).toMatchObject({
                title: documentData.title,
                content: documentData.content,
                type: documentData.type,
                status: "draft",
            });
        });

        it("should return 400 for invalid input", async () => {
            const res = await request(app)
                .post("/api/documents")
                .set(createAuthHeader(userToken))
                .send({
                    title: "", // Empty title
                    type: "INVALID_TYPE",
                });

            expect(res.status).toBe(400);
            expect(res.body).toHaveProperty("message");
        });

        it("should return 401 without auth token", async () => {
            const res = await request(app)
                .post("/api/documents")
                .send({
                    title: "Test Document",
                    content: "Test content",
                    type: "CERTIFICATE",
                });

            expect(res.status).toBe(401);
        });
    });

    describe("GET /api/documents", () => {
        beforeEach(async () => {
            // Create test documents
            await prisma.document.createMany({
                data: [
                    {
                        title: "User Document 1",
                        content: "Content 1",
                        type: "CERTIFICATE",
                        status: "published",
                        userId: testUsers.user.id,
                    },
                    {
                        title: "User Document 2",
                        content: "Content 2",
                        type: "REPORT",
                        status: "draft",
                        userId: testUsers.user.id,
                    },
                    {
                        title: "Admin Document",
                        content: "Admin Content",
                        type: "CERTIFICATE",
                        status: "published",
                        userId: testUsers.admin.id,
                    },
                ],
            });
        });

        it("should return user documents for regular user", async () => {
            const res = await request(app)
                .get("/api/documents")
                .set(createAuthHeader(userToken));

            expect(res.status).toBe(200);
            expect(Array.isArray(res.body)).toBe(true);
            expect(res.body).toHaveLength(2);
            expect(
                res.body.every((doc: any) => doc.userId === testUsers.user.id),
            ).toBe(true);
        });

        it("should return all documents for admin", async () => {
            const res = await request(app)
                .get("/api/documents")
                .set(createAuthHeader(adminToken));

            expect(res.status).toBe(200);
            expect(Array.isArray(res.body)).toBe(true);
            expect(res.body).toHaveLength(3);
        });

        it("should filter documents by status", async () => {
            const res = await request(app)
                .get("/api/documents")
                .query({ status: "published" })
                .set(createAuthHeader(userToken));

            expect(res.status).toBe(200);
            expect(Array.isArray(res.body)).toBe(true);
            expect(res.body.every((doc: any) => doc.status === "published"))
                .toBe(true);
        });
    });

    describe("GET /api/documents/:id", () => {
        let userDocument: any;
        let adminDocument: any;

        beforeEach(async () => {
            userDocument = await prisma.document.create({
                data: {
                    title: "User Document",
                    content: "User Content",
                    type: "CERTIFICATE",
                    status: "published",
                    userId: testUsers.user.id,
                },
            });

            adminDocument = await prisma.document.create({
                data: {
                    title: "Admin Document",
                    content: "Admin Content",
                    type: "CERTIFICATE",
                    status: "published",
                    userId: testUsers.admin.id,
                },
            });
        });

        it("should return document by id for owner", async () => {
            const res = await request(app)
                .get(`/api/documents/${userDocument.id}`)
                .set(createAuthHeader(userToken));

            expect(res.status).toBe(200);
            expect(res.body).toMatchObject({
                id: userDocument.id,
                title: userDocument.title,
            });
        });

        it("should return document for admin even if not owner", async () => {
            const res = await request(app)
                .get(`/api/documents/${userDocument.id}`)
                .set(createAuthHeader(adminToken));

            expect(res.status).toBe(200);
            expect(res.body).toMatchObject({
                id: userDocument.id,
                title: userDocument.title,
            });
        });

        it("should return 403 for non-owner non-admin user", async () => {
            const res = await request(app)
                .get(`/api/documents/${adminDocument.id}`)
                .set(createAuthHeader(userToken));

            expect(res.status).toBe(403);
        });

        it("should return 404 for non-existent document", async () => {
            const res = await request(app)
                .get("/api/documents/nonexistent-id")
                .set(createAuthHeader(userToken));

            expect(res.status).toBe(404);
        });
    });

    describe("PATCH /api/documents/:id", () => {
        let userDocument: any;

        beforeEach(async () => {
            userDocument = await prisma.document.create({
                data: {
                    title: "Original Title",
                    content: "Original Content",
                    type: "CERTIFICATE",
                    status: "draft",
                    userId: testUsers.user.id,
                },
            });
        });

        it("should update document successfully", async () => {
            const updateData = {
                title: "Updated Title",
                content: "Updated Content",
            };

            const res = await request(app)
                .patch(`/api/documents/${userDocument.id}`)
                .set(createAuthHeader(userToken))
                .send(updateData);

            expect(res.status).toBe(200);
            expect(res.body).toMatchObject(updateData);
        });

        it("should return 403 for non-owner trying to update", async () => {
            const res = await request(app)
                .patch(`/api/documents/${userDocument.id}`)
                .set(createAuthHeader(adminToken))
                .send({ title: "Unauthorized Update" });

            expect(res.status).toBe(403);
        });

        it("should return 400 for invalid update data", async () => {
            const res = await request(app)
                .patch(`/api/documents/${userDocument.id}`)
                .set(createAuthHeader(userToken))
                .send({ status: "INVALID_STATUS" });

            expect(res.status).toBe(400);
        });
    });

    describe("DELETE /api/documents/:id", () => {
        let userDocument: any;

        beforeEach(async () => {
            userDocument = await prisma.document.create({
                data: {
                    title: "To Be Deleted",
                    content: "Delete me",
                    type: "CERTIFICATE",
                    status: "draft",
                    userId: testUsers.user.id,
                },
            });
        });

        it("should delete document successfully", async () => {
            const res = await request(app)
                .delete(`/api/documents/${userDocument.id}`)
                .set(createAuthHeader(userToken));

            expect(res.status).toBe(204);

            const deletedDoc = await prisma.document.findUnique({
                where: { id: userDocument.id },
            });
            expect(deletedDoc).toBeNull();
        });

        it("should return 403 for non-owner trying to delete", async () => {
            const res = await request(app)
                .delete(`/api/documents/${userDocument.id}`)
                .set(createAuthHeader(adminToken));

            expect(res.status).toBe(403);
        });

        it("should return 404 for non-existent document", async () => {
            const res = await request(app)
                .delete("/api/documents/nonexistent-id")
                .set(createAuthHeader(userToken));

            expect(res.status).toBe(404);
        });
    });
});
