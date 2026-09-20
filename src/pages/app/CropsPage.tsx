import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Calendar, ScanLine } from 'lucide-react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Modal from '../../components/ui/Modal';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';
import StatusBadge from '../../components/ui/StatusBadge';
import Badge from '../../components/ui/Badge';
import SearchBar from '../../components/ui/SearchBar';
import { mockCrops, mockFarms } from '../../data/mockData';
import { formatDate } from '../../utils/formatters';

export default function CropsPage() {
  const [showModal, setShowModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    farmId: '',
    variety: '',
    plantingDate: '',
    expectedHarvestDate: '',
  });
  const navigate = useNavigate();

  const filteredCrops = mockCrops.filter(
    (c) =>
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.farmName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Call cropService.addCrop()
    setShowModal(false);
    setFormData({ name: '', farmId: '', variety: '', plantingDate: '', expectedHarvestDate: '' });
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 lg:hidden">My Crops</h1>
          <p className="text-slate-500">Track and manage all your crops.</p>
        </div>
        <Button icon={<Plus className="w-4 h-4" />} onClick={() => setShowModal(true)}>
          Add Crop
        </Button>
      </div>

      <SearchBar
        placeholder="Search crops by name or farm..."
        onSearch={setSearchQuery}
        className="max-w-md"
      />

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredCrops.map((crop) => (
          <Card
            key={crop.id}
            hover
            onClick={() => navigate(`/app/crops/${crop.id}`)}
          >
            <div className="flex items-start justify-between mb-2">
              <div>
                <h3 className="text-lg font-bold text-slate-800">{crop.name}</h3>
                <p className="text-sm text-slate-500">{crop.farmName}</p>
              </div>
              <StatusBadge status={crop.healthStatus} />
            </div>

            {crop.variety && (
              <p className="text-xs text-slate-400 mb-3">Variety: {crop.variety}</p>
            )}

            <div className="space-y-2 mt-3 pt-3 border-t border-slate-100">
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-500 flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5" />
                  Planted
                </span>
                <span className="font-medium text-slate-700">{formatDate(crop.plantingDate)}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-500">Growth Stage</span>
                <Badge variant="purple">{crop.growthStage}</Badge>
              </div>
              {crop.lastScanDate && (
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-500 flex items-center gap-1.5">
                    <ScanLine className="w-3.5 h-3.5" />
                    Last Scan
                  </span>
                  <span className="font-medium text-slate-700">{formatDate(crop.lastScanDate)}</span>
                </div>
              )}
            </div>
          </Card>
        ))}
      </div>

      {/* Add Crop Modal */}
      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Add New Crop" size="lg">
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Crop Name"
            placeholder="e.g., Tomato"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
          <Select
            label="Farm"
            value={formData.farmId}
            onChange={(e) => setFormData({ ...formData, farmId: e.target.value })}
            options={mockFarms.map((f) => ({ value: f.id, label: f.name }))}
            placeholder="Select a farm"
          />
          <Input
            label="Variety"
            placeholder="e.g., Roma, Basmati"
            value={formData.variety}
            onChange={(e) => setFormData({ ...formData, variety: e.target.value })}
          />
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Planting Date"
              type="date"
              value={formData.plantingDate}
              onChange={(e) => setFormData({ ...formData, plantingDate: e.target.value })}
            />
            <Input
              label="Expected Harvest"
              type="date"
              value={formData.expectedHarvestDate}
              onChange={(e) => setFormData({ ...formData, expectedHarvestDate: e.target.value })}
            />
          </div>
          <div className="flex justify-end gap-3 pt-4">
            <Button variant="outline" onClick={() => setShowModal(false)} type="button">
              Cancel
            </Button>
            <Button type="submit">Add Crop</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
