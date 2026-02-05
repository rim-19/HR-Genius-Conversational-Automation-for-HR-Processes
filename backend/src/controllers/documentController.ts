import { Request, Response } from 'express';
import prisma from '../prisma/client';
import { Role } from '@prisma/client';
import { generatePDF } from '../utils/fileGenerator';
import fs from 'fs';
import path from 'path';

// -----------------------------
// GET ALL DOCUMENTS
// -----------------------------
export const getDocuments = async (req: Request, res: Response) => {
  const user = req.user!;

  try {
    let documents;

    if (user.role === Role.ADMIN || user.role === Role.HR) {
      documents = await prisma.document.findMany({
        include: { employee: true, createdBy: true },
      });
    } else if (user.role === Role.MANAGER) {
      documents = await prisma.document.findMany({
        where: {
          employee: {
            managerId: user.userId,
          },
        },
        include: { employee: true },
      });
    } else if (user.role === Role.EMPLOYEE) {
      documents = await prisma.document.findMany({
        where: { employeeId: user.userId },
        include: { employee: true },
      });
    } else {
      return res.status(403).json({ message: 'Not authorized' });
    }

    res.json(documents);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching documents', error });
  }
};

// -----------------------------
// GET DOCUMENT BY ID
// -----------------------------
export const getDocumentById = async (req: Request, res: Response) => {
  const user = req.user!;
  const id = Number(req.params.id);

  try {
    const document = await prisma.document.findUnique({
      where: { id },
      include: { employee: true, createdBy: true },
    });

    if (!document) {
      return res.status(404).json({ message: 'Document not found' });
    }

    // RBAC
    if (user.role === Role.MANAGER && document.employee.managerId !== user.userId)
      return res.status(403).json({ message: 'Not authorized' });

    if (user.role === Role.EMPLOYEE && document.employeeId !== user.userId)
      return res.status(403).json({ message: 'Not authorized' });

    res.json(document);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching document', error });
  }
};

// -----------------------------
// CREATE DOCUMENT
// -----------------------------
export const createDocument = async (req: Request, res: Response) => {
  const user = req.user!;
  const { title, type, fileUrl, employeeId } = req.body;

  // Only ADMIN and HR can upload
  if (user.role !== Role.ADMIN && user.role !== Role.HR) {
    return res.status(403).json({ message: 'Not authorized to upload documents' });
  }

  try {
    const doc = await prisma.document.create({
      data: {
        title,
        type,
        fileUrl,
        employeeId,
        createdById: user.userId,
      },
    });

    res.status(201).json(doc);
  } catch (error) {
    res.status(500).json({ message: 'Error creating document', error });
  }
};

// -----------------------------
// DELETE DOCUMENT
// -----------------------------
export const deleteDocument = async (req: Request, res: Response) => {
  const user = req.user!;
  const id = Number(req.params.id);

  // Only ADMIN can delete
  if (user.role !== Role.ADMIN) {
    return res.status(403).json({ message: 'Not authorized to delete documents' });
  }

  try {
    await prisma.document.delete({
      where: { id },
    });

    res.json({ message: 'Document deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting document', error });
  }
};



export const generateDocument = async (req: Request, res: Response) => {
  const user = req.user!;
  const { type, employeeId } = req.body;

  if (user.role !== Role.ADMIN && user.role !== Role.HR) {
    return res.status(403).json({ message: 'Not authorized to generate documents' });
  }

  try {
    const employee = await prisma.employee.findUnique({
      where: { id: employeeId },
    });

    if (!employee) {
      return res.status(404).json({ message: 'Employee not found' });
    }

    // Load template
    const templatePath = path.join(
      __dirname,
      `../utils/templates/${type}.txt`
    );

    if (!fs.existsSync(templatePath)) {
      return res.status(400).json({ message: 'Invalid document type template' });
    }

    let template = fs.readFileSync(templatePath, 'utf-8');

    // Replace variables
    template = template
      .replace('{{name}}', employee.name)
      .replace('{{position}}', employee.position)
      .replace('{{department}}', employee.department || 'N/A')
      .replace('{{joinedAt}}', employee.joinedAt.toDateString());

    const fileName = `${type}-${employee.name}-${Date.now()}`;
    // generatePDF returns the absolute path, we store the filename for logical access
    const absolutePath = await generatePDF(`HR Document - ${type}`, template, fileName);
    const relativeUrl = `/docs/${path.basename(absolutePath)}`;

    // Save in DB
    const doc = await prisma.document.create({
      data: {
        title: `${type} for ${employee.name}`,
        type,
        fileUrl: relativeUrl, // Store relative URL
        employeeId,
        createdById: user.userId,
      },
    });

    res.json({ message: 'Document generated', document: doc });
  } catch (error) {
    console.error('Error generating document:', error);
    res.status(500).json({ message: 'Error generating document', error });
  }
};

// -----------------------------
// DOWNLOAD DOCUMENT
// -----------------------------
export const downloadDocument = async (req: Request, res: Response) => {
  const id = Number(req.params.id);

  try {
    const document = await prisma.document.findUnique({
      where: { id },
    });

    if (!document) {
      return res.status(404).json({ message: 'Document not found' });
    }

    // Get absolute path from relative fileUrl
    // fileUrl is "/docs/filename.pdf", we need to point to ".../generated/filename.pdf"
    const fileName = path.basename(document.fileUrl);
    const filePath = path.join(__dirname, "..", "..", "generated", fileName);

    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ message: 'File not found on server' });
    }

    res.download(filePath, fileName);
  } catch (error) {
    res.status(500).json({ message: 'Error downloading document', error });
  }
};

