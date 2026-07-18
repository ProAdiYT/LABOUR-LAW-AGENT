"use client";

import React, { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { 
  MapPin, 
  Building, 
  Shield, 
  Activity, 
  Briefcase, 
  Phone, 
  ExternalLink, 
  Filter,
  CheckCircle
} from "lucide-react";

export default function MapsHelpPage() {
  const { preferredLanguage } = useAuth();
  const isHi = preferredLanguage === "hi";

  const [filterType, setFilterType] = useState("All");
  const [selectedPlace, setSelectedPlace] = useState<any | null>(null);

  // Delhi help centres mock data
  const helpCentres = [
    {
      id: 1,
      name_en: "Delhi Labour Commissioner Office (HQ)",
      name_hi: "दिल्ली श्रम आयुक्त कार्यालय (मुख्यालय)",
      type: "Government",
      lat: 180, // Schematic map coordinate Y
      lng: 220, // Schematic map coordinate X
      address_en: "5, Sham Nath Marg, Civil Lines, Delhi, 110054",
      address_hi: "5, शाम नाथ मार्ग, सिविल लाइंस, दिल्ली, 110054",
      phone: "011-23963332",
      desc_en: "Main registration body for BOCW cards, labor inspections, and filing formal statutory complaints.",
      desc_hi: "BOCW कार्ड, श्रम निरीक्षण और औपचारिक कानूनी शिकायतों को दर्ज करने वाली मुख्य सरकारी संस्था।"
    },
    {
      id: 2,
      name_en: "Labour Office (North-West District)",
      name_hi: "श्रम कार्यालय (उत्तर-पश्चिम जिला)",
      type: "Government",
      lat: 110,
      lng: 150,
      address_en: "Nimri Colony, Ashok Vihar Phase IV, Delhi, 110052",
      address_hi: "निमरी कॉलोनी, अशोक विहार फेज IV, दिल्ली, 110052",
      phone: "011-27303334",
      desc_en: "Local district office handling wage claims and dispute settlement for N-W region workers.",
      desc_hi: "उत्तर-पश्चिम क्षेत्र के श्रमिकों के वेतन दावों और विवादों के निपटारे के लिए क्षेत्रीय जिला कार्यालय।"
    },
    {
      id: 3,
      name_en: "Delhi State Legal Services Authority (DSLSA)",
      name_hi: "दिल्ली राज्य कानूनी सेवा प्राधिकरण",
      type: "Legal Aid",
      lat: 250,
      lng: 230,
      address_en: "Patiala House Courts, New Delhi, 110001",
      address_hi: "पटियाला हाउस कोर्ट, नई दिल्ली, 110001",
      phone: "1516 (Helpline)",
      desc_en: "Provides free legal aid advocates for workers in court disputes and unpaid wages claims.",
      desc_hi: "अदालती मुकदमों और अवैतनिक वेतन दावों में श्रमिकों के लिए मुफ्त वकील (कानूनी सहायता) प्रदान करता है।"
    },
    {
      id: 4,
      name_en: "Chetnalaya NGO (Migrant Support Center)",
      name_hi: "चेतनालय एनजीओ (प्रवासी सहायता)",
      type: "NGO",
      lat: 80,
      lng: 240,
      address_en: "9-A, Market Flats, Jahangirpuri, Delhi, 110033",
      address_hi: "9-A, मार्केट फ्लैट्स, जहांगीरपुरी, दिल्ली, 110033",
      phone: "011-27632665",
      desc_en: "Prominent local NGO helping unorganized construction workers register online for welfare schemes.",
      desc_hi: "असंगठित निर्माण श्रमिकों को कल्याणकारी योजनाओं में ऑनलाइन पंजीकरण कराने में मदद करने वाली प्रमुख स्थानीय संस्था।"
    },
    {
      id: 5,
      name_en: "Sanjay Gandhi Memorial Hospital (SGMH)",
      name_hi: "संजय गांधी मेमोरियल अस्पताल",
      type: "Hospital",
      lat: 150,
      lng: 80,
      address_en: "Mangolpuri, Outer Ring Road, Delhi, 110083",
      address_hi: "मंगोलपुरी, आउटर रिंग रोड, दिल्ली, 110083",
      phone: "011-27922712",
      desc_en: "24x7 Government hospital in West Delhi handling free medical aid, trauma, and accident care.",
      desc_hi: "पश्चिम दिल्ली में 24x7 सरकारी अस्पताल, जो मुफ्त चिकित्सा सहायता और दुर्घटना उपचार प्रदान करता है।"
    },
    {
      id: 6,
      name_en: "Connaught Place Police Station",
      name_hi: "कनॉट प्लेस पुलिस स्टेशन",
      type: "Police",
      lat: 220,
      lng: 210,
      address_en: "Block B, Connaught Place, New Delhi, 110001",
      address_hi: "ब्लॉक बी, कनॉट प्लेस, नई दिल्ली, 110001",
      phone: "112 / 011-23341857",
      desc_en: "Emergency police assistance. Handle harassment claims and physical wage enforcement disputes.",
      desc_hi: "आपातकालीन पुलिस सहायता। उत्पीड़न और जबरन मजदूरी विवादों के मामलों में कार्रवाई।"
    }
  ];

  // Map markers icons mapping
  const getMarkerIconColor = (type: string) => {
    switch (type) {
      case "Government": return "bg-blue-500 text-white ring-blue-200";
      case "NGO": return "bg-green-500 text-white ring-green-200";
      case "Legal Aid": return "bg-amber-500 text-white ring-amber-200";
      case "Hospital": return "bg-rose-500 text-white ring-rose-200";
      case "Police": return "bg-slate-700 text-white ring-slate-200";
      default: return "bg-primary text-white";
    }
  };

  const filteredPlaces = helpCentres.filter(place => 
    filterType === "All" || place.type === filterType
  );

  const handleOpenGoogleMapsSearch = (name: string) => {
    const query = encodeURIComponent(`${name} Delhi`);
    window.open(`https://www.google.com/maps/search/?api=1&query=${query}`, "_blank");
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      
      {/* Page Header */}
      <div>
        <h2 className="text-xl font-bold">{isHi ? "नजदीकी सहायता केंद्र नक्शा" : "Nearby Help Centres Map"}</h2>
        <p className="text-xs text-slate-500">
          {isHi 
            ? "दिल्ली में श्रम कार्यालयों, एनजीओ, पुलिस थानों और अस्पतालों का पता लगाएं।" 
            : "Find local district offices, labor lawyers, emergency health units, and migrant rights support groups in Delhi NCR."
          }
        </p>
      </div>

      {/* Filter and Content layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        
        {/* Left Side: Directory List */}
        <div className="lg:col-span-4 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-sm flex flex-col h-[500px]">
          {/* Header & Filter */}
          <div className="space-y-3 pb-3 border-b border-slate-100 dark:border-slate-850 shrink-0">
            <h3 className="text-xs font-bold flex items-center gap-1.5">
              <Filter className="h-4 w-4 text-slate-400" />
              <span>Filter Help Centers</span>
            </h3>
            
            <div className="flex gap-1.5 overflow-x-auto pb-1 max-w-full no-scrollbar">
              {["All", "Government", "NGO", "Legal Aid", "Hospital", "Police"].map((type) => (
                <button
                  key={type}
                  onClick={() => {
                    setFilterType(type);
                    setSelectedPlace(null);
                  }}
                  className={`rounded-lg px-2.5 py-1 text-[10px] font-bold border transition-colors whitespace-nowrap ${
                    filterType === type
                      ? "bg-slate-800 dark:bg-slate-100 text-white dark:text-slate-900 border-transparent"
                      : "bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-500"
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          {/* Directory Listings */}
          <div className="flex-1 overflow-y-auto pt-3 space-y-3 pr-1">
            {filteredPlaces.map((place) => (
              <div
                key={place.id}
                onClick={() => setSelectedPlace(place)}
                className={`rounded-2xl border p-3.5 text-xs cursor-pointer transition-all ${
                  selectedPlace?.id === place.id
                    ? "bg-primary/5 border-primary/50"
                    : "bg-slate-50/50 dark:bg-slate-950/30 border-slate-100 dark:border-slate-850 hover:border-slate-300 dark:hover:border-slate-800"
                }`}
              >
                <div className="flex gap-2.5 items-start">
                  <div className={`h-6 w-6 rounded-lg flex items-center justify-center shrink-0 text-[10px] ${getMarkerIconColor(place.type).split(" ").slice(0, 2).join(" ")}`}>
                    <MapPin className="h-3.5 w-3.5" />
                  </div>
                  
                  <div className="space-y-1 overflow-hidden">
                    <h4 className="font-bold truncate text-slate-800 dark:text-slate-100">
                      {isHi ? place.name_hi : place.name_en}
                    </h4>
                    <span className="inline-block rounded bg-slate-200/50 dark:bg-slate-800 px-1.5 py-0.5 text-[9px] font-semibold text-slate-500">
                      {place.type}
                    </span>
                    <p className="text-[10px] text-slate-400 truncate mt-1">
                      {isHi ? place.address_hi : place.address_en}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Side: Schematic Interactive Map View */}
        <div className="lg:col-span-8 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 shadow-sm flex flex-col justify-between relative overflow-hidden h-[500px]">
          
          {/* Map canvas container */}
          <div className="flex-1 relative rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-900 overflow-hidden shadow-inner flex items-center justify-center">
            
            {/* Ambient Background Grid pattern to simulate map */}
            <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05] pointer-events-none" style={{ backgroundImage: "radial-gradient(circle, #2563EB 1px, transparent 1px)", backgroundSize: "24px 24px" }} />
            
            {/* Delhi Center marker circle guides */}
            <div className="absolute h-96 w-96 rounded-full border border-slate-200/50 dark:border-slate-800/30 pointer-events-none flex items-center justify-center">
              <div className="h-48 w-48 rounded-full border border-slate-200/50 dark:border-slate-800/30" />
            </div>
            
            {/* Delhi Map Overlay Label */}
            <div className="absolute top-4 left-4 rounded bg-slate-200/70 dark:bg-slate-800/50 px-2 py-1 text-[9px] font-bold text-slate-500 tracking-wider">
              DELHI NCT REGION (SCHEMATIC PREVIEW)
            </div>

            {/* Render Location Markers */}
            {filteredPlaces.map((place) => (
              <button
                key={place.id}
                onClick={() => setSelectedPlace(place)}
                style={{ top: `${place.lat}px`, left: `${place.lng}px` }}
                className={`absolute h-8 w-8 rounded-full flex items-center justify-center shadow-lg transition-transform hover:scale-110 active:scale-95 ring-4 ${getMarkerIconColor(place.type)}`}
                title={isHi ? place.name_hi : place.name_en}
              >
                <MapPin className="h-4.5 w-4.5" />
              </button>
            ))}

            {/* Center Label Marker */}
            <div className="absolute top-[200px] left-[200px] text-[10px] font-bold text-slate-400 bg-white/80 dark:bg-slate-900/80 px-2 py-0.5 rounded shadow border border-slate-100 dark:border-slate-800 flex items-center gap-1 pointer-events-none">
              <span className="h-2 w-2 rounded-full bg-primary" /> Connaught Place (Center)
            </div>
          </div>

          {/* Marker Details Drawer */}
          {selectedPlace ? (
            <div className="h-40 border-t border-slate-100 dark:border-slate-850 pt-4 bg-white dark:bg-slate-900 mt-2 shrink-0 flex flex-col md:flex-row gap-6 items-start justify-between">
              
              <div className="space-y-2 overflow-hidden flex-1">
                <div className="flex items-center gap-2">
                  <span className={`inline-block rounded px-2 py-0.5 text-[9px] font-bold ${getMarkerIconColor(selectedPlace.type).split(" ").slice(0, 2).join(" ")}`}>
                    {selectedPlace.type}
                  </span>
                  <h4 className="font-bold text-sm text-slate-800 dark:text-slate-100 truncate">
                    {isHi ? selectedPlace.name_hi : selectedPlace.name_en}
                  </h4>
                </div>
                
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed line-clamp-2">
                  {isHi ? selectedPlace.desc_hi : selectedPlace.desc_en}
                </p>
                
                <p className="text-[10px] text-slate-400">
                  Address: {isHi ? selectedPlace.address_hi : selectedPlace.address_en}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex md:flex-col gap-2 shrink-0 w-full md:w-auto">
                <a 
                  href={`tel:${selectedPlace.phone.split(" (")[0]}`}
                  className="flex-1 md:flex-none inline-flex items-center justify-center gap-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 px-4 py-2 text-xs font-semibold hover:bg-slate-50 dark:hover:bg-slate-850"
                >
                  <Phone className="h-3.5 w-3.5 text-primary" />
                  <span>Call: {selectedPlace.phone}</span>
                </a>
                
                <button
                  onClick={() => handleOpenGoogleMapsSearch(selectedPlace.name_en)}
                  className="flex-1 md:flex-none inline-flex items-center justify-center gap-1.5 rounded-xl bg-primary text-white px-4 py-2 text-xs font-semibold hover:bg-primary-hover shadow-md shadow-primary/10"
                >
                  <ExternalLink className="h-3.5 w-3.5" />
                  <span>Get Directions</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="h-10 text-center text-xs text-slate-400 py-3 mt-2 shrink-0 border-t border-slate-100 dark:border-slate-850">
              Select a marker on the map or in the directory list to see detailed contacts.
            </div>
          )}

        </div>

      </div>

    </div>
  );
}
