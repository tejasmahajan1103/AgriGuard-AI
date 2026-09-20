import { useState } from 'react';
import { Mail, Phone, Warehouse, Sprout, Calendar, Edit2 } from 'lucide-react';
import Card, { CardTitle } from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Modal from '../../components/ui/Modal';
import Input from '../../components/ui/Input';
import Avatar from '../../components/ui/Avatar';
import { useAuth } from '../../context/AuthContext';
import { mockFarms, mockCrops, mockScans } from '../../data/mockData';
import { formatDate } from '../../utils/formatters';

export default function ProfilePage() {
  const { user } = useAuth();
  const [showEditModal, setShowEditModal] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
  });

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Update profile via Cognito
    setShowEditModal(false);
  };

  if (!user) return null;

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-slate-800 lg:hidden">Profile</h1>
      </div>

      {/* Profile Card */}
      <Card>
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
          <Avatar name={user.name} size="xl" />
          <div className="flex-1 text-center sm:text-left">
            <h2 className="text-2xl font-bold text-slate-800">{user.name}</h2>
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mt-2 text-sm text-slate-500">
              <span className="flex items-center gap-1.5 justify-center sm:justify-start">
                <Mail className="w-4 h-4" />
                {user.email}
              </span>
              <span className="flex items-center gap-1.5 justify-center sm:justify-start">
                <Phone className="w-4 h-4" />
                {user.phone}
              </span>
            </div>
            <div className="flex items-center gap-1.5 justify-center sm:justify-start text-xs text-slate-400 mt-2">
              <Calendar className="w-3.5 h-3.5" />
              Member since {formatDate(user.createdAt)}
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            icon={<Edit2 className="w-3.5 h-3.5" />}
            onClick={() => setShowEditModal(true)}
          >
            Edit
          </Button>
        </div>
      </Card>

      {/* Farm Summary */}
      <div className="grid sm:grid-cols-3 gap-4">
        <Card className="text-center">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center mx-auto mb-3">
            <Warehouse className="w-6 h-6 text-emerald-600" />
          </div>
          <div className="text-2xl font-bold text-slate-800">{mockFarms.length}</div>
          <div className="text-sm text-slate-500">Total Farms</div>
        </Card>
        <Card className="text-center">
          <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center mx-auto mb-3">
            <Sprout className="w-6 h-6 text-blue-600" />
          </div>
          <div className="text-2xl font-bold text-slate-800">{mockCrops.length}</div>
          <div className="text-sm text-slate-500">Total Crops</div>
        </Card>
        <Card className="text-center">
          <div className="w-12 h-12 rounded-xl bg-purple-50 flex items-center justify-center mx-auto mb-3">
            <span className="text-2xl">📊</span>
          </div>
          <div className="text-2xl font-bold text-slate-800">{mockScans.length}</div>
          <div className="text-sm text-slate-500">Total Scans</div>
        </Card>
      </div>

      {/* Farm Details */}
      <Card>
        <CardTitle>My Farms</CardTitle>
        <div className="mt-4 space-y-3">
          {mockFarms.map((farm) => (
            <div key={farm.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
              <div>
                <p className="text-sm font-semibold text-slate-800">{farm.name}</p>
                <p className="text-xs text-slate-500">{farm.location} · {farm.area} {farm.areaUnit}</p>
              </div>
              <span className="text-xs text-slate-500">{farm.cropCount} crops</span>
            </div>
          ))}
        </div>
      </Card>

      {/* Edit Profile Modal */}
      <Modal isOpen={showEditModal} onClose={() => setShowEditModal(false)} title="Edit Profile">
        <form onSubmit={handleSave} className="space-y-4">
          <Input
            label="Name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
          <Input
            label="Email"
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            disabled
            helperText="Email cannot be changed"
          />
          <Input
            label="Phone"
            type="tel"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
          />
          <div className="flex justify-end gap-3 pt-4">
            <Button variant="outline" onClick={() => setShowEditModal(false)} type="button">
              Cancel
            </Button>
            <Button type="submit">Save Changes</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
