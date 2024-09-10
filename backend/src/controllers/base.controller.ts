import { Response } from 'express';
import { Logger } from '../utils/logger.util';

export class BaseController {
  protected logger: Logger;

  constructor() {
    this.logger = new Logger();
  }

}