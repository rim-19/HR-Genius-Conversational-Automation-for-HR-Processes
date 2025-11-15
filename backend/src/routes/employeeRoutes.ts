import { Router } from 'express';
import {
  getEmployees,
  getEmployeeById,
  createEmployee,
  updateEmployee,
  deleteEmployee,
} from '../controllers/employeeController';

import { authenticate } from '../middlewares/authMiddleware';
import { authorize } from '../middlewares/roleMiddleware';
import { Role } from '@prisma/client';

const router = Router();

// -----------------------------
// ROUTES
// -----------------------------

// Get all employees
router.get(
  '/',
  authenticate,
  authorize(Role.ADMIN, Role.HR, Role.MANAGER),
  getEmployees
);

// Get employee by id
router.get(
  '/:id',
  authenticate,
  authorize(Role.ADMIN, Role.HR, Role.MANAGER),
  getEmployeeById
);

// Create employee
router.post(
  '/',
  authenticate,
  authorize(Role.ADMIN, Role.HR),
  createEmployee
);

// Update employee
router.put(
  '/:id',
  authenticate,
  authorize(Role.ADMIN, Role.HR),
  updateEmployee
);

// Delete employee
router.delete(
  '/:id',
  authenticate,
  authorize(Role.ADMIN),
  deleteEmployee
);

export default router;
