import { BadRequestException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import argon2 from 'argon2';
import shortid from 'shortid';
import { Url } from "src/url/entities/url.entity";
import { Repository } from "typeorm";

    export async function generateShortCode(repo:Repository<Url>) {
      const linkId = shortid.generate().substring(0,6);
      
      if(await repo.findOne({where:{shortenedUrl:linkId}})) return generateShortCode(repo)

      return linkId;
    };

    export async function jwtDecodeGetId(jwtService:JwtService, authorization:string) {
        if(authorization){
            const [type, token] = authorization.split(' ')
            const {id} = await jwtService.decode(token)
            return id
        }
        return null
    }

    export function isValidId(id:string){
        if(isNaN(parseInt(id))) throw new BadRequestException('ID must be a number');
    }

    export async function hashPassword(plainPassword: string): Promise<string> {
        try {
          const hashedPassword = await argon2.hash(plainPassword);
          console.log('Hashed password:', hashedPassword);
          return hashedPassword;
        } catch (error) {
            console.error('Error hashing password:', error);
          throw error;
        }
      }
      
    export async function verifyPassword(plainPassword: string, hashedPassword: string): Promise<boolean> {
        try {
          const isMatch = await argon2.verify(hashedPassword, plainPassword);
          console.log('Password match:', isMatch);
          return isMatch;
        } catch (error) {
            console.error('Error verifying password:', error);
          throw error;
        }
      }