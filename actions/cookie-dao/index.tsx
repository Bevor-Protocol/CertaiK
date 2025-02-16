"use server";

import cookieDaoController from "./cookie.dao.controller";

const getAgentByTwitterHandle = async (
  handle: string,
): Promise<{
  address: string;
}> => {
  return cookieDaoController.getAgentByTwitterHandle(handle);
};

const getAgentSecurityScore = async (twitterHandle: string): Promise<number> => {
  return cookieDaoController.getAgentSecurityScore(twitterHandle);
};

export { getAgentByTwitterHandle, getAgentSecurityScore };
