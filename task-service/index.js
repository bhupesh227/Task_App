import express from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';

const app = express();
const PORT = 3002;
app.use(bodyParser.json());

mongoose.connect('mongodb://mongo:27017/tasks')
    .then(() => {
        console.log('Connected to MongoDB');
    })
    .catch((err) => {
        console.error('Error connecting to MongoDB:', err);
    });

const taskSchema = new mongoose.Schema({
  title: String,
  description: String,
  userId: String, 
  createdAt: { type: Date, default: Date.now },
});

const Task = mongoose.model('Task', taskSchema);

app.get('/tasks', async (req, res) => {
  const tasks = await Task.find();
  res.json(tasks);
});

app.post('/tasks', async (req, res) => {
  const { title, description, userId } = req.body;
  try {
    const newTask = new Task({ title, description, userId });
    await newTask.save();
    res.status(201).json(newTask);
  } catch (error) {
    console.error('Error creating task:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.listen(PORT, () => {
  console.log(`Task service listening on port ${PORT}`);
});


