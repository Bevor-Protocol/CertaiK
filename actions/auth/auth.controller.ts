import { headers } from "next/headers";
import { generateNonce } from "siwe";
import AuthService from "./auth.service";

class AuthController {
  constructor(private readonly authService: typeof AuthService) {}

  async nonce(): Promise<string> {
    const session = await this.authService.getSession();
    session.nonce = generateNonce();
    await session.save();

    return session.nonce;
  }

  async currentUser(): Promise<string | null> {
    return this.authService.currentUser();
  }

  async verify(message: string, signature: string): Promise<void> {
    const headerList = await headers();
    const session = await this.authService.getSession();
    const domain = headerList.get("x-forwarded-host") ?? "";

    await this.authService.verifyMessage(message, signature, session, domain);
  }

  async logout(): Promise<boolean> {
    const session = await this.authService.getSession();
    session.destroy();
    return true;
  }
}

const authController = new AuthController(AuthService);
export default authController;
