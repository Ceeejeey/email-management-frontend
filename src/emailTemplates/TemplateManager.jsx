import React, { useState } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { 
  useTemplates, 
  useAddTemplate, 
  useUpdateTemplate, 
  useDeleteTemplate, 
  useContacts, 
  useGroups, 
  useSendEmail 
} from '../utils/queries';

const TemplateManager = () => {
  const { data: templates = [] } = useTemplates();
  const { data: contacts = [] } = useContacts();
  const { data: groups = [] } = useGroups();

  const addTemplateMutation = useAddTemplate();
  const updateTemplateMutation = useUpdateTemplate();
  const deleteTemplateMutation = useDeleteTemplate();
  const sendEmailMutation = useSendEmail();

  const [selectedFile, setSelectedFile] = useState(null);
  const [templateContent, setTemplateContent] = useState('');
  const [editTemplateId, setEditTemplateId] = useState(null);
  const [templateName, setTemplateName] = useState('');
  const [isSendModalOpen, setIsSendModalOpen] = useState(false);
  const [emailSubject, setEmailSubject] = useState('');
  const [emailBody, setEmailBody] = useState('');
  const [selectedRecipients, setSelectedRecipients] = useState([]);

  const toggleContactSelection = (contact) => {
    setSelectedRecipients((prev) =>
      prev.find((c) => c.email === contact.email)
        ? prev.filter((c) => c.email !== contact.email)
        : [...prev, contact]
    );
  };

  const toggleGroupSelection = (groupId) => {
    const group = groups.find((g) => g.id === groupId);
    if (!group || !group.contacts) return;

    const groupContacts = group.contacts;

    setSelectedRecipients((prev) => {
      const emailsInGroup = groupContacts.map((c) => c.email);
      const alreadySelected = prev.some((c) => emailsInGroup.includes(c.email));

      return alreadySelected
        ? prev.filter((c) => !emailsInGroup.includes(c.email))
        : [...prev, ...groupContacts.filter((c) => !prev.some((p) => p.email === c.email))];
    });
  };

  const handleFileUpload = (e) => {
    if (!e.target.files || e.target.files.length === 0) {
      console.error("No file selected");
      return;
    }
  
    const file = e.target.files[0];
  
    if (!file) {
      console.error("Invalid file");
      return;
    }
  
    setSelectedFile(file);
    setTemplateName(file.name);
  
    const reader = new FileReader();
    reader.onload = (event) => {
      setTemplateContent(event.target.result);
    };
  
    reader.readAsText(file);
  };
  

  const handleSaveTemplate = async () => {
    if (!templateName || !templateContent) {
      alert('Template name and content are required!');
      return;
    }

    try {
      if (editTemplateId) {
        await updateTemplateMutation.mutateAsync({
          id: editTemplateId,
          data: {
            name: templateName,
            content: templateContent,
          }
        });
      } else {
        const formData = new FormData();
        formData.append('file', selectedFile);
        formData.append('name', templateName);
        formData.append('content', templateContent);

        await addTemplateMutation.mutateAsync(formData);
      }

      setSelectedFile(null);
      setTemplateName('');
      setTemplateContent('');
      setEditTemplateId(null);
    } catch (error) {
      console.error('Error saving template:', error);
    }
  };

  const handleEditTemplate = (template) => {
    setTemplateName(template.name);
    setTemplateContent(template.content);
    setEditTemplateId(template.id);
  };

  const handleDeleteTemplate = async (templateId) => {
    try {
      await deleteTemplateMutation.mutateAsync(templateId);
    } catch (error) {
      console.error('Error deleting template:', error);
    }
  };

  const handleSendTemplate = (template) => {
    setEmailSubject(template.name);
    setEmailBody(template.content);
    setIsSendModalOpen(true);
    // Reset recipients when opening modal? Or keep previous selection?
    // Usually better to start fresh or keep state if intended. 
    // The original code didn't reset, but it fetched contacts/groups on open.
    // We'll keep current state behavior but ensure contacts/groups are available via hooks.
  };

  const handleSendEmail = async (recipients, subject, body) => {
    try {
      await sendEmailMutation.mutateAsync({
        recipients,
        subject,
        body
      });

      console.log('Email sent successfully');
      toast.success('✅ Email sent successfully!', { position: 'top-right' });
      setIsSendModalOpen(false);

    } catch (error) {
      console.error('Error sending email:', error);
      toast.error('❌ Failed to send email. Please try again.', { position: 'top-right' });
    }
  };

  return (
    <div className="p-4 md:p-6 bg-card-bg rounded-xl shadow-lg border border-gray-800">
      <h2 className="text-2xl font-bold text-gold mb-2">Template Manager</h2>
      <p className="text-gray-400 mb-6">Upload, edit, view, or delete templates.</p>

      {/* Drag-and-Drop File Upload */}
      <div className="mb-6 space-y-4">
        <div
          className="border-2 border-dashed border-gray-600 rounded-lg p-4 md:p-8 text-center cursor-pointer hover:border-gold hover:bg-gray-800/50 transition-colors text-gray-400"
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => {
            e.preventDefault();
            const file = e.dataTransfer.files[0];
            handleFileUpload({ target: { files: [file] } });
          }}
          onClick={() => document.getElementById("fileInput").click()}
        >
          Drag & Drop your template file here or click to upload
        </div>

        <input
          id="fileInput"
          type="file"
          accept=".txt,.docx"
          onChange={handleFileUpload}
          className="hidden"
        />

        <input
          type="text"
          placeholder="Template Name"
          value={templateName}
          onChange={(e) => setTemplateName(e.target.value)}
          className="w-full bg-dark-bg border border-gray-700 rounded-lg p-3 text-white focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold transition-colors"
        />
      </div>

      {/* Template Editor */}
      <textarea
        placeholder="Template Content"
        value={templateContent}
        onChange={(e) => setTemplateContent(e.target.value)}
        rows="10"
        className="w-full bg-dark-bg border border-gray-700 rounded-lg p-3 text-white focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold transition-colors mb-4 font-mono text-sm"
      />

      <button 
        onClick={handleSaveTemplate} 
        className="w-full bg-gold text-dark-bg font-bold py-3 rounded-lg hover:bg-gold-hover transition-colors shadow-md mb-8"
      >
        {editTemplateId ? 'Update Template' : 'Save Template'}
      </button>

      {/* Templates List - Desktop Table */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[500px]">
          <thead>
            <tr className="border-b border-gray-700">
              <th className="p-3 md:p-4 text-gold font-semibold">Template Name</th>
              <th className="p-3 md:p-4 text-gold font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {templates.length > 0 ? (
              templates.map((template) => (
                <tr key={template.id} className="border-b border-gray-800 hover:bg-gray-800/50 transition-colors">
                  <td className="p-3 md:p-4 text-gray-300">{template.name}</td>
                  <td className="p-3 md:p-4 text-right space-x-2 whitespace-nowrap">
                    <button 
                      onClick={() => handleEditTemplate(template)} 
                      className="text-blue-400 hover:text-blue-300 transition-colors px-2 py-1"
                    >
                      Edit
                    </button>
                    <button 
                      onClick={() => handleDeleteTemplate(template.id)} 
                      className="text-red-400 hover:text-red-300 transition-colors px-2 py-1"
                    >
                      Delete
                    </button>
                    <button 
                      onClick={() => handleSendTemplate(template)} 
                      className="text-green-400 hover:text-green-300 transition-colors px-2 py-1"
                    >
                      Send
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="2" className="p-8 text-center text-gray-500">No templates available.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Templates List - Mobile Card View */}
      <div className="md:hidden space-y-4">
        {templates.length > 0 ? (
          templates.map((template) => (
            <div key={template.id} className="bg-dark-bg p-4 rounded-lg border border-gray-700 shadow-sm">
              <div className="mb-3">
                <h3 className="text-gold font-semibold text-lg">{template.name}</h3>
              </div>
              
              <div className="flex justify-end gap-3 pt-3 border-t border-gray-700">
                <button 
                  onClick={() => handleEditTemplate(template)} 
                  className="text-blue-400 hover:text-blue-300 text-sm font-medium px-2 py-1"
                >
                  Edit
                </button>
                <button 
                  onClick={() => handleDeleteTemplate(template.id)} 
                  className="text-red-400 hover:text-red-300 text-sm font-medium px-2 py-1"
                >
                  Delete
                </button>
                <button 
                  onClick={() => handleSendTemplate(template)} 
                  className="text-green-400 hover:text-green-300 text-sm font-medium px-2 py-1"
                >
                  Send
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="p-8 text-center text-gray-500 bg-dark-bg rounded-lg border border-gray-700">
            No templates available.
          </div>
        )}
      </div>

      {/* Extra Spacer for Mobile Bottom Nav */}
      <div className="h-24 md:hidden"></div>
    </div>
  );
};

export default TemplateManager;

      {isSendModalOpen && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-card-bg rounded-2xl shadow-2xl w-full max-w-5xl h-[90vh] flex flex-col md:flex-row overflow-hidden border border-gray-800">

            {/* Left Column: Email Content & Selected Recipients */}
            <div className="flex-1 p-4 md:p-6 border-b md:border-b-0 md:border-r border-gray-700 overflow-y-auto">
              <h3 className="text-xl font-bold text-gold mb-4">Send Email</h3>

              <div className="space-y-4">
                <input
                  type="text"
                  placeholder="Email Subject"
                  value={emailSubject}
                  onChange={(e) => setEmailSubject(e.target.value)}
                  className="w-full bg-dark-bg border border-gray-700 rounded-lg p-3 text-white focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold transition-colors"
                />

                <textarea
                  placeholder="Email Body"
                  value={emailBody}
                  onChange={(e) => setEmailBody(e.target.value)}
                  className="w-full h-40 md:h-64 bg-dark-bg border border-gray-700 rounded-lg p-3 text-white focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold transition-colors font-mono text-sm"
                />

                <div>
                  <h4 className="text-gray-400 font-medium mb-2">Selected Recipients:</h4>
                  <div className="flex flex-wrap gap-2 max-h-24 md:max-h-32 overflow-y-auto p-2 bg-dark-bg rounded-lg border border-gray-700">
                    {selectedRecipients.length > 0 ? (
                      selectedRecipients.map((contact) => (
                        <span key={contact.email} className="bg-gray-700 text-gray-200 px-2 py-1 rounded text-xs flex items-center gap-1">
                          {contact.name}
                          <span className="text-gray-400 text-[10px]">({contact.email})</span>
                        </span>
                      ))
                    ) : (
                      <span className="text-gray-500 text-sm">No recipients selected</span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Contacts & Groups Selection */}
            <div className="w-full md:w-80 p-4 md:p-6 bg-gray-900/50 flex flex-col h-1/2 md:h-full border-t md:border-t-0 border-gray-700">
              <div className="flex-1 overflow-y-auto space-y-6 pr-2">
                {/* Contacts Selection */}
                <div>
                  <h4 className="text-gold font-medium mb-2 sticky top-0 bg-gray-900/95 py-1 z-10">Select Contacts</h4>
                  <div className="space-y-1">
                    {contacts.map((contact) => (
                      <label key={contact.id} className="flex items-center gap-2 p-2 hover:bg-gray-800 rounded cursor-pointer">
                        <input
                          type="checkbox"
                          checked={selectedRecipients.some((c) => c.email === contact.email)}
                          onChange={() => toggleContactSelection(contact)}
                          className="w-4 h-4 text-gold rounded border-gray-600 focus:ring-gold bg-gray-700"
                        />
                        <span className="text-gray-300 text-sm truncate">
                          {contact.name} <span className="text-gray-500 text-xs">({contact.email})</span>
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Groups Selection */}
                <div>
                  <h4 className="text-gold font-medium mb-2 sticky top-0 bg-gray-900/95 py-1 z-10">Select Groups</h4>
                  <div className="space-y-1">
                    {groups.map((group) => (
                      <label key={group.id} className="flex items-center gap-2 p-2 hover:bg-gray-800 rounded cursor-pointer">
                        <input 
                          type="checkbox" 
                          onChange={() => toggleGroupSelection(group.id)} 
                          className="w-4 h-4 text-gold rounded border-gray-600 focus:ring-gold bg-gray-700"
                        />
                        <span className="text-gray-300 text-sm truncate">{group.name}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              {/* Buttons */}
              <div className="mt-4 flex flex-col gap-3 pt-4 border-t border-gray-700 shrink-0">
                <button 
                  onClick={() => handleSendEmail(selectedRecipients.map((c) => c.email), emailSubject, emailBody)}
                  className="w-full bg-gold text-dark-bg font-bold py-3 rounded-lg hover:bg-gold-hover transition-colors shadow-md"
                >
                  Send Email
                </button>
                <button 
                  onClick={() => setIsSendModalOpen(false)}
                  className="w-full bg-gray-700 text-white font-bold py-3 rounded-lg hover:bg-gray-600 transition-colors shadow-md"
                >
                  Cancel
                </button>
              </div>
            </div>

          </div>
        </div>
      )}
    </div>
  );
};

export default TemplateManager;
