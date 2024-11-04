import { BadRequestException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import argon2 from 'argon2';


const characters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';


    // Função para gerar um código encurtado de 6 caracteres
    export function generateShortCode(length:number = 6):string {
        let shortCode:string = '';
        
        for (let i = 0; i < length; i++) {
            const randomIndex:number = Math.floor(Math.random() * characters.length);
            shortCode += characters[randomIndex];
        }
        return shortCode;
    }

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