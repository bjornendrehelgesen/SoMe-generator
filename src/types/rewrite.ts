export type RewriteRequest = {
  text: string;
  target?: RewriteField;
  results?: RewriteResult;
  customPrompt?: string;
};

export type RewriteField =
  | "facebook"
  | "instagram"
  | "linkedin"
  | "imageText"
  | "cta";

export type RewriteResult = {
  facebook: string;
  instagram: string;
  linkedin: string;
  imageText: string;
  cta: string;
};

export type RewriteErrorResponse = {
  error: string;
};

export type RewriteApiResponse = RewriteResult | RewriteErrorResponse;

export type RewriteExecutionResponse = {
  result: RewriteResult;
  sessionId: string;
};

export type UserRole = "user" | "admin";
export type UserStatus = "active" | "inactive";
export type PromptVisibility = "private" | "public";
export type PromptStatus = "active" | "hidden";

export type User = {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  createdAt: string;
};

export type PromptTemplate = {
  id: string;
  ownerId: string;
  ownerName: string;
  title: string;
  promptBody: string;
  visibility: PromptVisibility;
  status: PromptStatus;
  createdAt: string;
  updatedAt: string;
};

export type RewriteSession = {
  id: string;
  userId: string;
  inputText: string;
  fullPrompt: string;
  generatedResult: RewriteResult;
  createdAt: string;
  updatedAt: string;
};
