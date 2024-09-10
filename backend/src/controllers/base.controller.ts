import { Logger } from '../utils/logger.util';
import { Controller } from 'tsoa';

export class BaseController extends Controller {
  protected logger: Logger;

  constructor() {
    super();
    this.logger = new Logger();
  }

}