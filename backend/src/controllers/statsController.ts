// backend/src/controllers/statsController.ts
import { Request, Response } from 'express';
import prisma from '../prisma/client';

export const getStats = async (req: Request, res: Response) => {
    try {
        const totalEmployees = await prisma.employee.count();
        const totalDocuments = await prisma.document.count();
        const totalUsers = await prisma.user.count();

        // You could add logic for "change" percentages or more specific stats here

        res.json({
            totalEmployees,
            totalDocuments,
            totalUsers,
            systemHealth: '100%',
            // Random dummy change data for now since we don't have historical data
            changes: {
                employees: '+2',
                documents: '+5',
                users: '+1'
            }
        });
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};
