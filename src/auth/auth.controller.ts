import { Body, Controller, HttpCode, Logger, Post } from '@nestjs/common';
import AuthCredentialsDto from './dto/auth-credentials.dto';
import AuthService from './auth.service';
import HttpStatusCodes from '../@enums/HttpStatusCodes';

@Controller('auth')
export default class AuthController {
  private logger = new Logger('AuthController');

  constructor(private authService: AuthService) {}

  @Post('/signup')
  async signUp(@Body() dto: AuthCredentialsDto): Promise<void> {
    await this.authService.createUser(dto);

    return;
  }

  @Post('/signin')
  @HttpCode(HttpStatusCodes.Ok)
  async signIn(@Body() dto: AuthCredentialsDto): Promise<string> {
    return await this.authService.signIn(dto);
  }
}
