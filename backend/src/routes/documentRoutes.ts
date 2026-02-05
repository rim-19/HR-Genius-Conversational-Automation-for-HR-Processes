import { Router } from 'express';
import {
  getDocuments,
  getDocumentById,
  createDocument,
  deleteDocument,
  generateDocument,
  downloadDocument,
} from '../controllers/documentController';

import { authenticate } from '../middlewares/authMiddleware';
import { authorize } from '../middlewares/roleMiddleware';
import { Role } from '@prisma/client';

const router = Router();

// Get all documents
router.get(
  '/',
  authenticate,
  authorize(Role.ADMIN, Role.HR, Role.MANAGER, Role.EMPLOYEE),
  getDocuments
);

// Get a document
router.get(
  '/:id',
  authenticate,
  authorize(Role.ADMIN, Role.HR, Role.MANAGER, Role.EMPLOYEE),
  getDocumentById
);

// Download document
router.get(
  '/:id/download',
  authenticate,
  authorize(Role.ADMIN, Role.HR, Role.MANAGER, Role.EMPLOYEE),
  downloadDocument
);

// Create document
router.post(
  '/',
  authenticate,
  authorize(Role.ADMIN, Role.HR),
  createDocument
);

// Delete document
router.delete(
  '/:id',
  authenticate,
  authorize(Role.ADMIN),
  deleteDocument
);

router.post(
  '/generate',
  authenticate,
  authorize(Role.ADMIN, Role.HR),
  generateDocument
);

export default router;
