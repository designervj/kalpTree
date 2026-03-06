'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { UserPlus, Building2, Mail, Phone, Globe, Settings, Eye, Edit, Trash2 } from 'lucide-react';
import { FranchiseClient, Tenant } from '@/types';
import { toast } from 'sonner';

interface FranchiseClientManagerProps {
  className?: string;
}

interface ClientWithTenant extends FranchiseClient {
  tenant: Tenant;
}

export default function FranchiseClientManager({ className }: FranchiseClientManagerProps) {
  const { data: session } = useSession();
  const [clients, setClients] = useState<ClientWithTenant[]>([]);
  const [loading, setLoading] = useState(false);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [newClient, setNewClient] = useState({
    name: '',
    email: '',
    phone: '',
    slug: '',
    adminUser: {
      name: '',
      email: '',
      password: '',
    },
    relationshipType: 'direct' as 'direct' | 'referral' | 'partnership',
    commissionRate: 0,
    settings: {
      allowDirectAccess: true,
      shareAnalytics: false,
      customBranding: false,
    },
  });

  useEffect(() => {
    fetchClients();
  }, []);

  const fetchClients = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/admin/franchise/clients');
      if (response.ok) {
        const data = await response.json();
        setClients(data.clients);
      } else {
        throw new Error('Failed to fetch clients');
      }
    } catch (error) {
      console.error('Error fetching clients:', error);
      toast.error('Failed to load clients');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateClient = async () => {
    if (!newClient.name || !newClient.email || !newClient.slug ||
      !newClient.adminUser.name || !newClient.adminUser.email || !newClient.adminUser.password) {
      toast.error('Please fill in all required fields');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/admin/franchise/clients', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newClient),
      });

      if (response.ok) {
        toast.success('Client created successfully');
        setShowCreateDialog(false);
        resetNewClientForm();
        await fetchClients();
      } else {
        const error = await response.json();
        throw new Error(error.error || 'Failed to create client');
      }
    } catch (error: any) {
      console.error('Error creating client:', error);
      toast.error(error.message || 'Failed to create client');
    } finally {
      setLoading(false);
    }
  };

  const resetNewClientForm = () => {
    setNewClient({
      name: '',
      email: '',
      phone: '',
      slug: '',
      adminUser: {
        name: '',
        email: '',
        password: '',
      },
      relationshipType: 'direct',
      commissionRate: 0,
      settings: {
        allowDirectAccess: true,
        shareAnalytics: false,
        customBranding: false,
      },
    });
  };

  const generateSlugFromName = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  };

  const handleNameChange = (name: string) => {
    setNewClient(prev => ({
      ...prev,
      name,
      slug: generateSlugFromName(name),
    }));
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      active: 'default',
      suspended: 'destructive',
      terminated: 'secondary',
    } as const;

    return (
      <Badge variant={variants[status as keyof typeof variants] || 'secondary'}>
        {status}
      </Badge>
    );
  };

  const getRelationshipBadge = (type: string) => {
    const variants = {
      direct: 'default',
      referral: 'secondary',
      partnership: 'outline',
    } as const;

    return (
      <Badge variant={variants[type as keyof typeof variants] || 'secondary'}>
        {type}
      </Badge>
    );
  };

  if (!session?.user || session.user.role !== 'F') {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">
          You need franchise permissions to access this feature.
        </p>
      </div>
    );
  }

  return (
    <div className={`space-y-6 ${className}`}>
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Client Management</h2>
          <p className="text-muted-foreground">
            Manage your franchise clients and their access
          </p>
        </div>
        <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
          <DialogTrigger asChild>
            <Button className="flex items-center space-x-2">
              <UserPlus className="h-4 w-4" />
              <span>Add Client</span>
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Create New Client</DialogTitle>
              <DialogDescription>
                Add a new client to your franchise network
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-6">
              {/* Client Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Client Information</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="client-name">Business Name *</Label>
                    <Input
                      id="client-name"
                      value={newClient.name}
                      onChange={(e) => handleNameChange(e.target.value)}
                      placeholder="Acme Corp"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="client-slug">Subdomain *</Label>
                    <Input
                      id="client-slug"
                      value={newClient.slug}
                      onChange={(e) => setNewClient(prev => ({ ...prev, slug: e.target.value }))}
                      placeholder="acme-corp"
                    />
                    <p className="text-xs text-muted-foreground">
                      Will be: {newClient.slug}.yourdomain.com
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="client-email">Business Email *</Label>
                    <Input
                      id="client-email"
                      type="email"
                      value={newClient.email}
                      onChange={(e) => setNewClient(prev => ({ ...prev, email: e.target.value }))}
                      placeholder="contact@acmecorp.com"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="client-phone">Phone</Label>
                    <Input
                      id="client-phone"
                      value={newClient.phone}
                      onChange={(e) => setNewClient(prev => ({ ...prev, phone: e.target.value }))}
                      placeholder="+1 (555) 123-4567"
                    />
                  </div>
                </div>
              </div>

              {/* Admin User */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Admin User</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="admin-name">Admin Name *</Label>
                    <Input
                      id="admin-name"
                      value={newClient.adminUser.name}
                      onChange={(e) => setNewClient(prev => ({
                        ...prev,
                        adminUser: { ...prev.adminUser, name: e.target.value }
                      }))}
                      placeholder="John Doe"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="admin-email">Admin Email *</Label>
                    <Input
                      id="admin-email"
                      type="email"
                      value={newClient.adminUser.email}
                      onChange={(e) => setNewClient(prev => ({
                        ...prev,
                        adminUser: { ...prev.adminUser, email: e.target.value }
                      }))}
                      placeholder="admin@acmecorp.com"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="admin-password">Temporary Password *</Label>
                  <Input
                    id="admin-password"
                    type="password"
                    value={newClient.adminUser.password}
                    onChange={(e) => setNewClient(prev => ({
                      ...prev,
                      adminUser: { ...prev.adminUser, password: e.target.value }
                    }))}
                    placeholder="Temporary password"
                  />
                  <p className="text-xs text-muted-foreground">
                    The admin user will be prompted to change this on first login
                  </p>
                </div>
              </div>

              {/* Relationship Settings */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Relationship Settings</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="relationship-type">Relationship Type</Label>
                    <Select
                      value={newClient.relationshipType}
                      onValueChange={(value: 'direct' | 'referral' | 'partnership') =>
                        setNewClient(prev => ({ ...prev, relationshipType: value }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="direct">Direct Client</SelectItem>
                        <SelectItem value="referral">Referral</SelectItem>
                        <SelectItem value="partnership">Partnership</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="commission-rate">Commission Rate (%)</Label>
                    <Input
                      id="commission-rate"
                      type="number"
                      min="0"
                      max="100"
                      step="0.1"
                      value={newClient.commissionRate}
                      onChange={(e) => setNewClient(prev => ({
                        ...prev,
                        commissionRate: parseFloat(e.target.value) || 0
                      }))}
                      placeholder="0"
                    />
                  </div>
                </div>
              </div>

              {/* Access Settings */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Access Settings</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="direct-access">Allow Direct Access</Label>
                      <p className="text-sm text-muted-foreground">
                        Client can access their admin panel directly
                      </p>
                    </div>
                    <Switch
                      id="direct-access"
                      checked={newClient.settings.allowDirectAccess}
                      onCheckedChange={(checked) => setNewClient(prev => ({
                        ...prev,
                        settings: { ...prev.settings, allowDirectAccess: checked }
                      }))}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="share-analytics">Share Analytics</Label>
                      <p className="text-sm text-muted-foreground">
                        Share analytics data with this client
                      </p>
                    </div>
                    <Switch
                      id="share-analytics"
                      checked={newClient.settings.shareAnalytics}
                      onCheckedChange={(checked) => setNewClient(prev => ({
                        ...prev,
                        settings: { ...prev.settings, shareAnalytics: checked }
                      }))}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="custom-branding">Custom Branding</Label>
                      <p className="text-sm text-muted-foreground">
                        Allow client to customize their branding
                      </p>
                    </div>
                    <Switch
                      id="custom-branding"
                      checked={newClient.settings.customBranding}
                      onCheckedChange={(checked) => setNewClient(prev => ({
                        ...prev,
                        settings: { ...prev.settings, customBranding: checked }
                      }))}
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end space-x-2 pt-4">
                <Button
                  variant="outline"
                  onClick={() => setShowCreateDialog(false)}
                  disabled={loading}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleCreateClient}
                  disabled={loading}
                >
                  {loading ? 'Creating...' : 'Create Client'}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Clients Table */}
      <Card>
        <CardHeader>
          <CardTitle>Your Clients</CardTitle>
          <CardDescription>
            Manage and monitor your franchise clients
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">Loading clients...</p>
            </div>
          ) : clients.length === 0 ? (
            <div className="text-center py-8">
              <Building2 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground mb-4">No clients yet</p>
              <Button
                onClick={() => setShowCreateDialog(true)}
                className="flex items-center space-x-2"
              >
                <UserPlus className="h-4 w-4" />
                <span>Add Your First Client</span>
              </Button>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Client</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Relationship</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Commission</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {clients.map((client) => (
                  <TableRow key={client._id.toString()}>
                    <TableCell>
                      <div>
                        <p className="font-medium">{client.tenant.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {client.tenant.slug}.yourdomain.com
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="flex items-center space-x-2">
                          <Mail className="h-3 w-3 text-muted-foreground" />
                          <span className="text-sm">{client.tenant.email}</span>
                        </div>
                        {client.tenant.phone && (
                          <div className="flex items-center space-x-2">
                            <Phone className="h-3 w-3 text-muted-foreground" />
                            <span className="text-sm">{client.tenant.phone}</span>
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      {getRelationshipBadge(client.relationshipType)}
                    </TableCell>
                    <TableCell>
                      {getStatusBadge(client.status)}
                    </TableCell>
                    <TableCell>
                      {client.commissionRate ? `${client.commissionRate}%` : 'N/A'}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Button variant="ghost" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Settings className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}