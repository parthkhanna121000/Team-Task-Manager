import { useState, useEffect, useCallback } from "react";
import axiosClient from "../api/axiosClient";
import toast from "react-hot-toast";

export const useProjects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchProjects = useCallback(async () => {
    try {
      setLoading(true);
      const { data } = await axiosClient.get("/projects");
      setProjects(data.projects);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to load projects");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  const createProject = async (payload) => {
    const { data } = await axiosClient.post("/projects", payload);
    setProjects((prev) => [data.project, ...prev]);
    return data.project;
  };

  return { projects, loading, fetchProjects, createProject };
};

export const useProject = (projectId) => {
  const [project, setProject] = useState(null);
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchProject = useCallback(async () => {
    try {
      setLoading(true);
      const { data } = await axiosClient.get(`/projects/${projectId}`);
      setProject(data.project);
      setRole(data.role);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to load project");
    } finally {
      setLoading(false);
    }
  }, [projectId]);

  useEffect(() => {
    fetchProject();
  }, [fetchProject]);

  const addMember = async (email) => {
    const { data } = await axiosClient.post(`/projects/${projectId}/members`, {
      email,
    });
    setProject(data.project);
  };

  const removeMember = async (userId) => {
    const { data } = await axiosClient.delete(
      `/projects/${projectId}/members/${userId}`,
    );
    setProject(data.project);
  };

  return { project, role, loading, fetchProject, addMember, removeMember };
};
