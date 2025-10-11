export class HttpError extends Error {
  status: number;

  constructor(status: number, message: string) {
    super(message);
    this.status = status;
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export class BadRequestError extends HttpError {
  constructor(message = "Solicitud inválida") {
    super(400, message);
  }
}

export class ConflictError extends HttpError {
  constructor(message = "Conflicto de datos") {
    super(409, message);
  }
}

export class InternalServerError extends HttpError {
  constructor(message = "Error interno del servidor") {
    super(500, message);
  }
}
