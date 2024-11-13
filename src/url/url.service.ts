import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { Url } from './entities/url.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUrlDto } from './dto/create-url.dto';
import { JwtService } from '@nestjs/jwt';
import { UpdateUrlDto } from './dto/update-url.dto';
import { generateShortCode } from 'src/common/utils';

@Injectable()
export class UrlService {
  constructor(
    @InjectRepository(Url)
    private readonly urlRepository: Repository<Url>,
    private jwtService: JwtService,
    private readonly logger: Logger
  ) {}

  async create(createurlDto:CreateUrlDto, id?:string){
    let newUrl:string = await generateShortCode(this.urlRepository)

    await this.urlRepository.save({defaultUrl:createurlDto.url, shortenedUrl: newUrl, urlOwner: id});

    return {url: `http://${process.env.API_URL}/${newUrl}`, message: "Url shortened successfully."}
  }

  async getUrlsByOwner(id: string){
    const query = await this.urlRepository.find({where:{urlOwner:id},select:['id','defaultUrl', 'shortenedUrl','clickCounter']});
    return query
  }

  async update(id:string, userId:string, newUrl:UpdateUrlDto){
    const urlToUpdate = await this.urlRepository.findOne({where:{id:parseInt(id), urlOwner: userId}});
    
    if(!urlToUpdate){
      throw new NotFoundException(`URL with ID ${id} not found`);
    }

    await this.urlRepository.update(id,{defaultUrl: newUrl.url})

    return {id: id, message: "url updated successfully"}
  }

  async delete(id:string, userId:string){
    const urlToDelete = await this.urlRepository.findOne({where:{id:parseInt(id), urlOwner: userId}});
    
    if(!urlToDelete){
      throw new NotFoundException(`URL with ID ${id} not found`);
    }

    await this.urlRepository.softDelete(id)

    return {id: id, message: "url deleted successfully"}
  }

  async redirectToLink(urlCode:string){
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
