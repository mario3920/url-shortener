import { Body, Controller, Delete, Get, Headers, Param, Patch, Post } from '@nestjs/common';
import { UrlService } from './url.service';
import { Public } from 'src/common/decorators';
import { CreateUrlDto } from './dto/create-url.dto';
import { jwtDecodeGetId } from 'src/utils/utils';
import { JwtService } from '@nestjs/jwt';
import { UpdateUrlDto } from './dto/update-url.dto';

@Controller('url')
export class UrlController {
  constructor(private readonly urlService: UrlService, private readonly jwtService: JwtService) {}

  @Public()
  @Post()
  async create(@Body() createUrlDto: CreateUrlDto, @Headers() headers:Record<string, string>) {
    const userId:string = await jwtDecodeGetId(this.jwtService,headers.authorization)
    return this.urlService.create(createUrlDto, userId);
  }

  @Get()
  async getUrlsByOwner(@Headers() headers:Record<string, string>){
    const userId:string = await jwtDecodeGetId(this.jwtService,headers.authorization)
    return this.urlService.getUrlsByOwner(userId)
  }

  @Patch(':id')
  async updateUrl(@Param('id') id:string, @Headers() headers:Record<string, string>, @Body() updateUser: UpdateUrlDto){
    const userId:string = await jwtDecodeGetId(this.jwtService,headers.authorization)
    return this.urlService.update(id, userId, updateUser)
  }

  @Delete(':id')
  async deleteUrl(@Param('id') id:string, @Headers() headers:Record<string, string>){
    const userId:string = await jwtDecodeGetId(this.jwtService,headers.authorization)
    return this.urlService.delete(id, userId)
  }
}
