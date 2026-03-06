/**
 * S3 Configuration
 * Manages AWS S3 credentials and bucket settings
 */

export interface S3Config {
  region: string;
  bucket: string;
  accessKeyId?: string;
  secretAccessKey?: string;
  cloudFrontDomain?: string;
}

export interface S3ConfigValidation {
  isValid: boolean;
  errors: string[];
}

// S3 Configuration from environment variables
export const s3Config: S3Config = {
  region: process.env.NEXT_PUBLIC_AWS_REGION || 'us-east-1',
  bucket: process.env.NEXT_PUBLIC_AWS_S3_BUCKET || '',
  accessKeyId: process.env.NEXT_PUBLIC_AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.NEXT_PUBLIC_AWS_SECRET_ACCESS_KEY,
  cloudFrontDomain: process.env.NEXT_PUBLIC_AWS_CLOUDFRONT_DOMAIN,
};

/**
 * Validate S3 configuration
 * @returns Validation result with any errors
 */
export function validateS3Config(): S3ConfigValidation {
  const errors: string[] = [];

  if (!s3Config.region) {
    errors.push('AWS region not configured (NEXT_PUBLIC_AWS_REGION)');
  }

  if (!s3Config.bucket) {
    errors.push('S3 bucket not configured (NEXT_PUBLIC_AWS_S3_BUCKET)');
  }

  if (!s3Config.accessKeyId) {
    errors.push('AWS access key ID not configured (NEXT_PUBLIC_AWS_ACCESS_KEY_ID)');
  }

  if (!s3Config.secretAccessKey) {
    errors.push('AWS secret access key not configured (NEXT_PUBLIC_AWS_SECRET_ACCESS_KEY)');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * Get the full URL for an S3 file
 * Uses CloudFront domain if available, otherwise falls back to S3 URL
 * @param key - The S3 object key
 * @returns Full URL to access the file
 */
export function getFileUrl(key: string): string {
  if (s3Config.cloudFrontDomain) {
    return `https://${s3Config.cloudFrontDomain}/${key}`;
  }

  // Fallback to direct S3 URL
  return `https://${s3Config.bucket}.s3.${s3Config.region}.amazonaws.com/${key}`;
}

/**
 * Debug helper to check S3 configuration
 * Logs configuration status without exposing sensitive credentials
 */
export function debugS3Config(): void {
  console.group('S3 Configuration Status');
  console.log('Region:', s3Config.region || '❌ Not set');
  console.log('Bucket:', s3Config.bucket || '❌ Not set');
  console.log('Access Key ID:', s3Config.accessKeyId ? '✅ Set' : '❌ Not set');
  console.log('Secret Access Key:', s3Config.secretAccessKey ? '✅ Set' : '❌ Not set');
  console.log('CloudFront Domain:', s3Config.cloudFrontDomain || 'Not configured (optional)');

  const validation = validateS3Config();
  if (!validation.isValid) {
    console.error('Configuration Errors:', validation.errors);
  } else {
    console.log('✅ All required configuration is set');
  }
  console.groupEnd();
}

/**
 * Check if S3 is properly configured
 * @returns true if all required configuration is present
 */
export function isS3Configured(): boolean {
  return validateS3Config().isValid;
}
