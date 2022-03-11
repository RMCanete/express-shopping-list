process.env.NODE_ENV = "test";
const request = require("supertest");

const app = require("../app");

let items = require("../fakeDb")

let popsicle = {name: "popsicle", price: "$1.45"}

beforeEach(function() {
    items.push(popsicle);
});

afterEach(function() {
    items.length = 0;
});

describe("GET /items", function() {
    test("Get a list of items", async function() {
        const res = await request(app).get(`/items`);
        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual({items: [popsicle]});
    });
});

describe("POST /items", function() {
    test("Creates a new item ", async function() {
        const res = await request(app).post(`/items`).send({name:"cheerios", price: "$3.40"});
        expect(res.statusCode).toBe(201);
        expect(res.body).toEqual({item: {name:"cheerios", price: "$3.40"}});
    });
});

describe("GET /items/:name", function() {
    test("Get an item", async function() {
        const res = await request(app).get(`/items/${popsicle.name}`);
        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual({item: popsicle});
    });
});

describe("PATCH /items/:name", function() {
    test("Updates a single item", async function() {
        const res = await request(app).patch(`/items/${popsicle.name}`).send({ name: "cookie", price: "$2.00"});
        expect(res.statusCode).toBe(200);
        expect(res.body.item).toEqual({foundItem: { name: "cookie", price: "$2.00"}});
    });

    test("Responds with 404 if id invalid", async function() {
        const resp = await request(app).patch(`/items/0`);
        expect(resp.statusCode).toBe(404);
      });
});

describe("DELETE /items/:name", function() {
    test("Deletes an item", async function() {
        const res = await request(app).delete(`/items/${popsicle.name}`);
        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual({message: "Deleted"});
    });
});