"use server";

import {
  AppSearchResponseI,
  AuditResponseI,
  AuditStatusResponseI,
  AuditTableReponseI,
  AuditWithChildrenResponseI,
  ChatMessagesResponseI,
  ChatResponseI,
  ChatWithAuditResponseI,
  ContractResponseI,
  CreditSyncResponseI,
  PromptResponseI,
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

const getAuditWithChildren = async (id: string): Promise<AuditWithChildrenResponseI> => {
  return certaikApiController.getAuditWithChildren(id);
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

const contractUploadFolder = async (fileMap: Record<string, File>): Promise<ContractResponseI> => {
  return certaikApiController.contractUploadFolder(fileMap);
};

const contractUploadFile = async (file: File): Promise<ContractResponseI> => {
  return certaikApiController.contractUploadFile(file);
};

const contractUploadScan = async (address: string): Promise<ContractResponseI> => {
  return certaikApiController.contractUploadScan(address);
};

const contractUploadPaste = async (code: string): Promise<ContractResponseI> => {
  return certaikApiController.contractUploadPaste(code);
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

const getPrompts = async (): Promise<PromptResponseI[]> => {
  return certaikApiController.getPrompts();
};

const initiateChat = async (auditId: string): Promise<ChatResponseI> => {
  return certaikApiController.initiateChat(auditId);
};

const getChats = async (): Promise<ChatWithAuditResponseI[]> => {
  return certaikApiController.getChats();
};

const getChat = async (chatId: string): Promise<ChatMessagesResponseI> => {
  return certaikApiController.getChat(chatId);
};

const addPrompt = async (data: {
  audit_type: string;
  tag: string;
  content: string;
  version: string;
  is_active?: boolean;
}): Promise<string> => {
  return certaikApiController.addPrompt(data);
};

const updatePrompt = async (data: {
  promptId: string;
  tag?: string;
  content?: string;
  version?: string;
  is_active?: boolean;
}): Promise<boolean> => {
  return certaikApiController.updatePrompt(data);
};

export {
  addPrompt,
  contractUploadFile,
  contractUploadFolder,
  contractUploadPaste,
  contractUploadScan,
  generateApiKey,
  generateApp,
  getAudit,
  getAudits,
  getAuditStatus,
  getAuditWithChildren,
  getChat,
  getChats,
  getCurrentGas,
  getPrompts,
  getStats,
  getUserInfo,
  initiateChat,
  isAdmin,
  runEval,
  searchApps,
  searchUsers,
  submitFeedback,
  syncCredits,
  updateApp,
  updateAppPermissions,
  updatePrompt,
  updateUserPermissions,
};
