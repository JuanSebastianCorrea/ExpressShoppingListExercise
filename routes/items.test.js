process.env.NODE_ENV = 'test';

const request = require('supertest');

const app = require('../app');
let items = require('../fakeDb');

let takis = { name: 'Takis', price: '2.99' };

beforeEach(function() {
	items.push(takis);
});

afterEach(function() {
	// make sure this mutates, not redifines, cats
	items.length = 0;
});

//////////// GET ALL ITEMS ROUTE TESTS ///////////////
describe('GET /items', () => {
	test('gets all items', async () => {
		const res = await request(app).get('/items');
		expect(res.statusCode).toBe(200);
		expect(res.body).toEqual({ items: [ takis ] });
	});
});

/////////// GET ITEM ROUTE TESTS ///////////////
describe('GET /items/:name', () => {
	test('get item by name', async () => {
		const res = await request(app).get(`/items/${takis.name}`);
		expect(res.statusCode).toBe(200);
		expect(res.body).toEqual({ item: takis });
	});

	test('Responds with 404 for invalid item', async () => {
		const res = await request(app).get('items/Skittles');
		expect(res.statusCode).toBe(404);
	});
});

///////////// POST ROUTE TESTS /////////////////
describe('POST /items', () => {
	test('adds new item', async () => {
		const res = await request(app).post(`/items`).send({ name: 'Tacos', price: 5.99 });
		expect(res.statusCode).toBe(201);
		expect(res.body).toEqual({ item: { name: 'Tacos', price: 5.99 } });
	});

	test('Responds with 400 if name is missing', async () => {
		const res = await request(app).post(`/items`).send({ price: 5.99 });
		expect(res.statusCode).toBe(400);
	});

	test('Responds with 400 if price is missing', async () => {
		const res = await request(app).post(`/items`).send({ name: 'Tacos' });
		expect(res.statusCode).toBe(400);
	});
});

//////////// PATCH ITEM ROUTE TESTS /////////////////////
describe('PATCH /items/:name', () => {
	test('updates item found by name', async () => {
		const res = await request(app).patch(`/items/${takis.name}`).send({ name: 'Tacos', price: 5.99 });
		expect(res.statusCode).toBe(200);
		expect(res.body).toEqual({ item: { name: 'Tacos', price: 5.99 } });
	});

	test('Responds with 404 for invalid item', async () => {
		const res = await request(app).patch(`/items/Cookies`).send({ name: 'Tacos', price: 5.99 });
		expect(res.statusCode).toBe(404);
	});

	test('Responds with 400 if name is missing', async () => {
		const res = await request(app).patch(`/items/${takis.name}`).send({ price: 5.99 });
		expect(res.statusCode).toBe(400);
	});

	test('Responds with 400 if price is missing', async () => {
		const res = await request(app).patch(`/items/${takis.name}`).send({ name: 'Tacos' });
		expect(res.statusCode).toBe(400);
	});
});

/////////// DELETE ITEM ROUTE TESTS ///////////////////
describe('DELETE /items/:name', () => {
	test('deletes item found by name', async () => {
		const res = await request(app).delete(`/items/${takis.name}`);
		expect(res.statusCode).toBe(200);
		expect(res.body).toEqual({ message: 'Deleted' });
	});

	test('Responds with 404 for deleting invalid item', async () => {
		const res = await request(app).delete(`/items/cookies`);
		expect(res.statusCode).toBe(404);
	});
});
