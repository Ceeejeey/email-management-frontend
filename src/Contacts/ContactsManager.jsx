import React, { useState } from 'react';
import { useContacts, useAddContact, useUpdateContact, useDeleteContact } from '../utils/queries';

const ContactsManager = () => {
  const { data: contacts = [], isLoading } = useContacts();
  const addContactMutation = useAddContact();
  const updateContactMutation = useUpdateContact();
  const deleteContactMutation = useDeleteContact();

  const [newContact, setNewContact] = useState({ name: '', email: '' });
  const [editId, setEditId] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewContact((prev) => ({ ...prev, [name]: value }));
  };

  const handleSaveContact = async () => {
    if (!newContact.name || !newContact.email) return;

    try {
      if (editId !== null) {
        await updateContactMutation.mutateAsync({ id: editId, ...newContact });
        setEditId(null);
      } else {
        await addContactMutation.mutateAsync(newContact);
      }
      setNewContact({ name: '', email: '' });
    } catch (error) {
      console.error('Error saving contact:', error);
    }
  };

  const handleDeleteContact = async (id) => {
    try {
      await deleteContactMutation.mutateAsync(id);
    } catch (error) {
      console.error('Error deleting contact:', error);
    }
  };

  const handleEditContact = (contact) => {
    setNewContact({ name: contact.name, email: contact.email });
    setEditId(contact.id);
  };

  if (isLoading) {
    return <div className="p-6 text-center text-gray-400">Loading contacts...</div>;
  }

  return (
    <div className="p-4 md:p-6 bg-card-bg rounded-xl shadow-lg border border-gray-800">
      <h2 className="text-2xl font-bold text-gold mb-2">Manage Individual Contacts</h2>
      <p className="text-gray-400 mb-6">Add, edit, or remove individual contacts here.</p>

      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <input
          type="text"
          name="name"
          placeholder="Name"
          value={newContact.name}
          onChange={handleInputChange}
          required
          className="flex-1 bg-dark-bg border border-gray-700 rounded-lg p-3 text-white focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold transition-colors"
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={newContact.email}
          onChange={handleInputChange}
          required
          className="flex-1 bg-dark-bg border border-gray-700 rounded-lg p-3 text-white focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold transition-colors"
        />
        <button 
          onClick={handleSaveContact}
          disabled={addContactMutation.isPending || updateContactMutation.isPending}
          className="bg-gold text-dark-bg font-bold py-3 px-6 rounded-lg hover:bg-gold-hover transition-colors shadow-md whitespace-nowrap disabled:opacity-50"
        >
          {editId !== null ? 'Update Contact' : 'Add Contact'}
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-gray-700">
              <th className="p-4 text-gold font-semibold">Name</th>
              <th className="p-4 text-gold font-semibold">Email</th>
              <th className="p-4 text-gold font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {contacts.length > 0 ? (
              contacts.map((contact) => (
                <tr key={contact.id} className="border-b border-gray-800 hover:bg-gray-800/50 transition-colors">
                  <td className="p-4 text-gray-300">{contact.name}</td>
                  <td className="p-4 text-gray-300">{contact.email}</td>
                  <td className="p-4 text-right space-x-2">
                    <button 
                      onClick={() => handleEditContact(contact)}
                      className="text-blue-400 hover:text-blue-300 transition-colors px-2 py-1"
                    >
                      Edit
                    </button>
                    <button 
                      onClick={() => handleDeleteContact(contact.id)}
                      className="text-red-400 hover:text-red-300 transition-colors px-2 py-1"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="3" className="p-8 text-center text-gray-500">
                  No contacts available.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ContactsManager;
