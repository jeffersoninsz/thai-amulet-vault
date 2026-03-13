import { prisma } from "./db";

export interface AuditLogItem {
  id: string;
  timestamp: string; // ISO String
  employeeName: string;
  employeeRole?: string;
  type: string; // READ, WRITE, SYSTEM
  action: string;
  targetId: string;
  details: string;
}

export async function appendLog(
  employeeName: string,
  action: string,
  targetId: string,
  details: string,
  type: string = "WRITE", // READ, WRITE, SYSTEM
) {
  try {
    await prisma.auditLog.create({
      data: {
        username: employeeName || "System",
        type: type,
        action: action,
        targetId: targetId,
        details: details,
      },
    });
  } catch (error) {
    console.error("Audit Log failed:", error);
  }
}

export async function getLogs(): Promise<AuditLogItem[]> {
  try {
    const logs = await prisma.auditLog.findMany({
      orderBy: { createdAt: "desc" },
      take: 100,
    });

    return logs.map((log) => {
      let targetId = log.targetId || "N/A";
      let details = log.details || "No details";

      return {
        id: log.id,
        timestamp: log.createdAt.toISOString(),
        employeeName: log.username,
        type: log.type,
        action: log.action,
        targetId,
        details,
      };
    });
  } catch (error) {
    console.error("Fail get log", error);
    return [];
  }
}
