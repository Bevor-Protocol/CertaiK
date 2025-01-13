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

  async getAudits(): Promise<any[]> {
    return this.certaikApiService.getAudits();
  }
}

const certaikApiController = new AiController(CertaikApiService);
export default certaikApiController;
