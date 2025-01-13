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

  async getAudits(): Promise<{ results: any[]; more: boolean }> {
    return this.certaikApiService.getAudits();
  }

  async getStats(): Promise<any> {
    return this.certaikApiService.getStats();
  }
}

const certaikApiController = new AiController(CertaikApiService);
export default certaikApiController;
