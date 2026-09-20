import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, MapPin, Maximize2 } from 'lucide-react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Modal from '../../components/ui/Modal';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';
import StatusBadge from '../../components/ui/StatusBadge';
import SearchBar from '../../components/ui/SearchBar';
import { mockFarms } from '../../data/mockData';
import { formatArea } from '../../utils/formatters';
import { AREA_UNITS } from '../../utils/constants';

export default function FarmsPage() {
  const [showModal, setShowModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [formData, setFormData] = useState({ name: '', location: '', area: '', areaUnit: 'acres' });
  const navigate = useNavigate();

  const filteredFarms = mockFarms.filter(
    (f) =>
      f.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Call farmService.addFarm()
    setShowModal(false);
    setFormData({ name: '', location: '', area: '', areaUnit: 'acres' });
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 lg:hidden">My Farms</h1>
          <p className="text-slate-500">Manage your farms and monitor health status.</p>
        </div>
        <Button icon={<Plus className="w-4 h-4" />} onClick={() => setShowModal(true)}>
          Add Farm
        </Button>
      </div>

      <SearchBar
        placeholder="Search farms by name or location..."
        onSearch={setSearchQuery}
        className="max-w-md"
      />

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredFarms.map((farm) => (
          <Card
            key={farm.id}
            hover
            onClick={() => navigate(`/app/farms/${farm.id}`)}
          >
            <div className="flex items-start justify-between mb-3">
              <div>
                <h3 className="text-lg font-bold text-slate-800">{farm.name}</h3>
                <div className="flex items-center gap-1.5 text-sm text-slate-500 mt-1">
                  <MapPin className="w-3.5 h-3.5" />
                  {farm.location}
                </div>
              </div>
              <StatusBadge status={farm.healthStatus} />
            </div>
            <div className="grid grid-cols-2 gap-3 mt-4 pt-4 border-t border-slate-100">
              <div className="flex items-center gap-2">
                <Maximize2 className="w-4 h-4 text-slate-400" />
                <div>
                  <div className="text-xs text-slate-500">Area</div>
                  <div className="text-sm font-semibold text-slate-700">
                    {formatArea(farm.area, farm.areaUnit)}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 text-slate-400 text-center text-xs">🌱</div>
                <div>
                  <div className="text-xs text-slate-500">Crops</div>
                  <div className="text-sm font-semibold text-slate-700">{farm.cropCount}</div>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Add Farm Modal */}
      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Add New Farm" size="lg">
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Farm Name"
            placeholder="e.g., Green Valley Farm"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
          <Input
            label="Location"
            placeholder="e.g., Punjab, India"
            value={formData.location}
            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
            icon={<MapPin className="w-4 h-4" />}
          />
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Area"
              type="number"
              placeholder="e.g., 25"
              value={formData.area}
              onChange={(e) => setFormData({ ...formData, area: e.target.value })}
            />
            <Select
              label="Unit"
              value={formData.areaUnit}
              onChange={(e) => setFormData({ ...formData, areaUnit: e.target.value })}
              options={AREA_UNITS.map((u) => ({ value: u, label: u }))}
            />
          </div>
          <div className="flex justify-end gap-3 pt-4">
            <Button variant="outline" onClick={() => setShowModal(false)} type="button">
              Cancel
            </Button>
            <Button type="submit">Add Farm</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
