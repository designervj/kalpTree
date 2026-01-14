import { ObjectId } from "mongodb";

/**
 * S3 Bucket Credentials Model
 * Store AWS S3 configuration per tenant
 */
export interface DataStorageModel {
  _id?: string | ObjectId;
  tenantId: string | ObjectId;
  websiteId?: string | ObjectId;
  
  // S3 Configuration
  provider: 'aws-s3' | 'cloudflare-r2' | 'digitalocean-spaces' | 'backblaze-b2' | 'wasabi';
  
  // AWS S3 / Compatible Storage Credentials
  region: string;
  bucket: string;
  accessKeyId: string;
  secretAccessKey: string;
  endpoint?: string; // For S3-compatible services
  
  // Optional CloudFront or CDN
  cloudFrontDomain?: string;
  cdnEnabled?: boolean;
  
  // Connection Settings
  forcePathStyle?: boolean; // Required for some S3-compatible services
  signatureVersion?: string; // Usually 'v4'
  
  // Status and Metadata
  isActive: boolean;
  isDefault?: boolean; // Mark as default storage for tenant
  name?: string; // Friendly name for the configuration
  description?: string;
  
  // Usage Statistics (optional)
  totalStorageUsed?: number; // in bytes
  totalFiles?: number;
  lastSyncedAt?: Date;
  
  // Security
  encryption?: {
    enabled: boolean;
    type?: 'AES256' | 'aws:kms';
    kmsKeyId?: string;
  };
  
  // Access Control
  publicAccess?: boolean;
  allowedFileTypes?: string[]; // ['image/*', 'video/*', 'application/pdf']
  maxFileSize?: number; // in bytes
  
  // Timestamps
  createdAt: Date;
  updatedAt: Date;
  createdBy?: string | ObjectId; // User ID who created this config
  updatedBy?: string | ObjectId; // User ID who last updated this config
  lastTestedAt?: Date; // Last connection test timestamp
  connectionStatus?: 'active' | 'failed' | 'untested';
}

/**
 * Create Data Storage Input (for API)
 */
export interface CreateDataStorageInput {
  provider: DataStorageModel['provider'];
  region: string;
  bucket: string;
  accessKeyId: string;
  secretAccessKey: string;
  endpoint?: string;
  cloudFrontDomain?: string;
  cdnEnabled?: boolean;
  forcePathStyle?: boolean;
  name?: string;
  description?: string;
  isActive?: boolean;
  isDefault?: boolean;
  publicAccess?: boolean;
  allowedFileTypes?: string[];
  maxFileSize?: number;
  encryption?: DataStorageModel['encryption'];
}

/**
 * Update Data Storage Input (for API)
 */
export interface UpdateDataStorageInput {
  region?: string;
  bucket?: string;
  accessKeyId?: string;
  secretAccessKey?: string;
  endpoint?: string;
  cloudFrontDomain?: string;
  cdnEnabled?: boolean;
  forcePathStyle?: boolean;
  name?: string;
  description?: string;
  isActive?: boolean;
  isDefault?: boolean;
  publicAccess?: boolean;
  allowedFileTypes?: string[];
  maxFileSize?: number;
  encryption?: DataStorageModel['encryption'];
}

/**
 * Data Storage Response (for API - excluding sensitive data)
 */
export interface DataStorageResponse {
  _id: string;
  tenantId: string;
  websiteId?: string;
  provider: string;
  region: string;
  bucket: string;
  endpoint?: string;
  cloudFrontDomain?: string;
  cdnEnabled?: boolean;
  isActive: boolean;
  isDefault?: boolean;
  name?: string;
  description?: string;
  totalStorageUsed?: number;
  totalFiles?: number;
  connectionStatus?: string;
  createdAt: Date;
  updatedAt: Date;
  lastTestedAt?: Date;
  // Note: accessKeyId and secretAccessKey are intentionally excluded
}

/**
 * S3 Connection Test Result
 */
export interface S3ConnectionTestResult {
  success: boolean;
  message: string;
  details?: {
    canList?: boolean;
    canWrite?: boolean;
    canRead?: boolean;
    canDelete?: boolean;
  };
  error?: string;
}
