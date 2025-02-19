"use server";

import {
  AuditResponseI,
  AuditTableReponseI,
  ContractResponseI,
  CreditSyncResponseI,
  StatsResponseI,
  UserInfoResponseI,
} from "@/utils/types";
import certaikApiController from "./certaik-api.controller";

const runEval = async (
  contractId: string,
  promptType: string,
): Promise<{
  id: string;
  job_id: string;
}> => {
  return certaikApiController.eval(contractId, promptType);
};

const syncCredits = async (): Promise<CreditSyncResponseI> => {
  return certaikApiController.syncCredits();
};

const getAgentSecurityScore = async (twitterHandle: string): Promise<any> => {
  return certaikApiController.getAgentSecurityScore(twitterHandle);
};

const uploadSourceCode = async ({
  address,
  network,
  code,
}: {
  address?: string;
  network?: string;
  code?: string;
}): Promise<ContractResponseI> => {
  return certaikApiController.uploadSourceCode({
    address,
    network,
    code,
  });
};

const submitFeedback = async (
  id: string,
  feedback?: string,
  verified?: boolean,
): Promise<{ success: boolean }> => {
  return certaikApiController.submitFeedback(id, feedback, verified);
};

const retryFailedEval = async (jobId: string): Promise<boolean> => {
  return certaikApiController.retryFailedEval(jobId);
};

const getCurrentGas = async (): Promise<number> => {
  return certaikApiController.getCurrentGas();
};

const getAudits = async (filters: { [key: string]: string }): Promise<AuditTableReponseI> => {
  return certaikApiController.getAudits(filters);
};

const getStats = async (): Promise<StatsResponseI> => {
  return certaikApiController.getStats();
};

const getAudit = async (id: string): Promise<AuditResponseI> => {
  return certaikApiController.getAudit(id);
};

const getUserInfo = async (): Promise<UserInfoResponseI> => {
  return certaikApiController.getUserInfo();
};

const generateApiKey = async (type: "user" | "app"): Promise<string> => {
  return certaikApiController.generateApiKey(type);
};

const generateApp = async (name: string): Promise<string> => {
  return certaikApiController.generateApp(name);
};

const updateApp = async (name: string): Promise<string> => {
  return certaikApiController.updateApp(name);
};

export {
  generateApiKey,
  generateApp,
  getAgentSecurityScore,
  getAudit,
  getAudits,
  getCurrentGas,
  getStats,
  getUserInfo,
  retryFailedEval,
  runEval,
  submitFeedback,
  syncCredits,
  updateApp,
  uploadSourceCode,
};
