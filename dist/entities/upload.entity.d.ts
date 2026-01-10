export declare class Upload {
    id: number;
    publicId: string;
    url: string;
    secureUrl?: string;
    resourceType?: string;
    format?: string;
    originalFilename?: string;
    width?: number;
    height?: number;
    bytes?: number;
    tags?: string[];
    placeholder: boolean;
    createdAt: Date;
    updatedAt: Date;
}
