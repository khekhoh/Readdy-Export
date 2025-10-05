
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface LibraryItem {
  id: string;
  title: string;
  type: 'case-study' | 'guideline' | 'assessment' | 'soap-template' | 'evidence' | 'tutorial';
  category: string;
  difficulty?: 'basic' | 'intermediate' | 'advanced' | 'extreme';
  description: string;
  tags: string[];
  lastUpdated: string;
  author: string;
  downloads: number;
  rating: number;
  isFavorite: boolean;
}

export default function Library() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedType, setSelectedType] = useState('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState('all');
  const [sortBy, setSortBy] = useState('recent');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [favorites, setFavorites] = useState<string[]>([]);

  const categories = [
    'Drug Therapy Problems',
    'Medication Safety',
    'Clinical Pharmacokinetics',
    'Drug Interactions',
    'Patient Counseling',
    'Chronic Disease Management',
    'Pain Management',
    'Infectious Diseases',
    'Cardiology Pharmacy',
    'Critical Care',
    'Geriatric Pharmacy',
    'Pediatric Pharmacy'
  ];

  const resourceTypes = [
    { id: 'case-study', label: 'Case Studies', icon: 'ri-file-text-line', color: 'text-blue-400' },
    { id: 'guideline', label: 'Clinical Guidelines', icon: 'ri-book-open-line', color: 'text-green-400' },
    { id: 'assessment', label: 'Assessments', icon: 'ri-question-line', color: 'text-purple-400' },
    { id: 'soap-template', label: 'SOAP Templates', icon: 'ri-file-copy-line', color: 'text-yellow-400' },
    { id: 'evidence', label: 'Evidence Base', icon: 'ri-shield-check-line', color: 'text-teal-400' },
    { id: 'tutorial', label: 'Tutorials', icon: 'ri-play-circle-line', color: 'text-red-400' }
  ];

  const libraryItems: LibraryItem[] = [
    {
      id: '1',
      title: 'Heart Failure Medication Management Case Series',
      type: 'case-study',
      category: 'Cardiology Pharmacy',
      difficulty: 'advanced',
      description: 'Comprehensive case studies covering ACE inhibitor optimization, diuretic management, and beta-blocker titration in heart failure patients.',
      tags: ['heart failure', 'ACE inhibitors', 'diuretics', 'medication optimization'],
      lastUpdated: '2024-01-15',
      author: 'Dr. Sarah Johnson, PharmD',
      downloads: 1247,
      rating: 4.8,
      isFavorite: false
    },
    {
      id: '2',
      title: 'Warfarin Dosing and Monitoring Protocol',
      type: 'guideline',
      category: 'Drug Therapy Problems',
      difficulty: 'intermediate',
      description: 'Evidence-based protocol for warfarin initiation, dose adjustment, and INR monitoring with clinical decision trees.',
      tags: ['anticoagulation', 'warfarin', 'INR monitoring', 'drug interactions'],
      lastUpdated: '2024-01-12',
      author: 'Clinical Pharmacy Team',
      downloads: 892,
      rating: 4.9,
      isFavorite: true
    },
    {
      id: '3',
      title: 'Drug Therapy Problems Assessment Bank',
      type: 'assessment',
      category: 'Drug Therapy Problems',
      difficulty: 'intermediate',
      description: 'Collection of 50 validated questions focusing on identification and resolution of drug-related problems in various clinical scenarios.',
      tags: ['drug therapy problems', 'pharmaceutical care', 'clinical assessment'],
      lastUpdated: '2024-01-10',
      author: 'Dr. Michael Chen, PharmD',
      downloads: 2156,
      rating: 4.7,
      isFavorite: false
    },
    {
      id: '4',
      title: 'Emergency Medicine SOAP Note Templates',
      type: 'soap-template',
      category: 'Clinical Documentation',
      description: 'Standardized SOAP note templates for common emergency department presentations with pharmaceutical care focus.',
      tags: ['emergency medicine', 'SOAP notes', 'documentation', 'templates'],
      lastUpdated: '2024-01-08',
      author: 'Dr. Lisa Rodriguez, PharmD',
      downloads: 743,
      rating: 4.6,
      isFavorite: false
    },
    {
      id: '5',
      title: 'Diabetes Medication Management Evidence Review',
      type: 'evidence',
      category: 'Chronic Disease Management',
      difficulty: 'advanced',
      description: 'Systematic review of clinical evidence for diabetes medication selection, dosing, and monitoring with pharmaceutical care outcomes.',
      tags: ['diabetes', 'evidence-based medicine', 'medication management', 'outcomes'],
      lastUpdated: '2024-01-05',
      author: 'Dr. Robert Kim, PharmD, PhD',
      downloads: 1089,
      rating: 4.9,
      isFavorite: true
    },
    {
      id: '6',
      title: 'Clinical Pharmacokinetics Tutorial Series',
      type: 'tutorial',
      category: 'Clinical Pharmacokinetics',
      difficulty: 'basic',
      description: 'Interactive tutorial series covering basic pharmacokinetic principles, dose calculations, and therapeutic drug monitoring.',
      tags: ['pharmacokinetics', 'dose calculations', 'TDM', 'tutorial'],
      lastUpdated: '2024-01-03',
      author: 'Dr. Amanda Foster, PharmD',
      downloads: 1876,
      rating: 4.8,
      isFavorite: false
    },
    {
      id: '7',
      title: 'Pediatric Dosing Guidelines and Safety Protocols',
      type: 'guideline',
      category: 'Pediatric Pharmacy',
      difficulty: 'advanced',
      description: 'Comprehensive guidelines for pediatric medication dosing, safety considerations, and age-appropriate pharmaceutical care.',
      tags: ['pediatrics', 'dosing', 'safety', 'pharmaceutical care'],
      lastUpdated: '2024-01-01',
      author: 'Dr. Jennifer Walsh, PharmD',
      downloads: 654,
      rating: 4.7,
      isFavorite: false
    },
    {
      id: '8',
      title: 'Pain Management Case Studies with Opioid Stewardship',
      type: 'case-study',
      category: 'Pain Management',
      difficulty: 'advanced',
      description: 'Complex pain management cases emphasizing multimodal approaches, opioid risk assessment, and stewardship principles.',
      tags: ['pain management', 'opioid stewardship', 'multimodal therapy', 'risk assessment'],
      lastUpdated: '2023-12-28',
      author: 'Dr. Thomas Lee, PharmD',
      downloads: 987,
      rating: 4.6,
      isFavorite: true
    },
    {
      id: '9',
      title: 'Drug Interaction Assessment Tools',
      type: 'assessment',
      category: 'Drug Interactions',
      difficulty: 'intermediate',
      description: 'Interactive assessment tools for identifying, evaluating, and managing clinically significant drug interactions.',
      tags: ['drug interactions', 'clinical significance', 'assessment tools', 'management'],
      lastUpdated: '2023-12-25',
      author: 'Dr. Maria Gonzalez, PharmD',
      downloads: 1432,
      rating: 4.8,
      isFavorite: false
    },
    {
      id: '10',
      title: 'Critical Care Pharmacy Protocols',
      type: 'guideline',
      category: 'Critical Care',
      difficulty: 'extreme',
      description: 'Evidence-based protocols for medication management in critical care settings including vasopressors, sedation, and renal replacement therapy.',
      tags: ['critical care', 'vasopressors', 'sedation', 'protocols'],
      lastUpdated: '2023-12-22',
      author: 'Dr. David Park, PharmD',
      downloads: 567,
      rating: 4.9,
      isFavorite: false
    },
    {
      id: '11',
      title: 'Geriatric Medication Review Tutorial',
      type: 'tutorial',
      category: 'Geriatric Pharmacy',
      difficulty: 'intermediate',
      description: 'Step-by-step tutorial for conducting comprehensive medication reviews in elderly patients with focus on deprescribing.',
      tags: ['geriatrics', 'medication review', 'deprescribing', 'polypharmacy'],
      lastUpdated: '2023-12-20',
      author: 'Dr. Helen Chang, PharmD',
      downloads: 1123,
      rating: 4.7,
      isFavorite: false
    },
    {
      id: '12',
      title: 'Infectious Disease Antimicrobial Stewardship Cases',
      type: 'case-study',
      category: 'Infectious Diseases',
      difficulty: 'advanced',
      description: 'Real-world cases demonstrating antimicrobial stewardship principles, culture-directed therapy, and resistance management.',
      tags: ['antimicrobial stewardship', 'infectious diseases', 'resistance', 'culture-directed therapy'],
      lastUpdated: '2023-12-18',
      author: 'Dr. Kevin Wu, PharmD',
      downloads: 834,
      rating: 4.8,
      isFavorite: true
    }
  ];

  const toggleFavorite = (itemId: string) => {
    setFavorites(prev => 
      prev.includes(itemId) 
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    );
  };

  const filteredItems = libraryItems.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    const matchesType = selectedType === 'all' || item.type === selectedType;
    const matchesDifficulty = selectedDifficulty === 'all' || item.difficulty === selectedDifficulty;
    
    return matchesSearch && matchesCategory && matchesType && matchesDifficulty;
  }).sort((a, b) => {
    switch (sortBy) {
      case 'recent':
        return new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime();
      case 'popular':
        return b.downloads - a.downloads;
      case 'rating':
        return b.rating - a.rating;
      case 'alphabetical':
        return a.title.localeCompare(b.title);
      default:
        return 0;
    }
  });

  const getDifficultyColor = (difficulty?: string) => {
    switch (difficulty) {
      case 'basic': return 'text-green-400 bg-green-500/20';
      case 'intermediate': return 'text-blue-400 bg-blue-500/20';
      case 'advanced': return 'text-purple-400 bg-purple-500/20';
      case 'extreme': return 'text-red-400 bg-red-500/20';
      default: return 'text-slate-400 bg-slate-500/20';
    }
  };

  const getTypeIcon = (type: string) => {
    const resourceType = resourceTypes.find(t => t.id === type);
    return resourceType ? { icon: resourceType.icon, color: resourceType.color } : { icon: 'ri-file-line', color: 'text-slate-400' };
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <div className="bg-gradient-to-r from-teal-500 to-teal-600 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-white" style={{ fontFamily: '"Pacifico", serif' }}>
              Clinical Pharmacy Library
            </h1>
            <p className="text-teal-100 text-sm">
              Comprehensive Resource Collection for Pharmaceutical Care Education
            </p>
          </div>
          <button
            onClick={() => navigate('/')}
            className="bg-slate-800 text-white px-4 py-2 rounded-lg hover:bg-slate-700 transition-colors"
          >
            <i className="ri-arrow-left-line mr-2"></i>
            Back to Home
          </button>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-slate-800 px-6 py-4 border-b border-slate-700">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row gap-4 mb-4">
            {/* Search Bar */}
            <div className="flex-1">
              <div className="relative">
                <i className="ri-search-line absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400"></i>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-slate-700 border border-slate-600 rounded-lg pl-10 pr-4 py-2 text-white focus:outline-none focus:border-teal-400"
                  placeholder="Search resources, cases, guidelines..."
                />
              </div>
            </div>

            {/* View Mode Toggle */}
            <div className="flex gap-2">
              <button
                onClick={() => setViewMode('grid')}
                className={`px-3 py-2 rounded-lg transition-colors ${
                  viewMode === 'grid' ? 'bg-teal-500 text-white' : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                }`}
              >
                <i className="ri-grid-line"></i>
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`px-3 py-2 rounded-lg transition-colors ${
                  viewMode === 'list' ? 'bg-teal-500 text-white' : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                }`}
              >
                <i className="ri-list-unordered"></i>
              </button>
            </div>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-4">
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-teal-400"
            >
              <option value="all">All Types</option>
              {resourceTypes.map(type => (
                <option key={type.id} value={type.id}>{type.label}</option>
              ))}
            </select>

            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-teal-400"
            >
              <option value="all">All Categories</option>
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>

            <select
              value={selectedDifficulty}
              onChange={(e) => setSelectedDifficulty(e.target.value)}
              className="bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-teal-400"
            >
              <option value="all">All Levels</option>
              <option value="basic">Basic</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
              <option value="extreme">Expert</option>
            </select>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-teal-400"
            >
              <option value="recent">Most Recent</option>
              <option value="popular">Most Downloaded</option>
              <option value="rating">Highest Rated</option>
              <option value="alphabetical">Alphabetical</option>
            </select>
          </div>
        </div>
      </div>

      {/* Resource Type Overview */}
      <div className="px-6 py-6 bg-slate-800/50">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {resourceTypes.map(type => {
              const count = libraryItems.filter(item => item.type === type.id).length;
              return (
                <div
                  key={type.id}
                  onClick={() => setSelectedType(selectedType === type.id ? 'all' : type.id)}
                  className={`p-4 rounded-lg cursor-pointer transition-all border-2 ${
                    selectedType === type.id
                      ? 'border-teal-400 bg-slate-800'
                      : 'border-slate-700 bg-slate-800/50 hover:border-slate-600'
                  }`}
                >
                  <div className="text-center">
                    <i className={`${type.icon} text-2xl ${type.color} mb-2`}></i>
                    <div className="text-white font-medium text-sm">{type.label}</div>
                    <div className="text-slate-400 text-xs">{count} items</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="px-6 py-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-semibold text-white">
                Library Resources ({filteredItems.length})
              </h2>
              <p className="text-slate-400 text-sm">
                {searchQuery && `Results for "${searchQuery}"`}
                {selectedCategory !== 'all' && ` in ${selectedCategory}`}
              </p>
            </div>
          </div>

          {filteredItems.length === 0 ? (
            <div className="bg-slate-800 rounded-xl p-12 text-center">
              <i className="ri-search-line text-4xl text-slate-600 mb-4"></i>
              <h3 className="text-lg font-semibold text-slate-400 mb-2">No Resources Found</h3>
              <p className="text-slate-500">Try adjusting your search criteria or filters</p>
            </div>
          ) : (
            <div className={viewMode === 'grid' 
              ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
              : 'space-y-4'
            }>
              {filteredItems.map((item) => {
                const typeInfo = getTypeIcon(item.type);
                const isFav = favorites.includes(item.id);
                
                return viewMode === 'grid' ? (
                  <div key={item.id} className="bg-slate-800 rounded-xl p-6 hover:bg-slate-700 transition-colors">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <i className={`${typeInfo.icon} ${typeInfo.color}`}></i>
                        <span className="text-slate-400 text-sm capitalize">
                          {item.type.replace('-', ' ')}
                        </span>
                      </div>
                      <button
                        onClick={() => toggleFavorite(item.id)}
                        className={`p-1 rounded transition-colors ${
                          isFav ? 'text-red-400 hover:text-red-300' : 'text-slate-500 hover:text-slate-400'
                        }`}
                      >
                        <i className={`ri-heart-${isFav ? 'fill' : 'line'}`}></i>
                      </button>
                    </div>

                    <h3 className="text-lg font-semibold text-white mb-2 line-clamp-2">
                      {item.title}
                    </h3>
                    
                    <p className="text-slate-400 text-sm mb-4 line-clamp-3">
                      {item.description}
                    </p>

                    <div className="flex flex-wrap gap-2 mb-4">
                      {item.difficulty && (
                        <span className={`px-2 py-1 rounded text-xs font-medium ${getDifficultyColor(item.difficulty)}`}>
                          {item.difficulty}
                        </span>
                      )}
                      <span className="bg-slate-700 text-slate-300 px-2 py-1 rounded text-xs">
                        {item.category}
                      </span>
                    </div>

                    <div className="flex flex-wrap gap-1 mb-4">
                      {item.tags.slice(0, 3).map(tag => (
                        <span key={tag} className="bg-teal-500/20 text-teal-400 px-2 py-1 rounded text-xs">
                          #{tag}
                        </span>
                      ))}
                      {item.tags.length > 3 && (
                        <span className="text-slate-500 text-xs">+{item.tags.length - 3} more</span>
                      )}
                    </div>

                    <div className="flex items-center justify-between text-sm text-slate-400 mb-4">
                      <span>By {item.author}</span>
                      <span>{new Date(item.lastUpdated).toLocaleDateString()}</span>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4 text-sm text-slate-400">
                        <div className="flex items-center gap-1">
                          <i className="ri-download-line"></i>
                          {item.downloads}
                        </div>
                        <div className="flex items-center gap-1">
                          <i className="ri-star-fill text-yellow-400"></i>
                          {item.rating}
                        </div>
                      </div>
                      <button className="bg-teal-500 text-white px-3 py-1 rounded text-sm hover:bg-teal-600 transition-colors">
                        <i className="ri-eye-line mr-1"></i>
                        View
                      </button>
                    </div>
                  </div>
                ) : (
                  <div key={item.id} className="bg-slate-800 rounded-lg p-4 hover:bg-slate-700 transition-colors">
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0">
                        <div className={`w-12 h-12 rounded-lg bg-slate-700 flex items-center justify-center`}>
                          <i className={`${typeInfo.icon} ${typeInfo.color} text-xl`}></i>
                        </div>
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between mb-2">
                          <h3 className="text-lg font-semibold text-white truncate pr-4">
                            {item.title}
                          </h3>
                          <button
                            onClick={() => toggleFavorite(item.id)}
                            className={`flex-shrink-0 p-1 rounded transition-colors ${
                              isFav ? 'text-red-400 hover:text-red-300' : 'text-slate-500 hover:text-slate-400'
                            }`}
                          >
                            <i className={`ri-heart-${isFav ? 'fill' : 'line'}`}></i>
                          </button>
                        </div>
                        
                        <p className="text-slate-400 text-sm mb-3 line-clamp-2">
                          {item.description}
                        </p>

                        <div className="flex items-center gap-4 mb-2">
                          <div className="flex gap-2">
                            {item.difficulty && (
                              <span className={`px-2 py-1 rounded text-xs font-medium ${getDifficultyColor(item.difficulty)}`}>
                                {item.difficulty}
                              </span>
                            )}
                            <span className="bg-slate-700 text-slate-300 px-2 py-1 rounded text-xs">
                              {item.category}
                            </span>
                          </div>
                          
                          <div className="flex items-center gap-4 text-sm text-slate-400">
                            <div className="flex items-center gap-1">
                              <i className="ri-download-line"></i>
                              {item.downloads}
                            </div>
                            <div className="flex items-center gap-1">
                              <i className="ri-star-fill text-yellow-400"></i>
                              {item.rating}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2 text-sm text-slate-500">
                            <span>By {item.author}</span>
                            <span>•</span>
                            <span>{new Date(item.lastUpdated).toLocaleDateString()}</span>
                          </div>
                          <button className="bg-teal-500 text-white px-3 py-1 rounded text-sm hover:bg-teal-600 transition-colors">
                            <i className="ri-eye-line mr-1"></i>
                            View
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
