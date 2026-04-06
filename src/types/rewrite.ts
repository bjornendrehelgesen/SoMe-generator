export type RewriteRequest = {
  text: string;
  target?: RewriteField;
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
