import urlMetadata from "url-metadata";


export const getUrlMetadata = async (url?: string) => {
  
    if(url && typeof url === 'string') {
      return await urlMetadata(url).then((metadata) => {     
        const imageUrl = metadata.image || metadata['og:image'] || metadata['twitter:image'] || null
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