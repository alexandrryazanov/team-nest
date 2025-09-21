import {
  Controller,
  Get, Query,
} from '@nestjs/common';
import { CallbackService } from './callback.service';

@Controller('callback')
export class CallbackController {
  constructor(private readonly callbackService: CallbackService) {}

  @Get('/')
  getAll(@Query() params) {
    console.log('callback controller is started');
    return this.callbackService.getAll(params);
  }
}
