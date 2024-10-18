import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { Url } from './entities/url.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUrlDto } from './dto/create-url.dto';
import { generateShortCode } from 'src/utils/utils';
import { JwtService } from '@nestjs/jwt';
import { UpdateUrlDto } from './dto/update-url.dto';

@Injectable()
export class UrlService {
  constructor(
    @InjectRepository(Url)
    private readonly urlRepository: Repository<Url>,
    private jwtService: JwtService,
    private readonly logger: Logger
  ) {}

  async create(createurlDto:CreateUrlDto, id?:string){
    this.logger.log('Create Url Service called');
    let isUrlUsed:Url | string = ''
    let newUrl:string = ''
    do {
      this.logger.log('Start generating the shortCode');
      const urlCode = generateShortCode(6)
      newUrl = urlCode
      isUrlUsed = await this.urlRepository.findOne({where:{shortenedUrl:newUrl}})
    }while(isUrlUsed!= null)

    this.logger.log(`Code generated: ${newUrl}. Data will be saved in DB`);
    await this.urlRepository.save({defaultUrl:createurlDto.url, shortenedUrl: newUrl, urlOwner: id});
    
    return {url: `http://${process.env.API_URL}/${newUrl}`, message: "Url shortened successfully."}
  }

  async getUrlsByOwner(id: string){
    this.logger.log('Get Urls by Owner Called');
    const query = await this.urlRepository.find({where:{urlOwner:id},select:['id','defaultUrl', 'shortenedUrl','clickCounter']});
    return query
  }

  async update(id:string, userId:string, newUrl:UpdateUrlDto){
    this.logger.log('Update Url Service called');
    const isUrlOwner = await this.urlRepository.findOne({where:{id:parseInt(id)}});
    
    if(isUrlOwner.urlOwner != userId){
      this.logger.error('Url not found in update');
      throw new NotFoundException(`URL with ID ${id} not found`);
    }
    this.logger.log(`New Url Data: ${newUrl.url}. Will be saved in DB`);
    await this.urlRepository.update(id,{defaultUrl: newUrl.url})

    return {id: id, message: "url updated successfully"}
  }

  async delete(id:string, userId:string){
    this.logger.log('Delete Url Service called');
    const urlToDelete = await this.urlRepository.findOne({where:{id:parseInt(id)}});
    
    if(urlToDelete.urlOwner != userId){
      this.logger.error('Url not found in update');
      throw new NotFoundException(`URL with ID ${id} not found`);
    }
    this.logger.log(`Url with ID ${id} will be deleted from DB`)
    await this.urlRepository.softDelete(id)

    return {id: id, message: "url deleted successfully"}
  }

  async redirectToLink(urlCode:string){
    this.logger.log('Url Redirect Service called');
    const targetUrl = await this.urlRepository.findOne({where:{shortenedUrl:urlCode}})
    
    if(targetUrl){
      this.logger.log('Target exists. Counting one more click and redirecting...');
      targetUrl.clickCounter += 1
      await this.urlRepository.save(targetUrl)
      return targetUrl.defaultUrl
    }
    throw new NotFoundException('URL not found');
  }
}
