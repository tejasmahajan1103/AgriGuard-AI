import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, MapPin, Maximize2, Sprout } from 'lucide-react';
import Card, { CardTitle } from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import StatusBadge from '../../components/ui/StatusBadge';
import { mockFarms, mockCrops } from '../../data/mockData';
import { formatArea, formatDate } from '../../utils/formatters';

export default function FarmDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const farm = mockFarms.find((f) => f.id === id);
  const farmCrops = mockCrops.filter((c) => c.farmId === id);

  if (!farm) {
    return (
      <div className="text-center py-16">
        <p className="text-slate-500">Farm not found.</p>
        <Button variant="outline" onClick={() => navigate('/app/farms')} className="mt-4">
          Back to Farms
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <button
        onClick={() => navigate('/app/farms')}
        className="flex items-center gap-2 text-sm text-slate-500 hover:text-slate-700 transition-colors cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Farms
      </button>

      {/* Farm Header */}
      <Card>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-slate-800">{farm.name}</h1>
              <StatusBadge status={farm.healthStatus} size="md" />
            </div>
            <div className="flex items-center gap-4 mt-2 text-sm text-slate-500">
              <span className="flex items-center gap-1.5">
                <MapPin className="w-4 h-4" />
                {farm.location}
              </span>
              <span className="flex items-center gap-1.5">
                <Maximize2 className="w-4 h-4" />
                {formatArea(farm.area, farm.areaUnit)}
              </span>
              <span className="flex items-center gap-1.5">
                <Sprout className="w-4 h-4" />
                {farm.cropCount} crops
              </span>
            </div>
          </div>
          <Button variant="outline" onClick={() => navigate('/app/crops')}>
            Add Crop
          </Button>
        </div>
      </Card>

      {/* Map Placeholder */}
      <Card>
        <CardTitle>Farm Location</CardTitle>
        <div className="mt-4 h-48 bg-gradient-to-br from-emerald-50 to-green-50 rounded-xl border border-emerald-100 flex items-center justify-center">
          <div className="text-center">
            <MapPin className="w-8 h-8 text-emerald-400 mx-auto mb-2" />
            <p className="text-sm text-emerald-600 font-medium">{farm.location}</p>
            <p className="text-xs text-emerald-500 mt-1">Map integration coming in Phase 2</p>
          </div>
        </div>
      </Card>

      {/* Farm Crops */}
      <Card>
        <CardTitle>Crops ({farmCrops.length})</CardTitle>
        <div className="mt-4 space-y-3">
          {farmCrops.map((crop) => (
            <div
              key={crop.id}
              onClick={() => navigate(`/app/crops/${crop.id}`)}
              className="flex items-center justify-between p-4 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-emerald-100 flex items-center justify-center">
                  <Sprout className="w-5 h-5 text-emerald-600" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-800">{crop.name}</p>
                  <p className="text-xs text-slate-500">
                    {crop.variety} · Planted {formatDate(crop.plantingDate)}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <StatusBadge status={crop.healthStatus} />
                <span className="text-xs text-slate-500 hidden sm:block">{crop.growthStage}</span>
              </div>
            </div>
          ))}
          {farmCrops.length === 0 && (
            <p className="text-center py-8 text-sm text-slate-500">No crops added yet.</p>
          )}
        </div>
      </Card>
    </div>
  );
}
