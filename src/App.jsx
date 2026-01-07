import { useState } from 'react';
import useLocalStorage from './hooks/useLocalStorage';
import { 
  calculateRollingDays, 
  isVisaValidForDate, 
  calculateSafeUntil, 
  calculateReEntryDate 
} from './utils/schengenMath';
import MapChart from './components/MapChart';

const SCHENGEN_COUNTRIES = [
  { code: "AUT", name: "Austria" }, { code: "BEL", name: "Belgium" },
  { code: "HRV", name: "Croatia" }, { code: "CZE", name: "Czech Republic" },
  { code: "DNK", name: "Denmark" }, { code: "EST", name: "Estonia" },
  { code: "FIN", name: "Finland" }, { code: "FRA", name: "France" },
  { code: "DEU", name: "Germany" }, { code: "GRC", name: "Greece" },
  { code: "HUN", name: "Hungary" }, { code: "ISL", name: "Iceland" },
  { code: "ITA", name: "Italy" }, { code: "LVA", name: "Latvia" },
  { code: "LIE", name: "Liechtenstein" }, { code: "LTU", name: "Lithuania" },
  { code: "LUX", name: "Luxembourg" }, { code: "MLT", name: "Malta" },
  { code: "NLD", name: "Netherlands" }, { code: "NOR", name: "Norway" },
  { code: "POL", name: "Poland" }, { code: "PRT", name: "Portugal" },
  { code: "SVK", name: "Slovakia" }, { code: "SVN", name: "Slovenia" },
  { code: "ESP", name: "Spain" }, { code: "SWE", name: "Sweden" },
  { code: "CHE", name: "Switzerland" }
];

function App() {
  const [visas, setVisas] = useLocalStorage('myVisas', []);
  const [trips, setTrips] = useLocalStorage('myTrips', []);
  const [inputDate, setInputDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedCountries, setSelectedCountries] = useState([]);

  const daysUsed = calculateRollingDays(inputDate, trips);
  const hasVisa = isVisaValidForDate(inputDate, visas);
  const safeUntilDate = calculateSafeUntil(inputDate, trips);
  const reEntryDate = calculateReEntryDate(trips);

  const toggleCountry = (code) => {
    if (selectedCountries.includes(code)) {
      setSelectedCountries(selectedCountries.filter(c => c !== code));
    } else {
      setSelectedCountries([...selectedCountries, code]);
    }
  };

  const addTrip = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const newTrip = {
      id: Date.now(),
      name: formData.get('name'),
      countries: selectedCountries,
      start: formData.get('start'),
      end: formData.get('end'),
    };
    setTrips([...trips, newTrip]);
    setSelectedCountries([]); 
    e.target.reset();
  };

  const addVisa = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    setVisas([...visas, { id: Date.now(), name: formData.get('name'), start: formData.get('start'), end: formData.get('end') }]);
    e.target.reset();
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8 font-sans">
      <div className="max-w-3xl mx-auto bg-white p-6 rounded-xl shadow-lg">
        <h1 className="text-2xl font-bold mb-6 text-gray-800">Schengen Calculator 🇪🇺</h1>
        
        {/* DASHBOARD CARD */}
        <div className={`p-6 rounded-lg mb-8 text-center border-2 transition-colors ${daysUsed > 90 ? 'border-red-500 bg-red-50' : 'border-green-500 bg-green-50'}`}>
           <h2 className="text-5xl font-bold mb-2 text-gray-800">{daysUsed} <span className="text-2xl text-gray-500 font-normal">/ 90</span></h2>
           <p className="text-gray-600 mb-2">Days used in 180-day window ending on:</p>
           <input type="date" value={inputDate} onChange={(e) => setInputDate(e.target.value)} className="p-2 border rounded shadow-sm font-bold text-lg"/>
           <div className="mt-4 font-semibold">
             Visa Status: {hasVisa ? <span className="text-green-600 bg-green-100 px-2 py-1 rounded">Valid Visa ✅</span> : <span className="text-red-600 bg-red-100 px-2 py-1 rounded">No Visa ❌</span>}
           </div>
           <div className="mt-6 pt-6 border-t border-gray-400/20 text-left grid grid-cols-1 md:grid-cols-2 gap-4">
             <div>
               <div className="text-sm opacity-70">If you stay continuously from {inputDate}:</div>
               <div className="text-xl font-bold text-blue-800">Safe until: {safeUntilDate.toLocaleDateString()}</div>
             </div>
             <div>
               <div className="text-sm opacity-70">Re-entry Status:</div>
               {daysUsed < 90 ? <div className="text-xl font-bold text-green-700">Can enter today ✅</div> : <div className="text-xl font-bold text-orange-600">Wait until: {reEntryDate.toLocaleDateString()}</div>}
             </div>
           </div>
        </div>

        {/* INPUT GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          
          {/* TRIP COLUMN */}
          <div>
            <h3 className="font-bold text-lg mb-4 text-gray-700 border-b pb-2">1. Add Past/Future Trip</h3>
            <form onSubmit={addTrip} className="flex flex-col gap-3 mb-6 bg-gray-50 p-4 rounded-lg border border-gray-100">
              <input name="name" placeholder="Trip Name" required className="p-2 border rounded w-full" />
              <div>
                <label className="text-xs font-bold text-gray-500 mb-1 block">Select Countries:</label>
                <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto p-2 border rounded bg-white">
                  {SCHENGEN_COUNTRIES.map(c => (
                    <button key={c.code} type="button" onClick={() => toggleCountry(c.code)} className={`text-xs px-2 py-1 rounded border transition-colors ${selectedCountries.includes(c.code) ? "bg-blue-600 text-white border-blue-600" : "bg-white text-gray-600 border-gray-200 hover:bg-gray-100"}`}>{c.name}</button>
                  ))}
                </div>
              </div>
              
              {/* UPDATED DATE INPUTS WITH LABELS */}
              <div className="flex gap-2">
                <div className="w-full">
                  <label className="text-xs font-bold text-gray-500 mb-1 block">Start Date</label>
                  <input name="start" type="date" required className="p-2 border rounded w-full" />
                </div>
                <div className="w-full">
                  <label className="text-xs font-bold text-gray-500 mb-1 block">End Date</label>
                  <input name="end" type="date" required className="p-2 border rounded w-full" />
                </div>
              </div>

              <button className="bg-blue-600 text-white py-2 rounded font-bold hover:bg-blue-700">Add Trip</button>
            </form>
            <ul className="space-y-2 max-h-60 overflow-y-auto pr-2">{trips.map(t => (<li key={t.id} className="bg-white border p-3 rounded flex justify-between items-center shadow-sm"><div><div className="font-bold text-gray-800">{t.name}</div><div className="text-gray-500 text-xs mt-1">{t.start} ➝ {t.end}</div></div><button onClick={() => setTrips(trips.filter(x => x.id !== t.id))} className="text-gray-400 hover:text-red-500 font-bold px-2 text-xl">×</button></li>))}</ul>
          </div>

          {/* VISA COLUMN */}
          <div>
            <h3 className="font-bold text-lg mb-4 text-gray-700 border-b pb-2">2. Add Visa</h3>
            <form onSubmit={addVisa} className="flex flex-col gap-3 mb-6 bg-gray-50 p-4 rounded-lg border border-gray-100">
              <input name="name" placeholder="Visa Name" required className="p-2 border rounded" />
              
              {/* UPDATED DATE INPUTS WITH LABELS */}
              <div className="flex gap-2">
                <div className="w-full">
                  <label className="text-xs font-bold text-gray-500 mb-1 block">Start Date</label>
                  <input name="start" type="date" required className="p-2 border rounded w-full" />
                </div>
                <div className="w-full">
                  <label className="text-xs font-bold text-gray-500 mb-1 block">End Date</label>
                  <input name="end" type="date" required className="p-2 border rounded w-full" />
                </div>
              </div>

              <button className="bg-purple-600 text-white py-2 rounded font-bold hover:bg-purple-700">Add Visa</button>
            </form>
            <ul className="space-y-2">{visas.map(v => (<li key={v.id} className="bg-white border p-3 rounded shadow-sm"><div className="flex justify-between"><div className="font-bold text-purple-900">{v.name}</div><button onClick={() => setVisas(visas.filter(x => x.id !== v.id))} className="text-gray-400 hover:text-red-500 text-sm">Remove</button></div><div className="text-xs text-gray-500 mt-1">{v.start} ➝ {v.end}</div></li>))}</ul>
          </div>
        </div>

        {/* MAP */}
        <MapChart trips={trips} />

      </div>
    </div>
  );
}

export default App;