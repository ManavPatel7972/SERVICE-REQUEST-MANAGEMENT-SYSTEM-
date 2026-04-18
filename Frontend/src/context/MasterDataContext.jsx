import { createContext, useContext, useState, useCallback, useEffect } from "react";
import { useAuth } from "./AuthContext";
import { deptAPI, serviceTypeAPI, requestTypeAPI, statusAPI, usersAPI, deptPersonAPI, typePersonAPI } from "../api/services";

const MasterDataContext = createContext(null);

export function MasterDataProvider({ children }) {
  const { isAuthenticated } = useAuth();
  const [departments, setDepartments]   = useState([]);
  const [serviceTypes, setServiceTypes] = useState([]);
  const [requestTypes, setRequestTypes] = useState([]);
  const [statuses, setStatuses]         = useState([]);
  const [users, setUsers]               = useState([]);
  const [deptPersons, setDeptPersons]   = useState([]);
  const [typePersons, setTypePersons]   = useState([]);
  const [loading, setLoading]           = useState(false);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const [d, st, rt, s, u, dp, tp] = await Promise.allSettled([
        deptAPI.getAll(), serviceTypeAPI.getAll(), requestTypeAPI.getAll(),
        statusAPI.getAll(), usersAPI.getAll(), deptPersonAPI.getAll(), typePersonAPI.getAll(),
      ]);
      if (d.status  === "fulfilled") setDepartments(d.value.data.data   || []);
      if (st.status === "fulfilled") setServiceTypes(st.value.data.data || []);
      if (rt.status === "fulfilled") setRequestTypes(rt.value.data.data || []);
      if (s.status  === "fulfilled") setStatuses(s.value.data.data      || []);
      if (u.status  === "fulfilled") setUsers(u.value.data.data         || []);
      if (dp.status === "fulfilled") setDeptPersons(dp.value.data.data  || []);
      if (tp.status === "fulfilled") setTypePersons(tp.value.data.data  || []);
    } finally {
      setLoading(false);
    }
  }, []);

  // Auto-load when user logs in
  useEffect(() => {
    if (isAuthenticated) refresh();
  }, [isAuthenticated]);

  // CRUD helpers
  const createDept       = useCallback(async (d)    => { await deptAPI.create(d);           await refresh(); }, [refresh]);
  const updateDept       = useCallback(async (id,d) => { await deptAPI.update(id,d);        await refresh(); }, [refresh]);
  const deleteDept       = useCallback(async (id)   => { await deptAPI.delete(id);           await refresh(); }, [refresh]);

  const createServiceType  = useCallback(async (d)    => { await serviceTypeAPI.create(d);     await refresh(); }, [refresh]);
  const updateServiceType  = useCallback(async (id,d) => { await serviceTypeAPI.update(id,d);  await refresh(); }, [refresh]);
  const deleteServiceType  = useCallback(async (id)   => { await serviceTypeAPI.delete(id);    await refresh(); }, [refresh]);

  const createRequestType  = useCallback(async (d)    => { await requestTypeAPI.create(d);     await refresh(); }, [refresh]);
  const updateRequestType  = useCallback(async (id,d) => { await requestTypeAPI.update(id,d);  await refresh(); }, [refresh]);
  const deleteRequestType  = useCallback(async (id)   => { await requestTypeAPI.delete(id);    await refresh(); }, [refresh]);

  const createStatus     = useCallback(async (d)    => { await statusAPI.create(d);          await refresh(); }, [refresh]);
  const updateStatus     = useCallback(async (id,d) => { await statusAPI.update(id,d);       await refresh(); }, [refresh]);
  const deleteStatus     = useCallback(async (id)   => { await statusAPI.delete(id);         await refresh(); }, [refresh]);

  const createDeptPerson = useCallback(async (d)    => { await deptPersonAPI.create(d);      await refresh(); }, [refresh]);
  const deleteDeptPerson = useCallback(async (id)   => { await deptPersonAPI.delete(id);     await refresh(); }, [refresh]);

  const createTypePerson = useCallback(async (d)    => { await typePersonAPI.create(d);      await refresh(); }, [refresh]);
  const deleteTypePerson = useCallback(async (id)   => { await typePersonAPI.delete(id);     await refresh(); }, [refresh]);

  const createUser       = useCallback(async (d)    => { await usersAPI.create(d);           await refresh(); }, [refresh]);
  const updateUser       = useCallback(async (id,d) => { await usersAPI.update(id,d);        await refresh(); }, [refresh]);
  const deleteUser       = useCallback(async (id)   => { await usersAPI.delete(id);          await refresh(); }, [refresh]);

  return (
    <MasterDataContext.Provider value={{
      departments, serviceTypes, requestTypes, statuses, users, deptPersons, typePersons,
      loading,
      // expose both names so pages work either way
      refresh, refreshMasterData: refresh,
      createDept, updateDept, deleteDept,
      createServiceType, updateServiceType, deleteServiceType,
      createRequestType, updateRequestType, deleteRequestType,
      createStatus, updateStatus, deleteStatus,
      createDeptPerson, deleteDeptPerson,
      createTypePerson, deleteTypePerson,
      createUser, updateUser, deleteUser,
    }}>
      {children}
    </MasterDataContext.Provider>
  );
}

export const useMasterData = () => useContext(MasterDataContext);
