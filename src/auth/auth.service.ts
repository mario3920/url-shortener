import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/user/user.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly logger: Logger
  ) {}

  async signIn(email: string, pass: string): Promise<any> {
    this.logger.log('Auth signIn Service called');
    const user = await this.userService.findByEmail(email);

    if(user?.password !== pass){
      this.logger.error("Invalid Credentials in SignIn")
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = { id: user.id, email: user.email}
    return {access_token: await this.jwtService.signAsync(payload)}
  }
}
