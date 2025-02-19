"use server";

import authController from "./auth.controller";

const nonce = async (): Promise<string> => {
  return authController.nonce();
};

const getCurrentUser = async (): Promise<{ address: string; user_id?: string } | null> => {
  return authController.currentUser();
};

const verify = async (message: string, signature: string): Promise<void> => {
  return authController.verify(message, signature);
};

const logout = async (): Promise<boolean> => {
  return authController.logout();
};

const getSecureSigning = async (): Promise<string> => {
  // const secret = process.env.SHARED_SECRET!;

  // const timestamp = Date.now().toString();
  // const payload = `${timestamp}:/ws`;
  // const signature = crypto.createHmac("sha256", secret).update(payload).digest("hex");

  // const url = `${process.env.API_URL}/ws?signature=${signature}&timestamp=${timestamp}`;

  const url = `${process.env.API_URL}/ws`;

  return url;
};

export { getCurrentUser, getSecureSigning, logout, nonce, verify };
