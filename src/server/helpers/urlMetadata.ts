import urlMetadata from "url-metadata";
import { z } from 'zod';

export const emailSchema = z.string().min(1).url();

export const getUrlMetadata = async (url?: string) => {
  
    if(url && typeof url === 'string') {
      return await urlMetadata(url).then((metadata) => {     
        let imageUrl = metadata.image || metadata['og:image'] || metadata['twitter:image'] || null
        try { emailSchema.parse(imageUrl); } catch (error) {imageUrl = null }
        const title = metadata.title || metadata['og:title'] || metadata['twitter:title'] || null
        return {
          title,
          url: metadata.url,
          description: metadata.description,
          imageUrl: imageUrl,
        }
      })
    }
  }