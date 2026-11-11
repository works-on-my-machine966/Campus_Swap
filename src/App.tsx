import React, { useState } from 'react';

interface ListingItem {
  id: number;
  title: string;
  category: string;
  type: 'Item' | 'Service';
  points: number;
  owner: string;
  location: string;
  condition: string;
  tags: string[];
  image: string;
}

const INITIAL_ITEMS: ListingItem[] = [
  {
    id: 1,
    title: "Digital Electronics Lab Kit (IC 7400, Mux, Breadboard)",
    category: "Lab Gear",
    type: "Item",
    points: 40,
    owner: "Rohan M. (ECE)",
    location: "Hostel J",
    condition: "Like New",
    tags: ["Electronics", "Circuits"],
    image: "⚡"
  },
  {
    id: 2,
    title: "1-on-1 Fast-Track Java & DSA Prep Session (45 mins)",
    category: "Skill Swap",
    type: "Service",
    points: 50,
    owner: "Ananya K. (COE)",
    location: "Library Discussion Room 3",
    condition: "Peer Tutoring",
    tags: ["Java", "Algorithms"],
    image: "💻"
  },
  {
    id: 3,
    title: "Engineering Chemistry Lab Manual + Titration Notes",
    category: "Books & Notes",
    type: "Item",
    points: 25,
    owner: "Simran T. (CHE)",
    location: "Hostel N",
    condition: "Good",
    tags: ["Chemistry", "Notes"],
    image: "📚"
  },
  {
    id: 4,
    title: "Ergonomic Desk Chair & Lumbar Support Cushion",
    category: "Dorm Essentials",
    type: "Item",
    points: 60,
    owner: "Kabir S. (ME)",
    location: "Hostel B",
    condition: "Used - Very Good",
    tags: ["Dorm", "Furniture"],
    image: "🪑"
  }
];

export default function App() {
  const [items, setItems] = useState<ListingItem[]>(INITIAL_ITEMS);
  const [userPoints, setUserPoints] = useState<number>(120);
  const [filter, setFilter] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [activeTab, setActiveTab] = useState<'explore' | 'create'>("explore");
  const [selectedItem, setSelectedItem] = useState<ListingItem | null>(null);
  const [showModal, setShowModal] = useState<boolean>(false);

  // Form State
  const [newTitle, setNewTitle] = useState("");
  const [newCategory, setNewCategory] = useState("Lab Gear");
  const [newPoints, setNewPoints] = useState<number>(30);
  const [newLocation, setNewLocation] = useState("Central Library");

  const handleTrade = (item: ListingItem) => {
    if (userPoints < item.points) {
      alert("Insufficient Campus Credits! Earn points by listing lab gear or offering peer tutoring.");
      return;
    }
    setUserPoints(prev => prev - item.points);
    setSelectedItem(item);
    setShowModal(true);
  };

  const handleCreateListing = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const newItem: ListingItem = {
      id: Date.now(),
      title: newTitle,
      category: newCategory,
      type: newCategory === "Skill Swap" ? "Service" : "Item",
      points: Number(newPoints),
      owner: "You (Verified Student)",
      location: newLocation || "Campus Center",
      condition: "Good",
      tags: ["CampusTrade"],
      image: newCategory === "Skill Swap" ? "🎓" : newCategory === "Lab Gear" ? "⚡" : "📦"
    };

    setItems([newItem, ...items]);
    setUserPoints(prev => prev + 15);
    setNewTitle("");
    setActiveTab("explore");
  };

  const filteredItems = items.filter(i => {
    const matchesFilter = filter === "All" || i.category === filter;
    const matchesSearch = i.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          i.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 md:p-8 font-sans">
      <div className="max-w-6xl mx-auto">
        
        {/* Top Header */}
        <header className="bg-slate-900/80 backdrop-blur-md rounded-2xl p-4 mb-8 flex flex-wrap justify-between items-center gap-4 border border-indigo-500/20">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center text-xl shadow-lg shadow-indigo-500/30">
              🔄
            </div>
            <div>
              <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-300">
                CampusSwap
              </h1>
              <p className="text-xs text-slate-400">Micro-Barter & Skill Exchange Platform</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="bg-slate-900 px-4 py-2 rounded-xl flex items-center gap-2 border border-emerald-500/30">
              <span>🪙</span>
              <span className="text-sm font-semibold text-emerald-400">{userPoints} Campus Credits</span>
            </div>
            <button 
              onClick={() => setActiveTab(activeTab === 'create' ? 'explore' : 'create')}
              className="bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium px-4 py-2 rounded-xl transition flex items-center gap-2 shadow-lg shadow-indigo-500/25">
              {activeTab === 'create' ? '📚 Browse Exchange' : '➕ List Item / Skill'}
            </button>
          </div>
        </header>

        {activeTab === 'explore' ? (
          <div>
            {/* Search & Filter Bar */}
            <div className="flex flex-col md:flex-row gap-4 mb-6 justify-between items-center">
              <div className="relative w-full md:w-80">
                <span className="absolute left-3 top-2.5 text-slate-400">🔍</span>
                <input 
                  type="text" 
                  placeholder="Search gear, notes, or skills..." 
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-4 py-2 text-xs text-slate-100 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="flex flex-wrap gap-2 w-full md:w-auto">
                {["All", "Lab Gear", "Skill Swap", "Books & Notes", "Dorm Essentials"].map(cat => (
                  <button
                    key={cat}
                    onClick={() => setFilter(cat)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-medium transition ${
                      filter === cat 
                        ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/25' 
                        : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
                    }`}>
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredItems.map(item => (
                <div key={item.id} className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 hover:border-indigo-500/40 transition flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start gap-2 mb-3">
                      <span className="text-3xl p-2.5 rounded-xl bg-slate-800 border border-slate-700/50">
                        {item.image}
                      </span>
                      <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                        {item.points} Credits
                      </span>
                    </div>
                    <h3 className="font-semibold text-base mb-1 text-slate-100">{item.title}</h3>
                    <div className="flex flex-wrap gap-3 text-xs text-slate-400 mb-4">
                      <span>👤 {item.owner}</span>
                      <span>📍 {item.location}</span>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between">
                    <span className="text-xs text-slate-400 bg-slate-800 px-2.5 py-1 rounded-lg">
                      {item.category}
                    </span>
                    <button
                      onClick={() => handleTrade(item)}
                      className="bg-slate-800 hover:bg-indigo-600 hover:text-white border border-slate-700 text-indigo-300 text-xs font-medium px-4 py-2 rounded-xl transition flex items-center gap-2">
                      Request Swap →
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          /* Create Form */
          <div className="max-w-xl mx-auto bg-slate-900 border border-indigo-500/30 rounded-2xl p-6">
            <h2 className="text-lg font-bold mb-1 text-slate-100">Create Campus Listing</h2>
            <p className="text-xs text-slate-400 mb-6">List items or peer tutoring sessions to earn credits instantly.</p>
            
            <form onSubmit={handleCreateListing} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Listing Title</label>
                <input 
                  type="text" 
                  placeholder="e.g. IC 74151 Mux + Breadboard OR FastAPI Tutoring" 
                  value={newTitle}
                  onChange={e => setNewTitle(e.target.value)}
                  required
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Category</label>
                  <select 
                    value={newCategory}
                    onChange={e => setNewCategory(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-indigo-500">
                    <option>Lab Gear</option>
                    <option>Skill Swap</option>
                    <option>Books & Notes</option>
                    <option>Dorm Essentials</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Credit Price</label>
                  <input 
                    type="number" 
                    value={newPoints}
                    onChange={e => setNewPoints(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Pickup / Meet Location</label>
                <input 
                  type="text" 
                  placeholder="e.g. Central Library / Hostel Block J"
                  value={newLocation}
                  onChange={e => setNewLocation(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <button 
                type="submit"
                className="w-full bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold py-2.5 rounded-xl transition shadow-lg shadow-indigo-500/25 mt-4">
                Publish Listing & Earn +15 Credits
              </button>
            </form>
          </div>
        )}

        {/* Modal */}
        {showModal && selectedItem && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-slate-900 border border-emerald-500/40 rounded-2xl p-6 max-w-sm w-full text-center">
              <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 text-2xl flex items-center justify-center mx-auto mb-3">
                ✓
              </div>
              <h3 className="text-base font-bold text-slate-100 mb-1">Swap Request Sent!</h3>
              <p className="text-xs text-slate-300 mb-4">
                Reserved <span className="text-indigo-400 font-semibold">{selectedItem.title}</span> for {selectedItem.points} Credits.
              </p>
              <div className="bg-slate-950 p-3 rounded-xl text-left text-xs text-slate-400 mb-4 space-y-1 border border-slate-800">
                <div><strong className="text-slate-200">Contact Owner:</strong> {selectedItem.owner}</div>
                <div><strong className="text-slate-200">Meet Location:</strong> {selectedItem.location}</div>
              </div>
              <button 
                onClick={() => setShowModal(false)}
                className="w-full bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold py-2 rounded-xl transition">
                Back to Feed
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}