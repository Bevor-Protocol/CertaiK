import AuthService from "@/actions/auth/auth.service";
import {
  AuditResponseI,
  AuditTableReponseI,
  ContractResponseI,
  StatsResponseI,
  UserInfoResponseI,
} from "@/utils/types";
import CertaikApiService from "./certaik-api.service";

class AiController {
  constructor(
    private readonly authService: typeof AuthService,
    private readonly certaikApiService: typeof CertaikApiService,
  ) {}

  async eval(
    contractId: string,
    promptType: string,
  ): Promise<{
    id: string;
    job_id: string;
  }> {
    const address = await this.authService.currentUser();
    if (!address) {
      throw new Error("user is not signed in with ethereum");
    }
    return this.certaikApiService.runEval(contractId, promptType, address);
  }

  async getAgentSecurityScore(twitterHandle: string): Promise<any> {
    const address = await this.authService.currentUser();
    if (!address) {
      throw new Error("user is not signed in with ethereum");
    }
    return this.certaikApiService.getAgentSecurityScore(twitterHandle);
  }

  async getSourceCode(contractAddress: string): Promise<ContractResponseI> {
    const address = await this.authService.currentUser();
    if (!address) {
      throw new Error("user is not signed in with ethereum");
    }
    return this.certaikApiService.getSourceCode(contractAddress, address);
  }

  async uploadSourceCode(code: string): Promise<ContractResponseI> {
    const address = await this.authService.currentUser();
    if (!address) {
      throw new Error("user is not signed in with ethereum");
    }
    return this.certaikApiService.uploadSourceCode(code, address);
  }

  async submitFeedback(
    id: string,
    feedback?: string,
    verified?: boolean,
  ): Promise<{ success: boolean }> {
    const address = await this.authService.currentUser();
    if (!address) {
      throw new Error("user is not signed in with ethereum");
    }
    return this.certaikApiService.submitFeedback(id, address, feedback, verified);
  }

  async retryFailedEval(jobId: string): Promise<boolean> {
    const address = await this.authService.currentUser();
    if (!address) {
      throw new Error("user is not signed in with ethereum");
    }
    return this.certaikApiService.retryFailedEval(jobId, address);
  }

  async getCurrentGas(): Promise<number> {
    const address = await this.authService.currentUser();
    if (!address) {
      throw new Error("user is not signed in with ethereum");
    }
    return this.certaikApiService.getCurrentGas(address);
  }

  async getAudits(filters: { [key: string]: string }): Promise<AuditTableReponseI> {
    // const address = await this.authService.currentUser();
    // if (!address) {
    //   throw new Error("user is not signed in with ethereum");
    // }
    return this.certaikApiService.getAudits(filters);
  }

  async getStats(): Promise<StatsResponseI> {
    return this.certaikApiService.getStats();
  }

  async getAudit(id: string): Promise<AuditResponseI> {
    // const address = await this.authService.currentUser();
    // if (!address) {
    //   throw new Error("user is not signed in with ethereum");
    // }
    return this.certaikApiService.getAudit(id);
  }

  async getUserInfo(): Promise<UserInfoResponseI> {
    const address = await this.authService.currentUser();
    if (!address) {
      throw new Error("user is not signed in with ethereum");
    }
    return this.certaikApiService.getUserInfo(address);
  }
}

const certaikApiController = new AiController(AuthService, CertaikApiService);
export default certaikApiController;
