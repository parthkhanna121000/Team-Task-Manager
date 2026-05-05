import { useState, useEffect, useCallback } from "react";
import axiosClient from "../api/axiosClient";
import toast from "react-hot-toast";

export const useTasks = (projectId) => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchTasks = useCallback(async () => {
    if (!projectId) return;
    try {
      setLoading(true);
      const { data } = await axiosClient.get(`/projects/${projectId}/tasks`);
      setTasks(data.tasks);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to load tasks");
    } finally {
      setLoading(false);
    }
  }, [projectId]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const createTask = async (payload) => {
    const { data } = await axiosClient.post(
      `/projects/${projectId}/tasks`,
      payload,
    );
    setTasks((prev) => [data.task, ...prev]);
    return data.task;
  };

  const updateTask = async (taskId, payload) => {
    const { data } = await axiosClient.patch(
      `/projects/${projectId}/tasks/${taskId}`,
      payload,
    );
    setTasks((prev) => prev.map((t) => (t._id === taskId ? data.task : t)));
    return data.task;
  };

  const deleteTask = async (taskId) => {
    await axiosClient.delete(`/projects/${projectId}/tasks/${taskId}`);
    setTasks((prev) => prev.filter((t) => t._id !== taskId));
  };

  return { tasks, loading, fetchTasks, createTask, updateTask, deleteTask };
};

export const useDashboard = (projectId) => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!projectId) return;
    axiosClient
      .get(`/projects/${projectId}/dashboard`)
      .then(({ data }) => setStats(data))
      .catch(() => toast.error("Failed to load dashboard"))
      .finally(() => setLoading(false));
  }, [projectId]);

  return { stats, loading };
};
