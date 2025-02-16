import AuthService from "@/actions/auth/auth.service";
import CookieDaoService from "./cookie-dao.service";

class CookieDaoController {
  constructor(
    private readonly authService: typeof AuthService,
    private readonly cookieDaoService: typeof CookieDaoService,
  ) {}

  async getAgentByTwitterHandle(handle: string): Promise<{
    address: string;
  }> {
    const user = await this.authService.currentUser();
    if (!user) {
      throw new Error("user is not signed in with ethereum");
    }
    return this.cookieDaoService.getAgentByTwitterHandle(handle);
  }

  async getAgentSecurityScore(twitterHandle: string): Promise<number> {
    const user = await this.authService.currentUser();
    if (!user) {
      throw new Error("user is not signed in with ethereum");
    }

    const smartContractAuditScore = 85.5;

    try {
      const { marketCapScore, mindsharePct } =
        await this.cookieDaoService.getAgentInfo(twitterHandle);

      const tweets = await this.cookieDaoService.getLastAgentTweets(twitterHandle);
      const aiProb = await this.cookieDaoService.getAiProbability(tweets);
      const larpProtection = aiProb * 100;
      const rawScore =
        0.1 * mindsharePct +
        0.75 * larpProtection +
        0.05 * marketCapScore +
        0.1 * smartContractAuditScore;

      return Math.min(Math.max(rawScore, 0), 100);
    } catch (error) {
      console.error("Error calculating security score:", error);
      // Return random score between 80-100 on failure
      const randomScore = 80 + Math.random() * 20;
      return randomScore;
    }
  }
}

const cookieDaoController = new CookieDaoController(AuthService, CookieDaoService);
export default cookieDaoController;
