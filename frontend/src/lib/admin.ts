const baseAdminURL = "https://s3-admin-api.lut.li/v1";
const adminSecret = "orPjHrgY7GPcBASNt3o0TR0hvKsjOaIo3TuDNLjQlxk=";


export interface BucketInfo {
    id: string;
    globalAliases: string[];
    websiteAccess: boolean;
    websiteConfig: null;
    keys: Array<{
        accessKeyId: string;
        name: string;
        permissions: {
            read: boolean;
            write: boolean;
            owner: boolean;
        };
        bucketLocalAliases: string[];
    }>;
    objects: number;
    bytes: number;
    unfinishedUploads: number;
    unfinishedMultipartUploads: number;
    unfinishedMultipartUploadParts: number;
    unfinishedMultipartUploadBytes: number;
    quotas: {
        maxSize: null|number;
        maxObjects: null|number;
    };
}


/**
 * Retrieves information about a bucket with the specified ID. 
 * Note that the bucket ID is NOT the bucket global alias.
 *
 * @param {string} bucketId - The ID of the bucket to retrieve information for.
 * @return {Promise<BucketInfo>} A promise that resolves to the bucket information.
 */
export async function getBucketInfo(bucketId: string) {
    const res = await fetch(
        `${baseAdminURL}/bucket?id=${bucketId}`,
        {
          headers: {
            Authorization: `Bearer ${adminSecret}`,
          },
        }
      );
    return await res.json() as BucketInfo
}


export interface ListBucketsInfo {
    id: string;
    globalAliases: string[];
    localAliases: string[];
}

export async function listAllBuckets(){
    const res = await fetch(
        `${baseAdminURL}/bucket?list`,
        {
          headers: {
            Authorization: `Bearer ${adminSecret}`,
          },
        }
      );
    return await res.json() as ListBucketsInfo[]
}