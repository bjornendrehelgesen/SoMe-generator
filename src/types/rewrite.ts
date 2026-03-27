export type RewriteRequest = {
  text: string;
};

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
