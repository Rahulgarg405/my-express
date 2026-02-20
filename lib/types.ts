import http from "http";

export type NextFunction = () => void;
export type Handler = (
  req: http.IncomingMessage,
  res: http.ServerResponse,
  next: NextFunction,
) => void;
