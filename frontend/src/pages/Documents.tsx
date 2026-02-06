import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FiPlus, FiDownload, FiFileText, FiTrash2 } from "react-icons/fi";
import { toast } from "react-toastify";
import { useAuth } from "../context/AuthContext";
import { UserRole } from "../utils/roles";
import { documentsAPI } from "../services/api";

interface Document {
  id: string;
  title: string;
  type: string;
  employee: { name: string };
  createdAt: string;
}

const Documents: React.FC = () => {
  const { user } = useAuth();
  const [showGenerateModal, setShowGenerateModal] = useState(false);
  const [selectedDocType, setSelectedDocType] = useState("");
  const [documents, setDocuments] = useState<Document[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const canGenerateDocuments =
    user?.role === UserRole.HR || user?.role === UserRole.ADMIN;

  const isEmployee = user?.role === UserRole.EMPLOYEE;

  const fetchDocuments = async () => {
    setIsLoading(true);
    try {
      const response = await documentsAPI.getAll();
      setDocuments(response.data);
    } catch (error) {
      console.error("Error fetching documents:", error);
      toast.error("Failed to load documents");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, []);

  const documentTypes = [
    { id: "certificate", name: "Employment Certificate", icon: FiFileText },
    { id: "letter", name: "Salary Update Letter", icon: FiFileText },
    { id: "communication", name: "Internal Communication", icon: FiFileText },
    { id: "review", name: "Performance Review", icon: FiFileText },
  ];

  const handleDownload = async (doc: Document) => {
    try {
      const response = await documentsAPI.download(doc.id);
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${doc.title}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error("Error downloading file:", error);
      toast.error("Download failed");
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this document?")) return;
    try {
      await documentsAPI.delete(id);
      toast.success("Document deleted");
      fetchDocuments();
    } catch (error) {
      toast.error("Delete failed");
    }
  };

  const handleGenerate = () => {
    if (!selectedDocType) {
      toast.error("Please select a document type");
      return;
    }
    // Redirect to assistant for guided generation or handle here
    toast.info(`Please ask the AI Assistant to generate a ${selectedDocType}`);
    setShowGenerateModal(false);
    setSelectedDocType("");
  };

  return (
    <div className="space-y-6">
      {/* 
        Container principal de la page Documents
        - space-y-6: espacement vertical de 24px entre les sections
      */}
      {/* 
        En-tête de la page avec titre et bouton d'action
        - Animation d'entrée depuis le haut avec Framer Motion
        - Description qui change selon le rôle de l'utilisateur
      */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        {/* Titre et description */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Documents</h1>
          {/* 
            Description conditionnelle selon le rôle:
            - Employés: peuvent voir et demander leurs documents
            - Autres: peuvent générer et gérer les documents
          */}
          <p className="text-sm text-gray-600">
            {isEmployee
              ? "View and request your personal documents"
              : "Generate and manage HR documents with AI assistance"}
          </p>
        </div>
        {/* 
          Bouton de génération - Visible uniquement pour ADMIN et HR
          - Ouvre la modale de génération de document
        */}
        {canGenerateDocuments && (
          <button
            onClick={() => setShowGenerateModal(true)}
            className="btn btn-primary flex items-center space-x-2"
          >
            <FiPlus className="h-5 w-5" />
            <span>Generate Document</span>
          </button>
        )}
        {/* 
          Bouton de demande - Visible uniquement pour les employés
          - Ouvre la modale pour demander un document
        */}
        {isEmployee && (
          <button
            onClick={() => setShowGenerateModal(true)}
            className="btn btn-primary flex items-center space-x-2"
          >
            <FiPlus className="h-5 w-5" />
            <span>Request Document</span>
          </button>
        )}
      </motion.div>

      {/* 
        Grille d'affichage des documents
        - grid: layout en grille responsive
        - gap-6: espacement de 24px entre les cartes
        - sm:grid-cols-2: 2 colonnes sur petits écrans et plus
        - lg:grid-cols-3: 3 colonnes sur grands écrans et plus
      */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {/* 
          Parcours de tous les documents et affichage en cartes
          Chaque carte est animée avec un délai progressif pour un effet en cascade
        */}
        {documents.map((doc, index) => (
          <motion.div
            key={doc.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="card group relative overflow-hidden"
          >
            {/* 
              Carte de document avec animation d'entrée
              - key={doc.id}: identifiant unique pour React
              - initial: état initial (invisible, légèrement en bas)
              - animate: état animé (visible, position normale)
              - transition: délai progressif (0.1s * index) pour l'effet en cascade
              - card: classe personnalisée pour le style de carte
              - group: permet les effets hover sur les enfants
              - relative: pour positionner les éléments absolus
            */}

            {/* 
              Icône du document
              - h-16 w-16: taille de 64px x 64px
              - bg-primary-100: fond de couleur primaire claire
              - rounded-xl: coins très arrondis
            */}
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-xl bg-primary-100">
              <FiFileText className="h-8 w-8 text-primary-600" />
            </div>

            {/* 
              Informations du document
              - Nom, type, employé, date de création
            */}
            <h3 className="mb-2 text-lg font-semibold text-gray-900">
              {doc.title}
            </h3>
            <div className="space-y-1 text-sm text-gray-600">
              {/* Type de document */}
              <p>
                <span className="font-medium">Type:</span> {doc.type}
              </p>
              {/* Employé concerné */}
              <p>
                <span className="font-medium">Employee:</span> {doc.employee?.name || 'All Staff'}
              </p>
              {/* Date de création formatée */}
              <p>
                <span className="font-medium">Created:</span>{" "}
                {new Date(doc.createdAt).toLocaleDateString()}
              </p>
            </div>

            {/* 
              Boutons d'action pour chaque document
              - mt-4: marge supérieure de 16px
              - flex space-x-2: layout flexible avec espacement horizontal
            */}
            <div className="mt-4 flex space-x-2">
              {/* 
                Bouton de téléchargement
                - flex-1: prend tout l'espace disponible
                - Appelle handleDownload avec le document
              */}
              <button
                onClick={() => handleDownload(doc)}
                className="btn btn-outline flex-1 flex items-center justify-center space-x-2"
              >
                <FiDownload className="h-4 w-4" />
                <span>Download</span>
              </button>
              {/* 
                Bouton de suppression - Visible uniquement pour ADMIN et HR
                - text-red-600: couleur rouge pour indiquer une action destructive
                - hover:bg-red-50: fond rouge clair au survol
              */}
              {canGenerateDocuments && (
                <button
                  onClick={() => handleDelete(doc.id)}
                  className="btn btn-outline text-red-600 hover:bg-red-50"
                >
                  <FiTrash2 className="h-4 w-4" />
                </button>
              )}
            </div>
          </motion.div>
        ))}
      </div>

      {/* 
        État vide - Affiché quand il n'y a aucun document
        Aide l'utilisateur à comprendre qu'il peut générer son premier document
      */}
      {documents.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="card py-12 text-center"
        >
          {/* Icône d'illustration */}
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
            <FiFileText className="h-8 w-8 text-gray-400" />
          </div>
          {/* Message principal */}
          <h3 className="text-lg font-semibold text-gray-900">
            No documents yet
          </h3>
          {/* Message d'aide */}
          <p className="mt-1 text-sm text-gray-600">
            Generate your first document to get started
          </p>
        </motion.div>
      )}

      {/* 
        Modale de génération de document
        - fixed inset-0: prend toute la fenêtre
        - z-50: z-index très élevé pour être au-dessus de tout
        - bg-black bg-opacity-50: fond noir semi-transparent (overlay)
      */}
      {showGenerateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          {/* 
            Contenu de la modale avec animation d'entrée
            - max-w-md: largeur maximale de 28rem (448px)
            - rounded-xl: coins très arrondis
            - shadow-xl: ombre importante
          */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl"
          >
            {/* Titre de la modale */}
            <h2 className="mb-4 text-xl font-semibold text-gray-900">
              Generate New Document
            </h2>
            {/* Description */}
            <p className="mb-4 text-sm text-gray-600">
              Select the type of document you want to generate:
            </p>

            {/* 
              Sélection du type de document
              - space-y-2: espacement vertical de 8px entre les options
              - mb-6: marge inférieure de 24px
            */}
            <div className="mb-6 space-y-2">
              {/* Parcours de tous les types de documents disponibles */}
              {documentTypes.map((type) => (
                <button
                  key={type.id}
                  onClick={() => setSelectedDocType(type.name)}
                  className={`flex w-full items-center space-x-3 rounded-lg border-2 p-3 text-left transition-colors ${selectedDocType === type.name
                    ? "border-primary-500 bg-primary-50" // Style pour type sélectionné
                    : "border-gray-200 hover:border-primary-300" // Style pour type non sélectionné
                    }`}
                >
                  {/* 
                    Bouton de sélection de type
                    - Style change selon si le type est sélectionné ou non
                    - Sélectionné: bordure primaire et fond primaire clair
                    - Non sélectionné: bordure grise avec hover vers primaire
                  */}
                  {/* Icône du type de document */}
                  <type.icon className="h-5 w-5 text-primary-600" />
                  {/* Nom du type de document */}
                  <span className="font-medium text-gray-900">{type.name}</span>
                </button>
              ))}
            </div>

            {/* 
              Boutons d'action de la modale
              - justify-end: aligne les boutons à droite
              - space-x-2: espacement horizontal de 8px
            */}
            <div className="flex justify-end space-x-2">
              {/* 
                Bouton d'annulation
                - Ferme la modale et réinitialise la sélection
              */}
              <button
                onClick={() => {
                  setShowGenerateModal(false);
                  setSelectedDocType("");
                }}
                className="btn btn-outline"
              >
                Cancel
              </button>
              {/* 
                Bouton de génération
                - Appelle handleGenerate pour générer le document
              */}
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
