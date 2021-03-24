const express = require('express');
const router = new express.Router();
const ExpressError = require('../expressError');
const items = require('../fakeDb');

router.get('/', function(req, res) {
	res.json({ items });
});

router.get('/:name', function(req, res) {
	const foundItem = items.find((i) => i.name === req.params.name);
	if (foundItem === undefined) {
		throw new ExpressError('Item not found', 404);
	}
	res.json({ item: foundItem });
});

router.post('/', function(req, res, next) {
	try {
		if (!req.body.name) throw new ExpressError('Name required', 400);
		if (!req.body.price) throw new ExpressError('Price required', 400);
		const newItem = { name: req.body.name, price: req.body.price };
		items.push(newItem);
		res.status(201).json({ item: newItem });
	} catch (e) {
		next(e);
	}
});

router.patch('/:name', function(req, res, next) {
	const foundItem = items.find((i) => i.name === req.params.name);
	if (foundItem === undefined) throw new ExpressError('Item not found', 404);
	try {
		if (!req.body.name) throw new ExpressError('Name required', 400);
		if (!req.body.price) throw new ExpressError('Price required', 400);
		foundItem.name = req.body.name;
		foundItem.price = req.body.price;
		res.json({ item: foundItem });
	} catch (e) {
		next(e);
	}
});

router.delete('/:name', function(req, res, next) {
	const foundItem = items.findIndex((i) => i.name === req.params.name);
	if (foundItem === -1) throw new ExpressError('Item not found', 404);
	items.splice(foundItem, 1);
	res.json({ message: 'Deleted' });
});

module.exports = router;
