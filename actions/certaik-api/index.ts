"use server";

import certaikApiController from "./certaik-api.controller";

const runEval = async (
  text: string,
  promptType: string,
): Promise<{
  job_id: string;
}> => {
  return certaikApiController.eval(text, promptType);
};

const getSourceCode = async (
  contractAddress: string,
): Promise<{
  source_code: string;
  network: string;
}> => {
  return certaikApiController.getSourceCode(contractAddress);
};

const retryFailedEval = async (jobId: string): Promise<boolean> => {
  return certaikApiController.retryFailedEval(jobId);
};

const getCurrentGas = async (): Promise<number> => {
  return certaikApiController.getCurrentGas();
};

const getAudits = async (): Promise<any[]> => {
  return certaikApiController.getAudits();
};

export { getAudits, getCurrentGas, getSourceCode, retryFailedEval, runEval };
