import { Injectable, NotFoundException } from '@nestjs/common';
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
  ) {}

  async create(createurlDto:CreateUrlDto, id?:string){
    let isUrlUsed:Url | string = ''
    let newUrl:string = ''
    do {
      const urlCode = generateShortCode(6)
      newUrl = urlCode
      isUrlUsed = await this.urlRepository.findOne({where:{shortenedUrl:newUrl}})
    }while(isUrlUsed!= null)

    await this.urlRepository.save({defaultUrl:createurlDto.url, shortenedUrl: newUrl, urlOwner: id});
     
    return {url: `http://${process.env.API_URL}/${newUrl}`, message: "Url shortened successfully."}
  }

  async getUrlsByOwner(id: string){
    const query = await this.urlRepository.find({where:{urlOwner:id},select:['id','defaultUrl', 'shortenedUrl','clickCounter']});
    return query
  }

  async update(id:string, userId:string, newUrl:UpdateUrlDto){
    const isUrlOwner = await this.urlRepository.findOne({where:{id:parseInt(id)}});
    
    if(isUrlOwner.urlOwner != userId){
      throw new NotFoundException(`URL with ID ${id} not found`);
    }
    const urltoUpdate = await this.urlRepository.update(id,{defaultUrl: newUrl.url})

    return {id: id, message: "url updated successfully"}
  }

  async delete(id:string, userId:string){
    
    const urlToDelete = await this.urlRepository.findOne({where:{id:parseInt(id)}});
    
    if(urlToDelete.urlOwner != userId){
      throw new NotFoundException(`URL with ID ${id} not found`);
    }
    await this.urlRepository.softDelete(id)

    return {id: id, message: "url deleted successfully"}
  }

  async redirectToLink(urlCode:string){
    const targetUrl = await this.urlRepository.findOne({where:{shortenedUrl:urlCode}})
    
    if(targetUrl){
      targetUrl.clickCounter += 1
      await this.urlRepository.save(targetUrl)
      return targetUrl.defaultUrl
    }
    throw new NotFoundException('URL not found');
  }
}
