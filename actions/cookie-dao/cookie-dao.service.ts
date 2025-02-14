import cookieApi from "@/lib/cookie-dao";
import gptZero from "@/lib/gpt-zero";
import twitter from "@/lib/twitter";

class CookieDaoService {
  getAgentByTwitterHandle(handle: string): Promise<{
    address: string;
  }> {
    return cookieApi.get(`/agents/twitterUsername/${handle}?interval=_7Days`).then((response) => {
      if (!response.data?.ok?.contracts?.[0]?.contractAddress) {
        throw new Error("Could not find agent contract address");
      }
      return {
        address: response.data.ok.contracts[0].contractAddress,
      };
    });
  }

  async getLastAgentTweets(username: string): Promise<string> {
    return twitter
      .get(`/users/by/username/${username}`)
      .then((userResponse) => {
        const userId = userResponse.data.data.id;
        return twitter.get(`/users/${userId}/tweets?max_results=15`);
      })
      .then((tweetsResponse) => {
        if (!tweetsResponse.data.data) return "";

        const cleanedTweets = tweetsResponse.data.data
          .map((tweet: any) =>
            tweet.text
              ?.split(" ")
              .filter((word: string) => !word.startsWith("@"))
              .join(" "),
          )
          .filter(Boolean);

        return cleanedTweets.join(" ");
      });
  }

  getAiProbability(text: string): Promise<number> {
    return gptZero
      .post("/predict/text", {
        document: text,
        multilingual: false,
      })
      .then((response) => {
        return response.data.documents[0].class_probabilities.ai;
      })
      .catch(() => {
        return 0;
      });
  }

  async getAgentInfo(handle: string): Promise<{ marketCapScore: number; mindsharePct: number }> {
    return cookieApi.get(`/agents/twitterUsername/${handle}?interval=_7Days`).then((agentData) => {
      const mindsharePct = Math.min(Math.max(agentData.data.ok.mindshare * 100, 0), 100);
      const marketCap = Math.min(agentData.data.ok.marketCap, 10_000_000_000);
      const marketCapScore = (Math.log10(1 + marketCap) / Math.log10(101)) * 100;

      return { marketCapScore, mindsharePct };
    });
  }
}

const cookieDaoService = new CookieDaoService();
export default cookieDaoService;
