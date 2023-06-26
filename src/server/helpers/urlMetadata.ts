import urlMetadata from "url-metadata";
import { z } from 'zod';

export const urlSchema = z.string().min(1).url();


export const getUrlMetadata = async (url: string) => {
    try {
        // Validate the URL using the emailSchema
        urlSchema.parse(url);
    } catch (error) {
        return null;
    }

    try {
        // Fetch the metadata
        const metadata = await urlMetadata(url);

        // Extract the necessary properties from the metadata
        const imageUrl = metadata.image || metadata['og:image'] || metadata['twitter:image'] || null;
        const title = metadata.title || metadata.name || metadata['og:title'] || metadata['twitter:title'] || null;

        // Validate the imageUrl using the emailSchema
        try {
            urlSchema.parse(imageUrl);
        } catch (error) {
            return null;
        }

        // Return the extracted metadata
        return {
            title: title?.toString(),
            url: metadata.url?.toString(),
            description: metadata.description?.toString(),
            imageUrl: imageUrl?.toString(),
        };
    } catch (error) {
        // Handle any errors during the metadata fetch
        return {
            title: '',
            url: url,
            description: '',
            imageUrl: url,
        }
    }
};


// export const getUrlMetadata = async (url: string) => {
//     try { emailSchema.parse(url); } catch (error) {return null }
//     let metadata = {
//         title: '',
//         url: url,
//         description: '',
//         imageUrl: url,
//     }
//       return await urlMetadata(url).then((metadata) => {
//         let imageUrl = metadata.image || metadata['og:image'] || metadata['twitter:image'] || null
//         try { emailSchema.parse(imageUrl); } catch (error) {imageUrl = null }
//         const title = metadata.title || metadata.name ||metadata['og:title'] || metadata['twitter:title'] || null
//         return {
//           title: title?.toString(),
//           url: metadata.url?.toString(),
//           description: metadata.description?.toString(),
//           imageUrl: imageUrl?.toString(),
//         }
//       })
//   }