import api from "@/lib/api";
import {
  AppSearchResponseI,
  AuditResponseI,
  AuditStatusResponseI,
  AuditTableReponseI,
  AuditWithChildrenResponseI,
  ChatMessageI,
  ChatResponseI,
  ContractResponseI,
  CreditSyncResponseI,
  PromptResponseI,
  StatsResponseI,
  UserInfoResponseI,
  UserSearchResponseI,
} from "@/utils/types";

class CertaikApiService {
  async isAdmin(userId: string): Promise<boolean> {
    const headers = {
      headers: {
        "Bevor-User-Identifier": userId,
      },
    };

    return api
      .get("/admin/status", headers)
      .then((response) => {
        if (!response.data) {
          throw new Error(response.statusText);
        }
        return response.data.success;
      })
      .catch((error) => {
        console.log(error);
        return false;
      });
  }

  async searchUsers(identifier: string, userId: string): Promise<UserSearchResponseI[]> {
    const headers = {
      headers: {
        "Bevor-User-Identifier": userId,
      },
    };

    return api.get(`/admin/search/user?identifier=${identifier}`, headers).then((response) => {
      if (!response.data) {
        throw new Error(response.statusText);
      }
      return response.data.results;
    });
  }

  async searchApps(identifier: string, userId: string): Promise<AppSearchResponseI[]> {
    const headers = {
      headers: {
        "Bevor-User-Identifier": userId,
      },
    };

    return api.get(`/admin/search/app?identifier=${identifier}`, headers).then((response) => {
      if (!response.data) {
        throw new Error(response.statusText);
      }
      return response.data.results;
    });
  }

  async getAuditWithChildren(id: string, userId: string): Promise<AuditWithChildrenResponseI> {
    const headers = {
      headers: {
        "Bevor-User-Identifier": userId,
      },
    };

    return api.get(`/admin/audit/${id}`, headers).then((response) => {
      if (!response.data) {
        throw new Error(response.statusText);
      }
      return response.data;
    });
  }

  async updateUserPermissions({
    toUpdateId,
    userId,
    canCreateApp,
    canCreateApiKey,
  }: {
    toUpdateId: string;
    userId: string;
    canCreateApp: boolean;
    canCreateApiKey: boolean;
  }): Promise<boolean> {
    const headers = {
      headers: {
        "Bevor-User-Identifier": userId,
      },
    };

    return api
      .post(
        `/admin/permissions/user/${toUpdateId}`,
        {
          can_create_app: canCreateApp,
          can_create_api_key: canCreateApiKey,
        },
        headers,
      )
      .then((response) => {
        if (!response.data) {
          throw new Error(response.statusText);
        }
        return response.data.status;
      });
  }

  async updateAppPermissions({
    toUpdateId,
    userId,
    canCreateApp,
    canCreateApiKey,
  }: {
    toUpdateId: string;
    userId: string;
    canCreateApp: boolean;
    canCreateApiKey: boolean;
  }): Promise<boolean> {
    const headers = {
      headers: {
        "Bevor-User-Identifier": userId,
      },
    };

    return api
      .post(
        `/admin/permissions/app/${toUpdateId}`,
        {
          can_create_app: canCreateApp,
          can_create_api_key: canCreateApiKey,
        },
        headers,
      )
      .then((response) => {
        if (!response.data) {
          throw new Error(response.statusText);
        }
        return response.data.status;
      });
  }

  async runEval(
    contractId: string,
    promptType: string,
    userId: string,
  ): Promise<{
    id: string;
    job_id: string;
  }> {
    const headers = {
      headers: {
        "Bevor-User-Identifier": userId,
      },
    };

    return api
      .post(
        "/audit",
        {
          contract_id: contractId,
          audit_type: promptType,
        },
        headers,
      )
      .then((response) => {
        if (!response.data) {
          throw new Error(response.statusText);
        }
        return response.data;
      });
  }

  async syncCredits(userId: string): Promise<CreditSyncResponseI> {
    const headers = {
      headers: {
        "Bevor-User-Identifier": userId,
      },
    };
    return api.post("/auth/sync/credits", {}, headers).then((response) => {
      if (!response.data) {
        throw new Error(response.statusText);
      }
      return response.data;
    });
  }

  async getAgentSecurityScore(twitterHandle: string): Promise<any> {
    // TODO: deprecate
    return api.get(`/ai/agent-security/${twitterHandle}`).then((response) => {
      if (!response.data) {
        throw new Error(response.statusText);
      }
      return response.data;
    });
  }

  async getAgentContracts(agentId: string): Promise<ContractResponseI> {
    // TODO: deprecate
    return api
      .post("/ai/eval/agent", {
        agent_id: agentId,
        encode_code: true,
        response_type: "markdown",
        webhook_url: "https://webhook.site/5eec6efd-1fda-486a-aac5-e95a19a0ea5a",
      })
      .then((response) => {
        if (!response.data) {
          throw new Error(response.statusText);
        }
        return response.data;
      });
  }

  async uploadSourceCode({
    address,
    network,
    code,
    userId,
  }: {
    address?: string;
    network?: string;
    code?: string;
    userId: string;
  }): Promise<ContractResponseI> {
    const headers = {
      headers: {
        "Bevor-User-Identifier": userId,
      },
    };
    return api.post("/contract", { address, network, code }, headers).then((response) => {
      if (!response.data) {
        throw new Error(response.statusText);
      }
      return response.data;
    });
  }

  async submitFeedback(
    id: string,
    userId: string,
    feedback?: string,
    verified?: boolean,
  ): Promise<{ success: boolean }> {
    const headers = {
      headers: {
        "Bevor-User-Identifier": userId,
      },
    };
    return api.post(`/audit/${id}/feedback`, { feedback, verified }, headers).then((response) => {
      if (!response.data) {
        throw new Error(response.statusText);
      }
      return response.data;
    });
  }

  async getCurrentGas(userId: string): Promise<number> {
    const headers = {
      headers: {
        "Bevor-User-Identifier": userId,
      },
    };
    return api.post("/blockchain/gas", {}, headers).then((response) => {
      if (!response.data) {
        throw new Error(response.statusText);
      }
      return response.data;
    });
  }

  async getAudits(filters: { [key: string]: string }): Promise<AuditTableReponseI> {
    const searchParams = new URLSearchParams(filters);
    searchParams.set("status", "success");
    return api
      .get(`/audit/list?${searchParams.toString()}`)
      .then((response) => {
        if (!response.data) {
          throw new Error(response.statusText);
        }
        return response.data;
      })
      .catch((err) => console.log(err));
  }

  async getStats(): Promise<StatsResponseI> {
    return api.get("/app/stats").then((response) => {
      if (!response.data) {
        throw new Error(response.statusText);
      }
      return response.data;
    });
  }

  async getAudit(id: string): Promise<AuditResponseI> {
    return api.get(`/audit/${id}`).then((response) => {
      if (!response.data) {
        throw new Error(response.statusText);
      }
      return response.data;
    });
  }

  async getAuditStatus(id: string): Promise<AuditStatusResponseI> {
    return api.get(`/audit/${id}/status`).then((response) => {
      if (!response.data) {
        throw new Error(response.statusText);
      }
      return response.data;
    });
  }

  async getUserInfo(userId: string): Promise<UserInfoResponseI> {
    const headers = {
      headers: {
        "Bevor-User-Identifier": userId,
      },
    };
    return api.get("/user/info", headers).then((response) => {
      if (!response.data) {
        throw new Error(response.statusText);
      }
      return response.data;
    });
  }

  async generateApiKey(type: "user" | "app", userId: string): Promise<string> {
    const headers = {
      headers: {
        "Bevor-User-Identifier": userId,
      },
    };
    return api.post(`/auth/${type}`, {}, headers).then((response) => {
      if (!response.data) {
        throw new Error(response.statusText);
      }
      return response.data.api_key;
    });
  }

  async generateApp(name: string, userId: string): Promise<string> {
    const headers = {
      headers: {
        "Bevor-User-Identifier": userId,
      },
    };
    return api.post("/app", { name }, headers).then((response) => {
      if (!response.data) {
        throw new Error(response.statusText);
      }
      return response.data;
    });
  }

  async updateApp(name: string, userId: string): Promise<string> {
    const headers = {
      headers: {
        "Bevor-User-Identifier": userId,
      },
    };
    return api.patch("/app", { name }, headers).then((response) => {
      if (!response.data) {
        throw new Error(response.statusText);
      }
      return response.data;
    });
  }

  async getPrompts(userId: string): Promise<PromptResponseI[]> {
    const headers = {
      headers: {
        "Bevor-User-Identifier": userId,
      },
    };

    return api.get("/admin/prompts", headers).then((response) => {
      if (!response.data) {
        throw new Error(response.statusText);
      }
      return response.data.results;
    });
  }

  async initiateChat(userId: string, auditId: string): Promise<string> {
    const headers = {
      headers: {
        "Bevor-User-Identifier": userId,
      },
    };

    return api.post(`/chat/initiate/${auditId}`, {}, headers).then((response) => {
      if (!response.data) {
        throw new Error(response.statusText);
      }
      return response.data.id;
    });
  }

  async getChats(userId: string): Promise<ChatResponseI[]> {
    const headers = {
      headers: {
        "Bevor-User-Identifier": userId,
      },
    };

    return api.get("/chat/list", headers).then((response) => {
      if (!response.data) {
        throw new Error(response.statusText);
      }
      return response.data.results;
    });
  }

  async getChatMessages(userId: string, chatId: string): Promise<ChatMessageI[]> {
    const headers = {
      headers: {
        "Bevor-User-Identifier": userId,
      },
    };

    return api.get(`/chat/${chatId}`, headers).then((response) => {
      if (!response.data) {
        throw new Error(response.statusText);
      }
      return response.data.results;
    });
  }

  async updatePrompt(data: {
    userId: string;
    promptId: string;
    tag?: string;
    content?: string;
    version?: string;
    is_active?: boolean;
  }): Promise<boolean> {
    const { userId, promptId, ...rest } = data;
    const headers = {
      headers: {
        "Bevor-User-Identifier": userId,
      },
    };

    return api
      .patch(
        `/admin/prompt/${promptId}`,
        {
          ...rest,
        },
        headers,
      )
      .then((response) => {
        if (!response.data) {
          throw new Error(response.statusText);
        }
        return response.data.success;
      });
  }

  async addPrompt(data: {
    userId: string;
    audit_type: string;
    tag: string;
    content: string;
    version: string;
    is_active?: boolean;
  }): Promise<string> {
    const { userId, ...rest } = data;
    const headers = {
      headers: {
        "Bevor-User-Identifier": userId,
      },
    };

    return api
      .post(
        "/admin/prompt",
        {
          ...rest,
        },
        headers,
      )
      .then((response) => {
        if (!response.data) {
          throw new Error(response.statusText);
        }
        return response.data.id;
      });
  }
}

const certaikApiService = new CertaikApiService();
export default certaikApiService;
