import api from "@/lib/api";
import AuthService from "../auth/auth.service";

class CertaikApiService {
  constructor(private readonly authService: typeof AuthService) {}

  async runEval(
    text: string,
    promptType: string,
  ): Promise<{
    job_id: string;
  }> {
    const address = await this.authService.currentUser();
    if (!address) {
      throw new Error("user is not signed in with ethereum");
    }

    try {
      const response = await api.post(
        "/ai/eval",
        {
          contract_code: text,
          audit_type: promptType,
          encode_code: true,
          response_type: "markdown",
          // webhook_url: `${process.env.VERCEL_URL}/api/webhook`,
          webhook_url: "https://webhook.site/5eec6efd-1fda-486a-aac5-e95a19a0ea5a",
          // webhook_url: "https://i-dont-exist.com",
        },
        {
          headers: {
            "X-User-Identifier": address,
          },
        },
      );

      if (!response.data) {
        throw new Error("Response body is not readable");
      }

      return response.data;
    } catch (error) {
      console.error("Error during model call: ", error);
      throw error;
    }
  }

  async getSourceCode(contractAddress: string): Promise<{
    source_code: string;
    network: string;
  }> {
    const address = await this.authService.currentUser();
    if (!address) {
      throw new Error("user is not signed in with ethereum");
    }

    try {
      const response = await api.get(`/blockchain/scan/${contractAddress}`, {
        headers: {
          "X-User-Identifier": address,
        },
      });

      if (!response.data) {
        throw new Error("Issue reading the data");
      }

      return response.data;
    } catch (error) {
      console.error("Error getting the source code: ", error);
      throw error;
    }
  }

  async retryFailedEval(jobId: string): Promise<boolean> {
    const address = await this.authService.currentUser();
    if (!address) {
      throw new Error("user is not signed in with ethereum");
    }

    try {
      const response = await api.post(
        `/status/job/retry/${jobId}`,
        {},
        {
          headers: {
            "X-User-Identifier": address,
          },
        },
      );

      if (!response.data) {
        throw new Error("Issue retrying this job");
      }

      return response.data.success;
    } catch (error) {
      console.log("Error making the retry request: ", error);
      throw error;
    }
  }

  async getCurrentGas(): Promise<number> {
    const address = await this.authService.currentUser();
    if (!address) {
      throw new Error("user is not signed in with ethereum");
    }

    try {
      const response = await api.post(
        "/blockchain/gas",
        {},
        {
          headers: {
            "X-User-Identifier": address,
          },
        },
      );

      if (!response.data) {
        throw new Error("Issue retrying this job");
      }

      return response.data;
    } catch (error) {
      console.log("Error making the retry request: ", error);
      throw error;
    }
  }

  async getAudits(): Promise<{ results: any[]; more: boolean }> {
    const address = await this.authService.currentUser();
    if (!address) {
      throw new Error("user is not signed in with ethereum");
    }
    try {
      const response = await api.get("/analytics/audits", {
        headers: {
          "X-User-Identifier": address,
        },
      });

      if (!response.data) {
        throw new Error("Issue retrying this job");
      }

      return response.data;
    } catch (error) {
      console.log("Error fetching audits: ", error);
      throw error;
    }
  }

  async getStats(): Promise<{ results: any[]; more: boolean }> {
    const address = await this.authService.currentUser();
    if (!address) {
      throw new Error("user is not signed in with ethereum");
    }
    try {
      const response = await api.get("/analytics/stats");

      if (!response.data) {
        throw new Error("Issue retrying this job");
      }

      return response.data;
    } catch (error) {
      console.log("Error fetching audits: ", error);
      throw error;
    }
  }
}

const certaikApiService = new CertaikApiService(AuthService);
export default certaikApiService;
