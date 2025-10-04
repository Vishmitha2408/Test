import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import api from "../api/client";
import {
  Box, Typography, Avatar, Button, TextField, Paper,
  IconButton, Dialog, DialogTitle, DialogContent, DialogActions,
  Table, TableHead, TableRow, TableCell, TableBody
} from "@mui/material";
import { Delete, Edit } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const { logout, user, token } = useAuth();
  const [profile, setProfile] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [form, setForm] = useState({ title: "", content: "" });
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }

    api.get("/profile", {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => setProfile(res.data))
      .catch(err => {
        console.error("Profile fetch failed:", err);
        logout(); // force logout on token error
      });

    api.get("/tasks", {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => setTasks(res.data))
      .catch(err => console.error("Tasks fetch failed:", err));
  }, [navigate, token, logout]);

  const handleOpen = (task = null) => {
    setEditingTask(task);
    setForm(task ? { title: task.title, content: task.content } : { title: "", content: "" });
    setOpen(true);
  };

  const handleClose = () => setOpen(false);

  const handleSave = async () => {
    try {
      if (editingTask) {
        const res = await api.put(`/tasks/${editingTask._id}`, form, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setTasks(tasks.map(t => (t._id === editingTask._id ? res.data : t)));
      } else {
        const res = await api.post("/tasks", form, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setTasks([res.data, ...tasks]);
      }
      handleClose();
    } catch (err) {
      console.error("Save failed:", err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/tasks/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setTasks(tasks.filter(t => t._id !== id));
    } catch (err) {
      console.error("Delete failed:", err);
    }
  };

  const filtered = tasks.filter(t =>
    t.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Box sx={{ p: 3 }}>
      {/* Profile Section */}
      {profile && (
        <Paper sx={{ p: 2, mb: 3, display: "flex", alignItems: "center", gap: 2 }}>
          <Avatar src={profile.avatarUrl} sx={{ width: 64, height: 64 }} />
          <Box>
            <Typography variant="h6">{profile.name || user?.name}</Typography>
            <Typography>{profile.email || user?.email}</Typography>
            <Typography variant="body2">{profile.bio}</Typography>
          </Box>
          <Box sx={{ ml: "auto" }}>
            <Button variant="outlined" color="error" onClick={logout}>
              Logout
            </Button>
          </Box>
        </Paper>
      )}

      {/* Search + Add */}
      <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
        <TextField
          label="Search tasks"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          fullWidth
        />
        <Button variant="contained" onClick={() => handleOpen()}>
          Add Task
        </Button>
      </Box>

      {/* Tasks Table */}
      <Paper>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Title</TableCell>
              <TableCell>Content</TableCell>
              <TableCell>Status</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filtered.map((task) => (
              <TableRow key={task._id}>
                <TableCell>{task.title}</TableCell>
                <TableCell>{task.content}</TableCell>
                <TableCell>{task.status}</TableCell>
                <TableCell align="right">
                  <IconButton onClick={() => handleOpen(task)}><Edit /></IconButton>
                  <IconButton color="error" onClick={() => handleDelete(task._id)}><Delete /></IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>

      {/* Add/Edit Dialog */}
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>{editingTask ? "Edit Task" : "Add Task"}</DialogTitle>
        <DialogContent>
          <TextField
            label="Title"
            fullWidth
            margin="normal"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
          />
          <TextField
            label="Content"
            fullWidth
            margin="normal"
            value={form.content}
            onChange={(e) => setForm({ ...form, content: e.target.value })}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button variant="contained" onClick={handleSave}>
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}