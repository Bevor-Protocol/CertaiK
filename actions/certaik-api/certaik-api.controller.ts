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
    text: string,
    promptType: string,
  ): Promise<{
    job_id: string;
  }> {
    const address = await this.authService.currentUser();
    if (!address) {
      throw new Error("user is not signed in with ethereum");
    }
    return this.certaikApiService.runEval(text, promptType, address);
  }

  async getSourceCode(contractAddress: string): Promise<ContractResponseI> {
    const address = await this.authService.currentUser();
    if (!address) {
      throw new Error("user is not signed in with ethereum");
    }
    return this.certaikApiService.getSourceCode(contractAddress, address);
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
    const address = await this.authService.currentUser();
    if (!address) {
      throw new Error("user is not signed in with ethereum");
    }
    return this.certaikApiService.getAudits(filters, address);
  }

  async getStats(): Promise<StatsResponseI> {
    return this.certaikApiService.getStats();
  }

  async getAudit(id: string): Promise<AuditResponseI> {
    const address = await this.authService.currentUser();
    if (!address) {
      throw new Error("user is not signed in with ethereum");
    }
    return this.certaikApiService.getAudit(id, address);
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
