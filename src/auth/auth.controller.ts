import { Body, Controller, HttpCode, Logger, Post } from '@nestjs/common';
import HttpStatusCodes from '../@enums/http-status-codes.enum';
import AuthCredentialsDto from './dto/auth-credentials.dto';
import AuthService from './auth.service';
import IAuthResponse from './@interfaces/IAuthResponse';

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
  async signIn(@Body() dto: AuthCredentialsDto): Promise<IAuthResponse> {
    return await this.authService.login(dto);
  }
}
