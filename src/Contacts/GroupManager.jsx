import React, { useState } from 'react';
import Modal from 'react-modal';
import { 
  useGroups, 
  useAddGroup, 
  useDeleteGroup, 
  useUpdateGroup, 
  useContacts, 
  useAddContactsToGroup, 
  useRemoveContactsFromGroup 
} from '../utils/queries';

const GroupsManager = () => {
  const { data: groups = [], isLoading: isGroupsLoading } = useGroups();
  const { data: contacts = [] } = useContacts();
  
  const addGroupMutation = useAddGroup();
  const updateGroupMutation = useUpdateGroup();
  const deleteGroupMutation = useDeleteGroup();
  const addContactsMutation = useAddContactsToGroup();
  const removeContactsMutation = useRemoveContactsFromGroup();

  const [groupForm, setGroupForm] = useState({
    name: '',
    description: '',
    contactIds: [],
  });
  const [editGroupId, setEditGroupId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Open the modal for creating or editing a group
  const openModal = (group = null) => {
    if (group) {
      setEditGroupId(group.id);
      setGroupForm({
        name: group.name,
        description: group.description || '',
        contactIds: group.contacts ? group.contacts.map((contact) => contact.id) : [], 
      });
    } else {
      setEditGroupId(null);
      setGroupForm({ name: '', description: '', contactIds: [] }); 
    }
    setIsModalOpen(true); 
  };

  // Close the modal
  const closeModal = () => {
    setIsModalOpen(false);
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setGroupForm((prev) => ({ ...prev, [name]: value }));
  };

  // Handle contact selection (checkbox toggle)
  const handleContactSelection = (contactId) => {
    setGroupForm((prev) => {
      const alreadySelected = prev.contactIds.includes(contactId);
      const updatedContactIds = alreadySelected
        ? prev.contactIds.filter((id) => id !== contactId) 
        : [...prev.contactIds, contactId]; 
      return { ...prev, contactIds: updatedContactIds };
    });
  };

  // Save a new group or update an existing one
  const handleSaveGroup = async () => {
    if (!groupForm.name) return alert('Group name is required.');

    try {
      if (editGroupId) {
        // Update the group details
        await updateGroupMutation.mutateAsync({
          id: editGroupId,
          name: groupForm.name,
          description: groupForm.description,
        });

        // Find the original group to compare contacts
        const originalGroup = groups.find(g => g.id === editGroupId);
        const originalContactIds = originalGroup?.contacts?.map(c => c.id) || [];
        const newContactIds = groupForm.contactIds;

        // Determine contacts to add and remove
        const contactsToRemove = originalContactIds.filter(id => !newContactIds.includes(id));
        const contactsToAdd = newContactIds.filter(id => !originalContactIds.includes(id));

        if (contactsToRemove.length > 0) {
          await removeContactsMutation.mutateAsync({
            groupId: editGroupId,
            contactIds: contactsToRemove
          });
        }

        if (contactsToAdd.length > 0) {
          await addContactsMutation.mutateAsync({
            groupId: editGroupId,
            contactIds: contactsToAdd
          });
        }

      } else {
        // Create a new group
        const newGroup = await addGroupMutation.mutateAsync({
            name: groupForm.name,
            description: groupForm.description,
        });

        // Add selected contacts to the new group
        if (groupForm.contactIds.length > 0) {
          await addContactsMutation.mutateAsync({
            groupId: newGroup.data.id, // Ensure backend returns the created group object with id
            contactIds: groupForm.contactIds
          });
        }
      }

      // Reset form and close modal
      setGroupForm({ name: '', description: '', contactIds: [] });
      setEditGroupId(null);
      closeModal();
    } catch (error) {
      console.error('Error saving group:', error);
    }
  };

  // Edit group handler
  const handleEditGroup = (group) => {
    openModal(group);
  };

  // Delete a group
  const handleDeleteGroup = async (groupId) => {
    if (window.confirm('Are you sure you want to delete this group?')) {
      try {
        await deleteGroupMutation.mutateAsync(groupId);
      } catch (error) {
        console.error('Error deleting group:', error);
      }
    }
  };

  if (isGroupsLoading) {
    return <div className="p-6 text-center text-gray-400">Loading groups...</div>;
  }

  return (
    <div className="p-4 md:p-6 bg-card-bg rounded-xl shadow-lg border border-gray-800">
      <h2 className="text-2xl font-bold text-gold mb-2">Manage Groups</h2>
      <p className="text-gray-400 mb-6">Create, edit, or remove groups and assign contacts to them.</p>

      <button 
        onClick={() => openModal()} 
        className="bg-gold text-dark-bg font-bold py-2 px-6 rounded-lg hover:bg-gold-hover transition-colors shadow-md mb-6"
      >
        Create Group
      </button>

      {/* Groups List - Desktop Table */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[700px]">
          <thead>
            <tr className="border-b border-gray-700">
              <th className="p-3 md:p-4 text-gold font-semibold">Group Name</th>
              <th className="p-3 md:p-4 text-gold font-semibold">Description</th>
              <th className="p-3 md:p-4 text-gold font-semibold">Contacts</th>
              <th className="p-3 md:p-4 text-gold font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {groups.length > 0 ? (
              groups.map((group) => (
                <tr key={group.id} className="border-b border-gray-800 hover:bg-gray-800/50 transition-colors">
                  <td className="p-3 md:p-4 text-gray-300">{group.name}</td>
                  <td className="p-3 md:p-4 text-gray-300">{group.description || 'No description'}</td>
                  <td className="p-3 md:p-4 text-gray-300">
                    {group.contacts && group.contacts.length > 0
                      ? group.contacts.map((c) => c.name).join(', ')
                      : 'No contacts'}
                  </td>
                  <td className="p-3 md:p-4 text-right space-x-2 whitespace-nowrap">
                    <button 
                      onClick={() => handleEditGroup(group)}
                      className="text-blue-400 hover:text-blue-300 transition-colors px-2 py-1"
                    >
                      Edit
                    </button>
                    <button 
                      onClick={() => handleDeleteGroup(group.id)}
                      className="text-red-400 hover:text-red-300 transition-colors px-2 py-1"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="p-8 text-center text-gray-500">
                  No groups available.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Groups List - Mobile Card View */}
      <div className="md:hidden space-y-4">
        {groups.length > 0 ? (
          groups.map((group) => (
            <div key={group.id} className="bg-dark-bg p-4 rounded-lg border border-gray-700 shadow-sm">
              <div className="mb-3">
                <h3 className="text-gold font-semibold text-lg">{group.name}</h3>
                <p className="text-gray-400 text-sm mt-1">{group.description || 'No description'}</p>
              </div>
              
              <div className="mb-4">
                <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Contacts</h4>
                <p className="text-gray-300 text-sm">
                  {group.contacts && group.contacts.length > 0
                    ? group.contacts.map((c) => c.name).join(', ')
                    : 'No contacts'}
                </p>
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-gray-700">
                <button 
                  onClick={() => handleEditGroup(group)}
                  className="text-blue-400 hover:text-blue-300 text-sm font-medium px-2 py-1"
                >
                  Edit
                </button>
                <button 
                  onClick={() => handleDeleteGroup(group.id)}
                  className="text-red-400 hover:text-red-300 text-sm font-medium px-2 py-1"
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="p-8 text-center text-gray-500 bg-dark-bg rounded-lg border border-gray-700">
            No groups available.
          </div>
        )}
      </div>

      {/* Modal for Create/Edit Group */}
      <Modal
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        contentLabel="Group Modal"
        className="bg-card-bg p-4 md:p-6 rounded-xl shadow-2xl border border-gray-700 max-w-lg w-full mx-auto mt-4 md:mt-20 outline-none max-h-[90vh] overflow-y-auto"
        overlayClassName="fixed inset-0 bg-black/70 flex justify-center items-start z-50 p-4"
      >
        <h2 className="text-2xl font-bold text-gold mb-4">{editGroupId ? 'Edit Group' : 'Create Group'}</h2>
        
        <div className="space-y-4">
          <div>
            <label className="block text-gray-400 mb-1">Group Name</label>
            <input
              type="text"
              name="name"
              value={groupForm.name}
              onChange={handleInputChange}
              className="w-full p-2 bg-dark-bg border border-gray-700 rounded text-gray-200 focus:border-gold focus:outline-none"
              placeholder="Enter group name"
            />
          </div>
          
          <div>
            <label className="block text-gray-400 mb-1">Description</label>
            <textarea
              name="description"
              value={groupForm.description}
              onChange={handleInputChange}
              className="w-full p-2 bg-dark-bg border border-gray-700 rounded text-gray-200 focus:border-gold focus:outline-none"
              placeholder="Enter description"
              rows="3"
            />
          </div>

          <div>
            <label className="block text-gray-400 mb-2">Select Contacts</label>
            <div className="max-h-40 overflow-y-auto border border-gray-700 rounded p-2 bg-dark-bg">
              {contacts.length > 0 ? (
                contacts.map((contact) => (
                  <div key={contact.id} className="flex items-center mb-2 last:mb-0">
                    <input
                      type="checkbox"
                      id={`contact-${contact.id}`}
                      checked={groupForm.contactIds.includes(contact.id)}
                      onChange={() => handleContactSelection(contact.id)}
                      className="mr-2 accent-gold"
                    />
                    <label htmlFor={`contact-${contact.id}`} className="text-gray-300 cursor-pointer select-none">
                      {contact.name} ({contact.email})
                    </label>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-sm">No contacts available.</p>
              )}
            </div>
          </div>
        </div>

        <div className="flex justify-end space-x-3 mt-6">
          <button 
            onClick={closeModal}
            className="px-4 py-2 text-gray-400 hover:text-white transition-colors"
          >
            Cancel
          </button>
          <button 
            onClick={handleSaveGroup}
            className="px-6 py-2 bg-gold text-dark-bg font-bold rounded hover:bg-gold-hover transition-colors"
          >
            Save
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default GroupsManager;
