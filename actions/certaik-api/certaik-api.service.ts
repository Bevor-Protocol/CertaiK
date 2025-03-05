import api from "@/lib/api";
import {
  AuditResponseI,
  AuditStatusResponseI,
  AuditTableReponseI,
  ContractResponseI,
  CreditSyncResponseI,
  StatsResponseI,
  UserInfoResponseI,
} from "@/utils/types";

class CertaikApiService {
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
        "X-User-Identifier": userId,
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
        "X-User-Identifier": userId,
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
        "X-User-Identifier": userId,
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
        "X-User-Identifier": userId,
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
        "X-User-Identifier": userId,
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
        "X-User-Identifier": userId,
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
        "X-User-Identifier": userId,
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
        "X-User-Identifier": userId,
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
        "X-User-Identifier": userId,
      },
    };
    return api.patch("/app", { name }, headers).then((response) => {
      if (!response.data) {
        throw new Error(response.statusText);
      }
      return response.data;
    });
  }
}

const certaikApiService = new CertaikApiService();
export default certaikApiService;
