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
      newUrl = `http://${process.env.API_URL}/${urlCode}`
      isUrlUsed = await this.urlRepository.findOne({where:{shortenedUrl:newUrl}})
      console.log("url available?", isUrlUsed);
    }while(isUrlUsed!= null)

    await this.urlRepository.save({defaultUrl:createurlDto.url, shortenedUrl: newUrl, urlOwner: id});
     
    return {url: newUrl, message: "Url shortened successfully."}
  }

  async getUrlsByOwner(id: string){
    const query = await this.urlRepository.find({where:{urlOwner:id}});
    return query
  }

  async update(id:string, userId:string, newUrl:UpdateUrlDto){
    const isUrlOwner = await this.urlRepository.findOne({where:{id:parseInt(id)}});
    
    if(isUrlOwner.urlOwner != userId){
      throw new NotFoundException(`URL with ID ${id} not found`);
    }
    const urltoUpdate = await this.urlRepository.update(id,{defaultUrl: newUrl.url})

    return {id: id, message: "url deleted successfully"}
  }

  async delete(id:string, userId:string){
    
    const urlToDelete = await this.urlRepository.findOne({where:{id:parseInt(id)}});
    
    if(urlToDelete.urlOwner != userId){
      throw new NotFoundException(`URL with ID ${id} not found`);
    }
    await this.urlRepository.softDelete(id)

    return {id: id, message: "url deleted successfully"}
  }
}
