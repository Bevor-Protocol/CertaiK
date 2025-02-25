import { type SiweMessage } from "siwe";
import { Message } from "./enums";

export type MessageType = {
  type: Message;
  content: string;
};

export type SiweStateI = {
  isPending: boolean;
  isSuccess: boolean;
  login: () => void;
  logout: () => void;
  isAuthenticated: boolean;
  setIsAuthenticated: React.Dispatch<React.SetStateAction<boolean>>;
};

export type ModalContextI = {
  setOpen: React.Dispatch<React.SetStateAction<"modal" | "none">>;
  setContent: React.Dispatch<React.SetStateAction<React.ReactNode>>;
};

export type ModalStateI = {
  show: (content: React.ReactNode) => void;
  hide: () => void;
};

export interface SessionData {
  siwe?: SiweMessage;
  nonce?: string;
  user_id?: string;
}

export interface DropdownOption {
  name: string;
  value: string;
}

export interface StatsResponseI {
  n_audits: number;
  n_contracts: number;
  n_users: number;
  n_apps: number;
  findings: { [key: string]: { [key: string]: string[] } };
  users_timeseries: { date: string; count: number }[];
  audits_timeseries: { date: string; count: number }[];
}

interface AuditObservationI {
  n: number;
  id: string;
  created_at: string;
  audit_type: string;
  status: string;
  contract: {
    id: string;
    method: string;
    address?: string;
    network?: string;
    is_available: boolean;
  };
  user: {
    id: string;
    address: string;
  };
}

export interface AuditTableReponseI {
  more: boolean;
  total_pages: number;
  results: AuditObservationI[];
}

export interface AuditResponseI {
  id: string;
  created_at: string;
  status: "waiting" | "processing" | "success" | "failed";
  version: string;
  audit_type: string;
  processing_time_seconds: number;
  result: string;
  contract: {
    id: string;
    method: string;
    address: string;
    network: string;
    code: string;
    is_available: boolean;
  };
  user: {
    id: string;
    address: string;
  };
  findings: {
    id: string;
    level: string;
    name: string;
    explanation: string;
    recommendation: string;
    reference?: string;
    is_attested: boolean;
    is_verified: boolean;
    feedback?: string;
  }[];
}

export interface UserInfoResponseI {
  id: string;
  address: string;
  created_at: string;
  total_credits: number;
  remaining_credits: number;
  auth: {
    exists: boolean;
    is_active: boolean;
    can_create: boolean;
  };
  app: {
    exists: boolean;
    name?: string;
    can_create: boolean;
    exists_auth: boolean;
    can_create_auth: boolean;
  };
  n_audits: number;
  n_contracts: number;
}

export interface ContractResponseI {
  exact_match: boolean;
  exists: boolean;
  candidates: {
    id: string;
    method: string;
    address: string;
    code: string;
    network: string;
    is_available: boolean;
  }[];
}

export interface CreditSyncResponseI {
  total_credits: number;
  credits_added: number;
  credits_removed: number;
}

export interface AuditStatusResponseI {
  status: string;
  steps: {
    step: string;
    status: string;
  }[];
}
