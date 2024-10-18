import { BadRequestException, Body, Controller, Delete, Get, Headers, NotFoundException, Param, Patch, Post, Res } from '@nestjs/common';
import { UrlService } from './url.service';
import { Public } from 'src/common/decorators';
import { CreateUrlDto } from './dto/create-url.dto';
import { isValidId, jwtDecodeGetId } from 'src/utils/utils';
import { JwtService } from '@nestjs/jwt';
import { UpdateUrlDto } from './dto/update-url.dto';
import { Response } from 'express';
import { ApiBearerAuth, ApiParam, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Url } from './entities/url.entity';

@ApiBearerAuth()
@ApiTags('Urls')
@Controller()
export class UrlController {
  constructor(private readonly urlService: UrlService, private readonly jwtService: JwtService) {}
  
  @ApiResponse({ status: 201, description: 'Url created Successfully'})
  @ApiResponse({ status: 500, description: 'Internal server error' })
  @Public()
  @Post('/url')
  async create(@Body() createUrlDto: CreateUrlDto, @Headers() headers:Record<string, string>) {
    try {
      const userId:string = await jwtDecodeGetId(this.jwtService,headers.authorization)
      return this.urlService.create(createUrlDto, userId);
    }catch (error) {
      return error.response
    }
  }

  @ApiResponse({ status: 200, description: 'Urls generated by User.', type: Url, isArray: true })
  @ApiResponse({ status: 404, description: 'Url not found.' })
  @ApiResponse({ status: 500, description: 'Internal server error.' })
  @Get('/url')
  async getUrlsByOwner(@Headers() headers:Record<string, string>){
    try {
      const userId:string = await jwtDecodeGetId(this.jwtService,headers.authorization)
      return this.urlService.getUrlsByOwner(userId)
    }catch (error) {
      return error.response
    }
  }

  @ApiResponse({ status: 301, description: 'Redirected to target page.'})
  @ApiResponse({ status: 404, description: 'Url not found.' })
  @ApiResponse({ status: 500, description: 'Internal server error.' })
  @ApiQuery({ name: 'urlCode', required: true, description: 'Generated code by the shortener' })
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

  @ApiResponse({ status: 200, description: 'Url updated Successfully'})
  @ApiResponse({ status: 404, description: 'Url not found.' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  @ApiQuery({ name: 'id', required: true, description: 'Url ID' })
  @Patch('url/:id')
  async updateUrl(@Param('id') id:string, @Headers() headers:Record<string, string>, @Body() updateUser: UpdateUrlDto){
    try {
      isValidId(id)
      const userId:string = await jwtDecodeGetId(this.jwtService,headers.authorization)
      return this.urlService.update(id, userId, updateUser)
    }catch (error) {
      return error.response
    }
  }

  @ApiResponse({ status: 200, description: 'Url deleted Successfully'})
  @ApiResponse({ status: 404, description: 'Url not found.'})
  @ApiResponse({ status: 500, description: 'Internal server error' })
  @ApiQuery({ name: 'id', required: true, description: 'Url ID'})
  @Delete('url/:id')
  async deleteUrl(@Param('id') id:string, @Headers() headers:Record<string, string>){
    try {
      isValidId(id)
      const userId:string = await jwtDecodeGetId(this.jwtService,headers.authorization)
      return this.urlService.delete(id, userId)
    }catch (error) {
      return error.response
    }
  }
}
