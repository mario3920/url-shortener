import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/user/user.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService
  ) {}

  async signIn(email: string, pass: string): Promise<any> {
    const user = await this.userService.findByEmail(email);
    if(user?.password !== pass){
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = { sub: user.id, email: user.email}
    
    return {access_token: await this.jwtService.signAsync(payload)}
  }
}
