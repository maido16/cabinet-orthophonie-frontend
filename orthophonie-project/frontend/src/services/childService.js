import api from './api';

export const getChildren = () => api.get('/patients/children/').then(res => res.data);
export const createChild = (data) => api.post('/patients/children/', data).then(res => res.data);
export const deleteChild = (id) => api.delete(`/patients/children/${id}/`);

export const updateChild = (id, data) => api.patch(`/patients/children/${id}/`, data).then(res => res.data);