import { Request, Response } from 'express';
import { prisma } from '../prisma/client';

export const getActivity = async (req: Request, res: Response) => {
    try {
        const activity = await prisma.actionLog.findMany({
            take: 10,
            orderBy: { createdAt: 'desc' },
            include: {
                user: {
                    select: {
                        name: true,
                        role: true,
                    }
                }
            }
        });

        res.json(activity);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching activity logs', error });
    }
};
