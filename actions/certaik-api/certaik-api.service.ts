import api from "@/lib/api";
import {
  AuditResponseI,
  AuditTableReponseI,
  ContractResponseI,
  StatsResponseI,
  UserInfoResponseI,
} from "@/utils/types";

class CertaikApiService {
  async runEval(
    contractId: string,
    promptType: string,
    address: string,
  ): Promise<{
    id: string;
    job_id: string;
  }> {
    const headers = {
      headers: {
        "X-User-Identifier": address,
      },
    };

    return api
      .post(
        "/ai/eval",
        {
          contract_id: contractId,
          audit_type: promptType,
          encode_code: true,
          response_type: "markdown",
          // webhook_url: `${process.env.VERCEL_URL}/api/webhook`,
          webhook_url: "https://webhook.site/5eec6efd-1fda-486a-aac5-e95a19a0ea5a",
          // webhook_url: "https://i-dont-exist.com",
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

  async getSourceCode(contractAddress: string, address: string): Promise<ContractResponseI> {
    const headers = {
      headers: {
        "X-User-Identifier": address,
      },
    };
    return api.get(`/blockchain/scan/${contractAddress}`, headers).then((response) => {
      if (!response.data) {
        throw new Error(response.statusText);
      }
      return response.data;
    });
  }

  async uploadSourceCode(code: string, address: string): Promise<ContractResponseI> {
    const headers = {
      headers: {
        "X-User-Identifier": address,
      },
    };
    return api.post("/blockchain/contract/upload", { code }, headers).then((response) => {
      if (!response.data) {
        throw new Error(response.statusText);
      }
      return response.data;
    });
  }

  async submitFeedback(
    id: string,
    address: string,
    feedback?: string,
    verified?: boolean,
  ): Promise<{ success: boolean }> {
    const headers = {
      headers: {
        "X-User-Identifier": address,
      },
    };
    return api.post("/analytics/feedback", { id, feedback, verified }, headers).then((response) => {
      if (!response.data) {
        throw new Error(response.statusText);
      }
      return response.data;
    });
  }

  async retryFailedEval(jobId: string, address: string): Promise<boolean> {
    const headers = {
      headers: {
        "X-User-Identifier": address,
      },
    };
    return api.post(`/status/job/retry/${jobId}`, {}, headers).then((response) => {
      if (!response.data) {
        throw new Error(response.statusText);
      }
      return response.data;
    });
  }

  async getCurrentGas(address: string): Promise<number> {
    const headers = {
      headers: {
        "X-User-Identifier": address,
      },
    };
    return api.post("/blockchain/gas", {}, headers).then((response) => {
      if (!response.data) {
        throw new Error(response.statusText);
      }
      return response.data;
    });
  }

  async getAudits(
    filters: { [key: string]: string },
    address: string,
  ): Promise<AuditTableReponseI> {
    const searchParams = new URLSearchParams(filters);
    const headers = {
      headers: {
        "X-User-Identifier": address,
      },
    };
    return api.get(`/analytics/audits?${searchParams.toString()}`, headers).then((response) => {
      if (!response.data) {
        throw new Error(response.statusText);
      }
      return response.data;
    });
  }

  async getStats(): Promise<StatsResponseI> {
    return api.get("/analytics/stats").then((response) => {
      if (!response.data) {
        throw new Error(response.statusText);
      }
      return response.data;
    });
  }

  async getAudit(id: string, address: string): Promise<AuditResponseI> {
    return api.get(`/analytics/audit/${id}`).then((response) => {
      if (!response.data) {
        throw new Error(response.statusText);
      }
      return response.data.result;
    });
  }

  async getUserInfo(address: string): Promise<UserInfoResponseI> {
    const headers = {
      headers: {
        "X-User-Identifier": address,
      },
    };
    return api.get("/analytics/user", headers).then((response) => {
      if (!response.data) {
        throw new Error(response.statusText);
      }
      return response.data;
    });
  }
}

const certaikApiService = new CertaikApiService();
export default certaikApiService;
