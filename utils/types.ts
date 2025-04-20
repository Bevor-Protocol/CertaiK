import { type SiweMessage } from "siwe";
import { AuditStatus, FindingLevel, Message } from "./enums";

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

export interface ChatContextType {
  isOpen: boolean;
  messages: ChatMessageI[];
  openChat: () => void;
  closeChat: () => void;
  sendMessage: (content: string) => Promise<void>;
  currentAuditId: string | null;
  setCurrentAuditId: React.Dispatch<React.SetStateAction<string | null>>;
}

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

export interface FindingI {
  id: string;
  created_at: string;
  level: FindingLevel;
  name: string;
  explanation: string;
  recommendation: string;
  reference?: string;
  is_attested: boolean;
  is_verified: boolean;
  feedback?: string;
}

export interface AuditResponseI {
  id: string;
  created_at: string;
  status: AuditStatus;
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
  findings: FindingI[];
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
  contract?: {
    id: string;
    method: string;
    address: string;
    code: string;
    network: string;
    is_available: boolean;
  };
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

export interface UserSearchResponseI {
  id: string;
  address: string;
  permissions?: {
    can_create_api_key: boolean;
    can_create_app: boolean;
  };
}

export interface AppSearchResponseI {
  id: string;
  owner_id: string;
  name: string;
  type: string;
  permissions?: {
    can_create_api_key: boolean;
    can_create_app: boolean;
  };
}

export interface PromptResponseI {
  id: string;
  created_at: string;
  audit_type: string;
  tag: string;
  version: string;
  content: string;
  is_active: boolean;
}

export interface AuditWithChildrenResponseI {
  id: string;
  created_at: string;
  status: AuditStatus;
  audit_type: "gas" | "security";
  processing_time_seconds: number;
  result: string;
  intermediate_responses: {
    id: string;
    created_at: string;
    audit_id: string;
    prompt_id: string;
    step: string;
    status: AuditStatus;
    processing_time_seconds: number;
    result: string;
  }[];
  findings: FindingI[];
}

export interface ChatMessageI {
  id: string;
  role: "user" | "system";
  timestamp: string;
  content: string;
  tools_called?: string[];
}

export interface ChatResponseI {
  id: string;
  created_at: string;
  user_id: string;
  audit_id: string;
  is_visible: boolean;
  total_messages: number;
}

export interface ChatMessagesResponseI extends ChatResponseI {
  messages: ChatMessageI[];
}

export interface ChatWithAuditResponseI extends ChatResponseI {
  audit: {
    id: string;
    created_at: string;
    status: AuditStatus;
    version: string;
    audit_type: string;
    processing_time_seconds: number;
    result: string;
    introduction?: string;
    scope?: string;
    conclusiong?: string;
    contract: {
      id: string;
      method: string;
      address: string;
      network: string;
      code: string;
      is_available: boolean;
    };
  };
}
