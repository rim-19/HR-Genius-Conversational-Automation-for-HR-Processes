import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FiPlus, FiDownload, FiFileText, FiTrash2 } from 'react-icons/fi';
import { toast } from 'react-toastify';

interface Document {
  id: string;
  name: string;
  type: string;
  employee: string;
  createdAt: Date;
  size: string;
}

const Documents: React.FC = () => {
  const [showGenerateModal, setShowGenerateModal] = useState(false);
  const [selectedDocType, setSelectedDocType] = useState('');

  // Mock documents data
  // TODO: connect to /api/documents
  const [documents] = useState<Document[]>([
    {
      id: '1',
      name: 'Employment Certificate - John Doe',
      type: 'Certificate',
      employee: 'John Doe',
      createdAt: new Date('2024-01-15'),
      size: '245 KB',
    },
    {
      id: '2',
      name: 'Salary Update Letter - Jane Smith',
      type: 'Letter',
      employee: 'Jane Smith',
      createdAt: new Date('2024-01-14'),
      size: '189 KB',
    },
    {
      id: '3',
      name: 'Internal Communication - All Staff',
      type: 'Communication',
      employee: 'All Staff',
      createdAt: new Date('2024-01-13'),
      size: '312 KB',
    },
    {
      id: '4',
      name: 'Performance Review - Mike Johnson',
      type: 'Review',
      employee: 'Mike Johnson',
      createdAt: new Date('2024-01-12'),
      size: '428 KB',
    },
  ]);

  const documentTypes = [
    { id: 'certificate', name: 'Employment Certificate', icon: FiFileText },
    { id: 'letter', name: 'Salary Update Letter', icon: FiFileText },
    { id: 'communication', name: 'Internal Communication', icon: FiFileText },
    { id: 'review', name: 'Performance Review', icon: FiFileText },
  ];

  const handleDownload = (doc: Document) => {
    toast.success(`Downloading ${doc.name}...`);
  };

  const handleDelete = (id: string) => {
    toast.error(`Delete functionality - Connect to backend`);
  };

  const handleGenerate = () => {
    if (!selectedDocType) {
      toast.error('Please select a document type');
      return;
    }
    toast.success(`Generating ${selectedDocType}... (Demo)`);
    setShowGenerateModal(false);
    setSelectedDocType('');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Documents</h1>
          <p className="text-sm text-gray-600">
            Generate and manage HR documents with AI assistance
          </p>
        </div>
        <button
          onClick={() => setShowGenerateModal(true)}
          className="btn btn-primary flex items-center space-x-2"
        >
          <FiPlus className="h-5 w-5" />
          <span>Generate Document</span>
        </button>
      </motion.div>

      {/* Documents grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {documents.map((doc, index) => (
          <motion.div
            key={doc.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="card group relative overflow-hidden"
          >
            {/* Document icon */}
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-xl bg-primary-100">
              <FiFileText className="h-8 w-8 text-primary-600" />
            </div>

            {/* Document info */}
            <h3 className="mb-2 text-lg font-semibold text-gray-900">{doc.name}</h3>
            <div className="space-y-1 text-sm text-gray-600">
              <p>
                <span className="font-medium">Type:</span> {doc.type}
              </p>
              <p>
                <span className="font-medium">Employee:</span> {doc.employee}
              </p>
              <p>
                <span className="font-medium">Created:</span>{' '}
                {doc.createdAt.toLocaleDateString()}
              </p>
              <p>
                <span className="font-medium">Size:</span> {doc.size}
              </p>
            </div>

            {/* Actions */}
            <div className="mt-4 flex space-x-2">
              <button
                onClick={() => handleDownload(doc)}
                className="btn btn-outline flex-1 flex items-center justify-center space-x-2"
              >
                <FiDownload className="h-4 w-4" />
                <span>Download</span>
              </button>
              <button
                onClick={() => handleDelete(doc.id)}
                className="btn btn-outline text-red-600 hover:bg-red-50"
              >
                <FiTrash2 className="h-4 w-4" />
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Empty state */}
      {documents.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="card py-12 text-center"
        >
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
            <FiFileText className="h-8 w-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900">No documents yet</h3>
          <p className="mt-1 text-sm text-gray-600">
            Generate your first document to get started
          </p>
        </motion.div>
      )}

      {/* Generate document modal */}
      {showGenerateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl"
          >
            <h2 className="mb-4 text-xl font-semibold text-gray-900">
              Generate New Document
            </h2>
            <p className="mb-4 text-sm text-gray-600">
              Select the type of document you want to generate:
            </p>

            {/* Document type selection */}
            <div className="mb-6 space-y-2">
              {documentTypes.map((type) => (
                <button
                  key={type.id}
                  onClick={() => setSelectedDocType(type.name)}
                  className={`flex w-full items-center space-x-3 rounded-lg border-2 p-3 text-left transition-colors ${
                    selectedDocType === type.name
                      ? 'border-primary-500 bg-primary-50'
                      : 'border-gray-200 hover:border-primary-300'
                  }`}
                >
                  <type.icon className="h-5 w-5 text-primary-600" />
                  <span className="font-medium text-gray-900">{type.name}</span>
                </button>
              ))}
            </div>

            <div className="flex justify-end space-x-2">
              <button
                onClick={() => {
                  setShowGenerateModal(false);
                  setSelectedDocType('');
                }}
                className="btn btn-outline"
              >
                Cancel
              </button>
              <button onClick={handleGenerate} className="btn btn-primary">
                Generate
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default Documents;