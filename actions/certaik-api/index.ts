"use server";

import {
  AppSearchResponseI,
  AuditResponseI,
  AuditStatusResponseI,
  AuditTableReponseI,
  ContractResponseI,
  CreditSyncResponseI,
  StatsResponseI,
  UserInfoResponseI,
  UserSearchResponseI,
} from "@/utils/types";
import certaikApiController from "./certaik-api.controller";

const isAdmin = async (): Promise<boolean> => {
  return certaikApiController.isAdmin();
};

const searchUsers = async (identifier: string): Promise<UserSearchResponseI[]> => {
  return certaikApiController.searchUsers(identifier);
};

const searchApps = async (identifier: string): Promise<AppSearchResponseI[]> => {
  return certaikApiController.searchApps(identifier);
};

const updateUserPermissions = async (data: {
  toUpdateId: string;
  canCreateApp: boolean;
  canCreateApiKey: boolean;
}): Promise<boolean> => {
  return certaikApiController.updateUserPermissions(data);
};

const updateAppPermissions = async (data: {
  toUpdateId: string;
  canCreateApp: boolean;
  canCreateApiKey: boolean;
}): Promise<boolean> => {
  return certaikApiController.updateAppPermissions(data);
};

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

const getAuditStatus = async (id: string): Promise<AuditStatusResponseI> => {
  return certaikApiController.getAuditStatus(id);
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
  getAuditStatus,
  getCurrentGas,
  getStats,
  getUserInfo,
  isAdmin,
  runEval,
  searchApps,
  searchUsers,
  submitFeedback,
  syncCredits,
  updateApp,
  updateAppPermissions,
  updateUserPermissions,
  uploadSourceCode,
};
