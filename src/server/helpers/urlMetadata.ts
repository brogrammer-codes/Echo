import urlMetadata from "url-metadata";
import { z } from 'zod';

export const emailSchema = z.string().min(1).url();


export const getUrlMetadata = async (url: string) => {
    try { emailSchema.parse(url); } catch (error) {return null }     
      return await urlMetadata(url).then((metadata) => {     
        let imageUrl = metadata.image || metadata['og:image'] || metadata['twitter:image'] || null
        try { emailSchema.parse(imageUrl); } catch (error) {imageUrl = null }        
        const title = metadata.title || metadata.name ||metadata['og:title'] || metadata['twitter:title'] || null
        return {
          title: title?.toString(),
          url: metadata.url?.toString(),
          description: metadata.description?.toString(),
          imageUrl: imageUrl?.toString(),
        }
      })
  }