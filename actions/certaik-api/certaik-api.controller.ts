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
    const user = await this.authService.currentUser();
    if (!user) {
      throw new Error("user is not signed in with ethereum");
    }
    return this.certaikApiService.runEval(contractId, promptType, user.user_id);
  }

  async uploadSourceCode({
    address,
    network,
    code,
  }: {
    address?: string;
    network?: string;
    code?: string;
  }): Promise<ContractResponseI> {
    const user = await this.authService.currentUser();
    if (!user) {
      throw new Error("user is not signed in with ethereum");
    }
    return this.certaikApiService.uploadSourceCode({
      address,
      network,
      code,
      userId: user.user_id,
    });
  }

  async submitFeedback(
    id: string,
    feedback?: string,
    verified?: boolean,
  ): Promise<{ success: boolean }> {
    const user = await this.authService.currentUser();
    if (!user) {
      throw new Error("user is not signed in with ethereum");
    }
    return this.certaikApiService.submitFeedback(id, user.user_id, feedback, verified);
  }

  async retryFailedEval(jobId: string): Promise<boolean> {
    const user = await this.authService.currentUser();
    if (!user) {
      throw new Error("user is not signed in with ethereum");
    }
    return this.certaikApiService.retryFailedEval(jobId, user.user_id);
  }

  async getCurrentGas(): Promise<number> {
    const user = await this.authService.currentUser();
    if (!user) {
      throw new Error("user is not signed in with ethereum");
    }
    return this.certaikApiService.getCurrentGas(user.user_id);
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
    const user = await this.authService.currentUser();
    if (!user) {
      throw new Error("user is not signed in with ethereum");
    }
    return this.certaikApiService.getUserInfo(user.user_id);
  }

  async generateApiKey(type: "user" | "app"): Promise<string> {
    const user = await this.authService.currentUser();
    if (!user) {
      throw new Error("user is not signed in with ethereum");
    }
    return this.certaikApiService.generateApiKey(type, user.user_id);
  }

  async generateApp(name: string): Promise<string> {
    const user = await this.authService.currentUser();
    if (!user) {
      throw new Error("user is not signed in with ethereum");
    }
    return this.certaikApiService.generateApp(name, user.user_id);
  }

  async updateApp(name: string): Promise<string> {
    const user = await this.authService.currentUser();
    if (!user) {
      throw new Error("user is not signed in with ethereum");
    }
    return this.certaikApiService.updateApp(name, user.user_id);
  }
}

const certaikApiController = new AiController(AuthService, CertaikApiService);
export default certaikApiController;
