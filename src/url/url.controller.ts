import { BadRequestException, Body, Controller, Delete, Get, Headers, NotFoundException, Param, Patch, Post, Res } from '@nestjs/common';
import { UrlService } from './url.service';
import { Public } from 'src/common/decorators';
import { CreateUrlDto } from './dto/create-url.dto';
import { isValidId, jwtDecodeGetId } from 'src/utils/utils';
import { JwtService } from '@nestjs/jwt';
import { UpdateUrlDto } from './dto/update-url.dto';
import { Response } from 'express';

@Controller()
export class UrlController {
  constructor(private readonly urlService: UrlService, private readonly jwtService: JwtService) {}

  @Public()
  @Post('/url')
  async create(@Body() createUrlDto: CreateUrlDto, @Headers() headers:Record<string, string>) {
    try {
      const userId:string = await jwtDecodeGetId(this.jwtService,headers.authorization)
      return this.urlService.create(createUrlDto, userId);
    }catch (error) {
      throw new Error(error)
    }
  }

  @Get('/url')
  async getUrlsByOwner(@Headers() headers:Record<string, string>){
    try {
      const userId:string = await jwtDecodeGetId(this.jwtService,headers.authorization)
      return this.urlService.getUrlsByOwner(userId)
    }catch (error) {
      throw new Error(error)
    }
  }

  @Public()
  @Get(':urlCode')
  async redirectToLink(@Param('urlCode') code:string, @Res() res: Response){
    try {
      const originalUrl:string = await this.urlService.redirectToLink(code)
      return res.redirect(originalUrl);
    }catch (error) {
      throw new NotFoundException('URL not found');
    }
  }

  @Patch('url/:id')
  async updateUrl(@Param('id') id:string, @Headers() headers:Record<string, string>, @Body() updateUser: UpdateUrlDto){
    try {
      isValidId(id)
      const userId:string = await jwtDecodeGetId(this.jwtService,headers.authorization)
      return this.urlService.update(id, userId, updateUser)
    }catch (error) {
      throw new Error(error)
    }
  }

  @Delete('url/:id')
  async deleteUrl(@Param('id') id:string, @Headers() headers:Record<string, string>){
    try {
      isValidId(id)
      const userId:string = await jwtDecodeGetId(this.jwtService,headers.authorization)
      return this.urlService.delete(id, userId)
    }catch (error) {
      throw new Error(error)
    }
  }
}
