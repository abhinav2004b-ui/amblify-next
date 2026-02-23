import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
    return [
        {
            url: 'https://workwithabhinav.com',
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 1,
        },
        {
            url: 'https://workwithabhinav.com/services',
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 0.8,
        },
    ];
}
