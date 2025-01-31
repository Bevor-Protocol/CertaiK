"use server";

import {
  AuditResponseI,
  AuditTableReponseI,
  ContractResponseI,
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

const getSourceCode = async (contractAddress: string): Promise<ContractResponseI> => {
  return certaikApiController.getSourceCode(contractAddress);
};

const uploadSourceCode = async (code: string): Promise<ContractResponseI> => {
  return certaikApiController.uploadSourceCode(code);
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

export {
  getAudit,
  getAudits,
  getCurrentGas,
  getSourceCode,
  getStats,
  getUserInfo,
  retryFailedEval,
  runEval,
  submitFeedback,
  uploadSourceCode,
};
