import React from "react";

export interface StorageFormProps {
  value: {
    provider: string;
    region: string;
    bucket: string;
    accessKeyId: string;
    secretAccessKey: string;
    endpoint?: string;
    isActive: boolean;
    isDefault?: boolean;
    name?: string;
    description?: string;
  };
  onChange: (value: any) => void;
  fieldErrors?: Record<string, string>;
}

const providerOptions = [
  { value: "aws-s3", label: "AWS S3" },
  { value: "cloudflare-r2", label: "Cloudflare R2" },
  { value: "digitalocean-spaces", label: "DigitalOcean Spaces" },
  { value: "backblaze-b2", label: "Backblaze B2" },
  { value: "wasabi", label: "Wasabi" },
];

const StorageForm: React.FC<StorageFormProps> = ({ value, onChange, fieldErrors }) => {
  return (
    <form className="space-y-4">
      <div>
        <label>Provider</label>
        <select
          value={value.provider}
          onChange={e => onChange({ ...value, provider: e.target.value })}
          className="w-full border rounded px-2 py-1"
        >
          <option value="">Select provider</option>
          {providerOptions.map(opt => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
        {fieldErrors?.provider && <div className="text-red-500 text-xs">{fieldErrors.provider}</div>}
      </div>
      <div>
        <label>Region</label>
        <input
          type="text"
          value={value.region}
          onChange={e => onChange({ ...value, region: e.target.value })}
          className="w-full border rounded px-2 py-1"
        />
        {fieldErrors?.region && <div className="text-red-500 text-xs">{fieldErrors.region}</div>}
      </div>
      <div>
        <label>Bucket</label>
        <input
          type="text"
          value={value.bucket}
          onChange={e => onChange({ ...value, bucket: e.target.value })}
          className="w-full border rounded px-2 py-1"
        />
        {fieldErrors?.bucket && <div className="text-red-500 text-xs">{fieldErrors.bucket}</div>}
      </div>
      <div>
        <label>Access Key ID</label>
        <input
          type="text"
          value={value.accessKeyId}
          onChange={e => onChange({ ...value, accessKeyId: e.target.value })}
          className="w-full border rounded px-2 py-1"
        />
        {fieldErrors?.accessKeyId && <div className="text-red-500 text-xs">{fieldErrors.accessKeyId}</div>}
      </div>
      <div>
        <label>Secret Access Key</label>
        <input
          type="password"
          value={value.secretAccessKey}
          onChange={e => onChange({ ...value, secretAccessKey: e.target.value })}
          className="w-full border rounded px-2 py-1"
        />
        {fieldErrors?.secretAccessKey && <div className="text-red-500 text-xs">{fieldErrors.secretAccessKey}</div>}
      </div>
      <div>
        <label>Endpoint (optional)</label>
        <input
          type="text"
          value={value.endpoint || ""}
          onChange={e => onChange({ ...value, endpoint: e.target.value })}
          className="w-full border rounded px-2 py-1"
        />
      </div>
      <div>
        <label>Active</label>
        <input
          type="checkbox"
          checked={value.isActive}
          onChange={e => onChange({ ...value, isActive: e.target.checked })}
          className="ml-2"
        />
      </div>
      <div>
        <label>Default</label>
        <input
          type="checkbox"
          checked={!!value.isDefault}
          onChange={e => onChange({ ...value, isDefault: e.target.checked })}
          className="ml-2"
        />
      </div>
      <div>
        <label>Name (friendly)</label>
        <input
          type="text"
          value={value.name || ""}
          onChange={e => onChange({ ...value, name: e.target.value })}
          className="w-full border rounded px-2 py-1"
        />
      </div>
      <div>
        <label>Description</label>
        <textarea
          value={value.description || ""}
          onChange={e => onChange({ ...value, description: e.target.value })}
          className="w-full border rounded px-2 py-1"
        />
      </div>
    </form>
  );
};

export default StorageForm;