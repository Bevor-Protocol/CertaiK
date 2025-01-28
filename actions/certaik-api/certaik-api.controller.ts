import {
  AuditResponseI,
  AuditTableReponseI,
  StatsResponseI,
  UserInfoResponseI,
} from "@/utils/types";
import CertaikApiService from "./certaik-api.service";

class AiController {
  constructor(private readonly certaikApiService: typeof CertaikApiService) {}

  async eval(
    text: string,
    promptType: string,
  ): Promise<{
    job_id: string;
  }> {
    return this.certaikApiService.runEval(text, promptType);
  }

  async getSourceCode(contractAddress: string): Promise<{
    source_code: string;
    network: string;
  }> {
    return this.certaikApiService.getSourceCode(contractAddress);
  }

  async retryFailedEval(jobId: string): Promise<boolean> {
    return this.certaikApiService.retryFailedEval(jobId);
  }

  async getCurrentGas(): Promise<number> {
    return this.certaikApiService.getCurrentGas();
  }

  async getAudits(filters: { [key: string]: string }): Promise<AuditTableReponseI> {
    return this.certaikApiService.getAudits(filters);
  }

  async getStats(): Promise<StatsResponseI> {
    return this.certaikApiService.getStats();
  }

  async getAudit(id: string): Promise<AuditResponseI> {
    return this.certaikApiService.getAudit(id);
  }

  async getUserInfo(): Promise<UserInfoResponseI> {
    return this.certaikApiService.getUserInfo();
  }
}

const certaikApiController = new AiController(CertaikApiService);
export default certaikApiController;
