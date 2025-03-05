import api from "@/lib/api";
import sessionOptions from "@/lib/config/session";
import { type SessionData } from "@/utils/types";
import { getIronSession, type IronSession } from "iron-session";
import { cookies } from "next/headers";
import { SiweMessage } from "siwe";

class AuthService {
  async currentUser(): Promise<{ address: string; user_id: string } | null> {
    const session = await this.getSession();
    if (!session?.siwe || !session.user_id) {
      return null;
    }
    const { siwe, user_id } = session;
    const { address } = siwe;

    return { address, user_id };
  }

  async getSession(): Promise<IronSession<SessionData>> {
    const cookieStore = await cookies();
    return await getIronSession<SessionData>(cookieStore, sessionOptions);
  }

  async verifyMessage(
    message: string,
    signature: string,
    session: IronSession<SessionData>,
    domain: string,
  ): Promise<void> {
    // SIWE verification + adding userId to session (if user exists)
    const siweMessage = new SiweMessage(message);

    const { data, success, error } = await siweMessage.verify({
      signature,
      nonce: session.nonce,
      domain,
    });
    if (!success) {
      session.destroy();
      throw error;
    }
    session.siwe = data;

    const response = await api.post("/user", {
      address: data.address,
    });
    if (!response.data) {
      console.log("something went wrong");
      session.destroy();
    }
    session.user_id = response.data.id;

    await session.save();
  }
}

const authService = new AuthService();
export default authService;
