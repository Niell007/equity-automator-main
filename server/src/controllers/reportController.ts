import { Request, Response } from 'express';
import prisma from '../config/database';
import { z } from 'zod';

const reportSchema = z.object({
  title: z.string().min(1),
  type: z.enum(['BBBEE_SCORECARD', 'COMPLIANCE_REPORT', 'AUDIT_REPORT']),
  data: z.record(z.any()),
});

export const generateReport = async (req: Request, res: Response) => {
  try {
    const validation = reportSchema.safeParse(req.body);
    if (!validation.success) {
      return res.status(400).json({ error: validation.error });
    }

    const { title, type, data } = validation.data;

    // Create report record
    const report = await prisma.report.create({
      data: {
        title,
        type,
        status: 'PENDING',
        data: JSON.stringify(data),
        userId: req.user?.id || '',
        generatedAt: new Date(),
      },
    });

    res.status(201).json({ report });
  } catch (error) {
    console.error('Report generation error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getReports = async (req: Request, res: Response) => {
  try {
    const reports = await prisma.report.findMany({
      where: {
        userId: req.user?.id,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    // Parse JSON data for each report
    const parsedReports = reports.map(report => ({
      ...report,
      data: JSON.parse(report.data),
    }));

    res.json({ reports: parsedReports });
  } catch (error) {
    console.error('Get reports error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getReport = async (req: Request, res: Response) => {
  try {
    const report = await prisma.report.findFirst({
      where: {
        id: req.params.id,
        userId: req.user?.id,
      },
    });

    if (!report) {
      return res.status(404).json({ error: 'Report not found' });
    }

    // Parse JSON data
    const parsedReport = {
      ...report,
      data: JSON.parse(report.data),
    };

    res.json({ report: parsedReport });
  } catch (error) {
    console.error('Get report error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const updateReport = async (req: Request, res: Response) => {
  try {
    const updateSchema = z.object({
      title: z.string().min(1).optional(),
      status: z.enum(['PENDING', 'COMPLETED', 'ERROR']).optional(),
      data: z.record(z.any()).optional(),
    });

    const validation = updateSchema.safeParse(req.body);
    if (!validation.success) {
      return res.status(400).json({ error: validation.error });
    }

    const report = await prisma.report.findFirst({
      where: {
        id: req.params.id,
        userId: req.user?.id,
      },
    });

    if (!report) {
      return res.status(404).json({ error: 'Report not found' });
    }

    const updatedReport = await prisma.report.update({
      where: { id: req.params.id },
      data: {
        ...validation.data,
        data: validation.data.data ? JSON.stringify(validation.data.data) : undefined,
      },
    });

    // Parse JSON data
    const parsedReport = {
      ...updatedReport,
      data: JSON.parse(updatedReport.data),
    };

    res.json({ report: parsedReport });
  } catch (error) {
    console.error('Update report error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const deleteReport = async (req: Request, res: Response) => {
  try {
    const report = await prisma.report.findFirst({
      where: {
        id: req.params.id,
        userId: req.user?.id,
      },
    });

    if (!report) {
      return res.status(404).json({ error: 'Report not found' });
    }

    await prisma.report.delete({
      where: { id: req.params.id },
    });

    res.json({ message: 'Report deleted successfully' });
  } catch (error) {
    console.error('Delete report error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Specialized report generation functions
export const generateBBBEEScorecard = async (req: Request, res: Response) => {
  try {
    const scorecardSchema = z.object({
      companyName: z.string(),
      registrationNumber: z.string(),
      vatNumber: z.string().optional(),
      address: z.string(),
      industry: z.string(),
      scoreComponents: z.object({
        ownershipScore: z.number().min(0).max(25),
        managementControlScore: z.number().min(0).max(19),
        employmentEquityScore: z.number().min(0).max(20),
        skillsDevelopmentScore: z.number().min(0).max(25),
        preferentialProcurementScore: z.number().min(0).max(25),
        enterpriseDevelopmentScore: z.number().min(0).max(15),
        socioEconomicDevelopmentScore: z.number().min(0).max(5),
      }),
    });

    const validation = scorecardSchema.safeParse(req.body);
    if (!validation.success) {
      return res.status(400).json({ error: validation.error });
    }

    const data = validation.data;
    
    // Calculate total score
    const totalScore = Object.values(data.scoreComponents).reduce((sum, score) => sum + score, 0);
    
    // Determine B-BBEE level based on total score
    let level = 'Non-Compliant';
    if (totalScore >= 100) level = 'Level 1';
    else if (totalScore >= 95) level = 'Level 2';
    else if (totalScore >= 90) level = 'Level 3';
    else if (totalScore >= 80) level = 'Level 4';
    else if (totalScore >= 75) level = 'Level 5';
    else if (totalScore >= 70) level = 'Level 6';
    else if (totalScore >= 55) level = 'Level 7';
    else if (totalScore >= 40) level = 'Level 8';

    const reportData = {
      ...data,
      totalScore,
      level,
      generatedAt: new Date(),
    };

    // Create report record
    const report = await prisma.report.create({
      data: {
        title: `B-BBEE Scorecard - ${data.companyName}`,
        type: 'BBBEE_SCORECARD',
        status: 'COMPLETED',
        data: JSON.stringify(reportData),
        userId: req.user?.id || '',
        generatedAt: new Date(),
      },
    });

    res.status(201).json({
      report: {
        ...report,
        data: reportData,
      },
    });
  } catch (error) {
    console.error('B-BBEE Scorecard generation error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}; 