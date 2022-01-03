// imports at the top
const express = require('express');
const Dog = require('./dog-model');

// instance of express app
const server = express();

// global middleware
server.use(express.json());

// [GET] / /api/dogs - fetch all dogs
server.get('/api/dogs', async (req, res) => {
  try {
    // throw new Error('foo');
    const dogs = await Dog.findAll();
    res.json(dogs);
  } catch (err) {
    res.status(500).json({
      message: 'No dogs found ...',
      error: err.message,
    });
  }
});

// [GET] / /api/dogs/:id - fetch dog by id
server.get('/api/dogs/:id', async (req, res) => {
  try {
    const dog = await Dog.findById(`${req.params.id}`);
    if (!dog) {
      res.status(404).json(`No dog found with id ${req.params.id}...`);
    } else {
      res.send(dog);
    }
  } catch (err) {
    res.status(500).json({
      message: `No dogs found ...`,
      error: err.message,
    });
  }
});

// [POST] / /api/dogs - create a new dog from json payload
server.post('/api/dogs', async (req, res) => {
  try {
    if (!req.body.name || !req.body.weight) {
      res.status(400).json({
        message: 'Name and Weight are required ...'
      })
    } else {
      const dog = await Dog.create(req.body);
      res.status(201).json(dog);
    }
  } catch (err) {
    res.status(500).json({
      message: `No dogs created ...`,
      error: err.message,
    });
  }
});

// [PUT] / /api/dogs/:id - update a dog by id
server.put('/api/dogs/:id', async (req, res) => {
  const { id } = req.params;
  const { body } = req;

  try {
    const updated = await Dog.update(id, body);
    if (!updated) {
      res.status(404).json({
        message: `dog by id ${id} does not exist`
      })
    } else {
      res.json(updated)
    }
  } catch (err) {
    res.status(500).json({
      message: `Error updating existing dog ...`,
      error: err.message,
    });
  }
});

// [DELETE] / /api/dogs/:id - delete a dog by id
server.delete('/api/dogs/:id', async (req, res) => {
  const dogId = req.params.id;

  try {
    const dogToDelete = await Dog.delete(dogId);

    if (!dogToDelete) {
      res.status(404).json({
        message:  `dog with id ${dogId} not found ...`
      })
    } else {
      res.status(200).json({
        message: `dog with id ${dogId} deleted ...`,
      })
    }
  } catch (err) {
    console.log(err);
  }
});


// exporting the server to other modules
module.exports = server;