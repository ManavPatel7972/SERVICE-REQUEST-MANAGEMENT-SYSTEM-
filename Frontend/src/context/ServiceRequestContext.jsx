import { createContext, useContext, useState, useCallback, useEffect } from "react";
import { useAuth } from "./AuthContext";
import { requestAPI, replyAPI } from "../api/services";

const ServiceRequestContext = createContext(null);

export function ServiceRequestProvider({ children }) {
  const { isAuthenticated } = useAuth();
  const [requests, setRequests] = useState([]);
  const [stats, setStats]       = useState({ total: 0, pending: 0, approved: 0, rejected: 0 });
  const [loading, setLoading]   = useState(false);

  const refreshRequests = useCallback(async () => {
    setLoading(true);
    try {
      const [r, s] = await Promise.allSettled([requestAPI.getAll(), requestAPI.getStats()]);
      if (r.status === "fulfilled") setRequests(r.value.data.data || []);
      if (s.status === "fulfilled") setStats(s.value.data.data   || {});
    } finally {
      setLoading(false);
    }
  }, []);

  // Auto-load when user logs in
  useEffect(() => {
    if (isAuthenticated) refreshRequests();
  }, [isAuthenticated]);

  const createRequest  = useCallback(async (data)     => { const r = await requestAPI.create(data);        await refreshRequests(); return r.data.data; }, [refreshRequests]);
  const updateRequest  = useCallback(async (id, data) => { const r = await requestAPI.update(id, data);    await refreshRequests(); return r.data.data; }, [refreshRequests]);
  const deleteRequest  = useCallback(async (id)       => { await requestAPI.delete(id);                    await refreshRequests(); }, [refreshRequests]);
  const assignRequest  = useCallback(async (id, data) => { const r = await requestAPI.assign(id, data);    await refreshRequests(); return r.data.data; }, [refreshRequests]);
  const changeStatus   = useCallback(async (id, data) => { const r = await requestAPI.updateStatus(id,data); await refreshRequests(); return r.data.data; }, [refreshRequests]);
  const approveRequest = useCallback(async (id, data) => { const r = await requestAPI.approve(id, data);   await refreshRequests(); return r.data.data; }, [refreshRequests]);

  const getReplies  = useCallback((requestId) => replyAPI.getByRequest(requestId).then(r => r.data.data), []);
  const addReply    = useCallback(async (data) => { const r = await replyAPI.create(data); return r.data.data; }, []);
  const deleteReply = useCallback(async (id)   => replyAPI.delete(id), []);

  return (
    <ServiceRequestContext.Provider value={{
      requests, stats, loading,
      refreshRequests,
      createRequest, updateRequest, deleteRequest,
      assignRequest, changeStatus, approveRequest,
      getReplies, addReply, deleteReply,
    }}>
      {children}
    </ServiceRequestContext.Provider>
  );
}

export const useServiceRequests = () => useContext(ServiceRequestContext);
