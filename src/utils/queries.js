import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from './axiosConfig';

// --- User Profile Hooks ---
export const useUserProfile = () => {
  return useQuery({
    queryKey: ['userProfile'],
    queryFn: async () => {
      const { data } = await axios.get('/api/user/profile', { withCredentials: true });
      return data;
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

export const useUpdateProfile = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data) => axios.put('/api/user/profile', data, { withCredentials: true }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userProfile'] });
    },
  });
};

export const useDisconnectGoogle = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => axios.delete('/api/user/profile/google-connection', { withCredentials: true }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userProfile'] });
    },
  });
};

// --- Contacts Hooks ---
export const useContacts = () => {
  return useQuery({
    queryKey: ['contacts'],
    queryFn: async () => {
      const { data } = await axios.get('/api/contacts', { withCredentials: true });
      return data;
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

export const useAddContact = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (newContact) => axios.post('/api/contacts', newContact, { withCredentials: true }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contacts'] });
    },
  });
};

export const useUpdateContact = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...data }) => axios.put(`/api/contacts/${id}`, data, { withCredentials: true }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contacts'] });
    },
  });
};

export const useDeleteContact = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id) => axios.delete(`/api/contacts/${id}`, { withCredentials: true }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contacts'] });
    },
  });
};

// --- Groups Hooks ---
export const useGroups = () => {
  return useQuery({
    queryKey: ['groups'],
    queryFn: async () => {
      const { data } = await axios.get('/api/groups', { withCredentials: true });
      return data;
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

export const useAddGroup = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (newGroup) => axios.post('/api/groups', newGroup, { withCredentials: true }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['groups'] });
    },
  });
};

export const useDeleteGroup = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id) => axios.delete(`/api/groups/${id}`, { withCredentials: true }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['groups'] });
    },
  });
};

export const useUpdateGroup = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...data }) => axios.put(`/api/groups/${id}`, data, { withCredentials: true }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['groups'] });
    },
  });
};

export const useAddContactsToGroup = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ groupId, contactIds }) => 
      axios.post(`/api/groups/${groupId}/contacts`, { contactIds }, { withCredentials: true }),
    onSuccess: (_, { groupId }) => {
      queryClient.invalidateQueries({ queryKey: ['groups'] });
      queryClient.invalidateQueries({ queryKey: ['groupContacts', groupId] });
    },
  });
};

export const useRemoveContactsFromGroup = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ groupId, contactIds }) => 
      axios.delete(`/api/groups/${groupId}/contacts`, { data: { contactIds }, withCredentials: true }),
    onSuccess: (_, { groupId }) => {
      queryClient.invalidateQueries({ queryKey: ['groups'] });
      queryClient.invalidateQueries({ queryKey: ['groupContacts', groupId] });
    },
  });
};

export const useGroupContacts = (groupId) => {
    return useQuery({
        queryKey: ['groupContacts', groupId],
        queryFn: async () => {
            if (!groupId) return [];
            const { data } = await axios.get(`/api/groups/${groupId}/contacts`, { withCredentials: true });
            return data;
        },
        enabled: !!groupId, // Only run if groupId is provided
    });
};

// --- Templates Hooks ---
export const useTemplates = () => {
  return useQuery({
    queryKey: ['templates'],
    queryFn: async () => {
      const { data } = await axios.get('/api/templates', { withCredentials: true });
      return data;
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

export const useAddTemplate = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (formData) => axios.post('/api/templates', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      withCredentials: true,
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['templates'] });
    },
  });
};

export const useUpdateTemplate = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) => axios.put(`/api/templates/${id}`, data, { withCredentials: true }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['templates'] });
    },
  });
};

export const useDeleteTemplate = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id) => axios.delete(`/api/templates/${id}`, { withCredentials: true }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['templates'] });
    },
  });
};

export const useSendEmail = () => {
  return useMutation({
    mutationFn: (emailData) => axios.post('/api/send-email', emailData, { withCredentials: true }),
  });
};
