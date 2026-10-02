import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import { CloudRain, MapPin, Send, ShieldCheck, AlertCircle, CheckCircle2, Wind, Droplets, ThermometerSun } from 'lucide-react';
import axios from 'axios';
import 'leaflet/dist/leaflet.css';

const API_BASE = 'http://localhost:8000/api';

const ReportForm = () => {
  const [formData, setFormData] = useState({
    report_type: 'Rain',
    description: '',
    latitude: null,
    longitude: null,
  });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const LocationMarker = () => {
    useMapEvents({
      click(e) {
        setFormData(prev => ({ ...prev, latitude: e.latlng.lat, longitude: e.latlng.lng }));
      },
    });
    return formData.latitude ? <Marker position={[formData.latitude, formData.longitude]} /> : null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.latitude || !formData.longitude) {
      alert('Please select a location on the map');
      return;
    }
    setLoading(true);
    try {
      await axios.post(`${API_BASE}/reports`, formData);
      setSubmitted(true);
    } catch (error) {
      console.error('Error submitting report:', error);
      alert('Failed to submit report. Please ensure the backend is running.');
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="max-w-md mx-auto text-center p-12 bg-white rounded-[2.5rem] shadow-2xl border border-slate-100 animate-in fade-in zoom-in duration-500">
        <div className="relative w-24 h-24 mx-auto mb-8">
          <div className="absolute inset-0 bg-green-100 rounded-full animate-ping opacity-20" />
          <div className="relative bg-green-100 w-24 h-24 rounded-full flex items-center justify-center">
            <CheckCircle2 className="text-green-600 w-12 h-12" />
          </div>
        </div>
        <h2 className="text-3xl font-black text-slate-900 mb-4 tracking-tight">Observation Logged</h2>
        <p className="text-slate-500 mb-10 leading-relaxed text-lg">
          Your report has been securely transmitted. Our <span className="text-brand-600 font-semibold">AI Trust Engine</span> is now cross-referencing this with satellite data.
        </p>
        <button
          onClick={() => setSubmitted(false)}
          className="w-full bg-slate-900 text-white py-5 rounded-2xl font-bold hover:bg-slate-800 transition-all shadow-xl active:scale-95"
        >
          Submit Another Report
        </button>
      </div>
    );
  }

  const reportTypes = [
    { id: 'Rain', icon: <Droplets className="w-5 h-5" />, label: 'Heavy Rain' },
    { id: 'Flood', icon: <CloudRain className="w-5 h-5" />, label: 'Flood Event' },
    { id: 'Storm', icon: <Wind className="w-5 h-5" />, label: 'Storm/Cyclone' },
    { id: 'Heatwave', icon: <ThermometerSun className="w-5 h-5" />, label: 'Heatwave' },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
      {/* Left: Interaction Panel */}
      <div className="lg:col-span-5 space-y-8">
        <div className="bg-white p-10 rounded-[2.5rem] shadow-2xl shadow-slate-200/60 border border-slate-100 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-brand-50 rounded-full -mr-16 -mt-16 blur-3xl opacity-50" />

          <div className="flex items-center gap-4 mb-10 relative">
            <div className="p-4 bg-brand-600 text-white rounded-2xl shadow-lg shadow-brand-200">
              <CloudRain className="w-7 h-7" />
            </div>
            <div>
              <h2 className="text-2xl font-black text-slate-900 tracking-tight">Submit Report</h2>
              <p className="text-sm text-slate-500 font-medium">Contribute to National Data Accuracy</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8 relative">
            {/* Phenom Type Selection */}
            <div className="space-y-3">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Observation Type</label>
              <div className="grid grid-cols-2 gap-3">
                {reportTypes.map((type) => (
                  <button
                    key={type.id}
                    type="button"
                    onClick={() => setFormData({...formData, report_type: type.id})}
                    className={`flex items-center gap-3 p-4 rounded-2xl text-sm font-bold transition-all border ${
                      formData.report_type === type.id
                        ? 'bg-brand-600 text-white border-brand-600 shadow-lg shadow-brand-200 ring-4 ring-brand-100'
                        : 'bg-white text-slate-600 border-slate-200 hover:border-brand-300 hover:bg-brand-50'
                    }`}
                  >
                    {type.icon} {type.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Description */}
            <div className="space-y-3">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Observation Details</label>
              <textarea
                className="w-full p-5 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-brand-100 focus:border-brand-500 outline-none transition-all h-40 resize-none text-slate-700 placeholder:text-slate-400 font-medium"
                placeholder="Describe the intensity, affected area, or visible impact..."
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                required
              />
            </div>

            {/* Location Indicator */}
            <div className={`p-5 rounded-2xl border transition-all flex items-center gap-4 ${
              formData.latitude
                ? 'bg-green-50 border-green-100 text-green-800'
                : 'bg-slate-50 border-slate-200 text-slate-500'
            }`}>
              <div className={`p-3 rounded-xl ${formData.latitude ? 'bg-green-500 text-white' : 'bg-slate-200 text-slate-400'}`}>
                <MapPin className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-bold">
                  {formData.latitude ? 'Geospatial coordinates locked' : 'Set location on map'}
                </p>
                <p className="text-xs opacity-80">
                  {formData.latitude
                    ? `${formData.latitude.toFixed(4)}N, ${formData.longitude.toFixed(4)}E`
                    : 'Tap anywhere on the map to begin'}
                </p>
              </div>
              {!formData.latitude && <AlertCircle className="w-5 h-5 animate-pulse" />}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-slate-900 text-white py-5 rounded-2xl font-black text-lg flex items-center justify-center gap-3 hover:bg-slate-800 transition-all shadow-2xl shadow-slate-300 active:scale-95 disabled:bg-slate-300 disabled:shadow-none"
            >
              {loading ? (
                <div className="w-6 h-6 border-3 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <><Send className="w-6 h-6" /> Broadcast Report</>
              )}
            </button>
          </form>
        </div>
      </div>

      {/* Right: Geospatial Interface */}
      <div className="lg:col-span-7 h-[650px] rounded-[2.5rem] overflow-hidden shadow-2xl border-8 border-white relative group">
        <div className="absolute top-6 left-6 z-[1000] bg-white/90 backdrop-blur-md px-5 py-2.5 rounded-full shadow-lg border border-slate-200 text-xs font-black text-slate-800 flex items-center gap-3">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-ping" />
          LIVE GEOSPATIAL ENGINE
        </div>
        <MapContainer center={[20.5937, 78.9629]} zoom={5} style={{ height: '100%', width: '100%' }} zoomControl={false}>
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          <LocationMarker />
        </MapContainer>
      </div>
    </div>
  );
};

export default ReportForm;
