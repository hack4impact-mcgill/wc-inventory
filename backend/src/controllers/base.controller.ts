import { Response } from 'express';
import { Logger } from '../utils/logger.util';
import { Controller, Route } from 'tsoa';

@Route('/api')
export class BaseController extends Controller {
  protected logger: Logger;

  constructor() {
    super();
    this.logger = new Logger();
  }

}