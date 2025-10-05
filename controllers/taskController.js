import Task from '../models/Task.js';

export const getTasks = async (req, res) => {
  const tasks = await Task.find({ userId: req.user._id }).sort({ createdAt: -1 });
  res.json(tasks);
};

export const createTask = async (req, res) => {
  const { title, content, status } = req.body;
  const task = await Task.create({ userId: req.user._id, title, content, status });
  res.status(201).json(task);
};

export const updateTask = async (req, res) => {
  const { title, content, status } = req.body;
  const task = await Task.findOneAndUpdate(
    { _id: req.params.id, userId: req.user._id },
    { title, content, status },
    { new: true }
  );
  if (!task) return res.status(404).json({ message: 'Task not found' });
  res.json(task);
};

export const deleteTask = async (req, res) => {
  const task = await Task.findOneAndDelete({ _id: req.params.id, userId: req.user._id });
  if (!task) return res.status(404).json({ message: 'Task not found' });
  res.status(204).send();
};