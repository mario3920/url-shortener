import { Body, Controller, Get, HttpCode, HttpStatus, Post, Request, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from './auth.guard';
import { Public } from 'src/common/decorators';
import { LogInAuthDto } from './dto/auth.dto';
import { ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}


  @ApiResponse({ status: 200, description: 'Auth Success.'})
  @ApiResponse({ status: 500, description: 'Internal server error' })
  @Public()
  @HttpCode(HttpStatus.OK)
  @Post('login')
  signIn(@Body() signInDto: LogInAuthDto) {
    return this.authService.signIn(signInDto.email, signInDto.password);
  }
}