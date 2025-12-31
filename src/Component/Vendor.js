import React, { useState } from 'react';
import { AlertCircle, TrendingUp, Clock, Package, Star } from 'lucide-react';

const Vendor = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [suppliers, setSuppliers] = useState([
    {
      id: 1,
      name: 'Steel Corp India',
      category: 'Raw Materials',
      price: 85,
      quality: 92,
      delivery: 88,
      score: 88.3,
      risk: 'low',
      avgDelay: 2,
      orders: 45
    },
    {
      id: 2,
      name: 'Precision Parts Ltd',
      category: 'Components',
      price: 78,
      quality: 95,
      delivery: 70,
      score: 81.0,
      risk: 'medium',
      avgDelay: 5,
      orders: 32
    },
    {
      id: 3,
      name: 'QuickSupply Co',
      category: 'Packaging',
      price: 90,
      quality: 85,
      delivery: 95,
      score: 90.0,
      risk: 'low',
      avgDelay: 1,
      orders: 58
    },
    {
      id: 4,
      name: 'Budget Materials',
      category: 'Raw Materials',
      price: 95,
      quality: 70,
      delivery: 65,
      score: 76.7,
      risk: 'high',
      avgDelay: 8,
      orders: 18
    }
  ]);

  const [selectedSupplier, setSelectedSupplier] = useState(null);

  const getRiskColor = (risk) => {
    switch(risk) {
      case 'low': return 'text-green-600 bg-green-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'high': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const predictDelay = (supplier) => {
    const delayProb = Math.max(0, Math.min(100, 100 - supplier.delivery));
    return delayProb;
  };

  const getAlternativeSuppliers = (supplier) => {
    return suppliers
      .filter(s => s.id !== supplier.id && s.category === supplier.category)
      .sort((a, b) => b.score - a.score);
  };

  const Dashboard = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-blue-600 font-medium">Total Suppliers</p>
              <p className="text-3xl font-bold text-blue-900">{suppliers.length}</p>
            </div>
            <Package className="w-12 h-12 text-blue-400" />
          </div>
        </div>
        
        <div className="bg-green-50 p-6 rounded-lg border border-green-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-green-600 font-medium">Avg Score</p>
              <p className="text-3xl font-bold text-green-900">
                {(suppliers.reduce((acc, s) => acc + s.score, 0) / suppliers.length).toFixed(1)}
              </p>
            </div>
            <TrendingUp className="w-12 h-12 text-green-400" />
          </div>
        </div>
        
        <div className="bg-orange-50 p-6 rounded-lg border border-orange-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-orange-600 font-medium">High Risk</p>
              <p className="text-3xl font-bold text-orange-900">
                {suppliers.filter(s => s.risk === 'high').length}
              </p>
            </div>
            <AlertCircle className="w-12 h-12 text-orange-400" />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-gray-200">
        <div className="p-4 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-800">Supplier Rankings</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Supplier</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Category</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Score</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Risk</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {suppliers.sort((a, b) => b.score - a.score).map(supplier => (
                <tr key={supplier.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm font-medium text-gray-900">{supplier.name}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{supplier.category}</td>
                  <td className="px-4 py-3 text-sm">
                    <div className="flex items-center">
                      <Star className="w-4 h-4 text-yellow-400 mr-1" />
                      <span className="font-semibold">{supplier.score}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRiskColor(supplier.risk)}`}>
                      {supplier.risk.toUpperCase()}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm">
                    <button
                      onClick={() => {
                        setSelectedSupplier(supplier);
                        setActiveTab('analysis');
                      }}
                      className="text-blue-600 hover:text-blue-800 font-medium"
                    >
                      Analyze
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const Analysis = () => {
    if (!selectedSupplier) {
      return (
        <div className="text-center py-12 text-gray-500">
          Please select a supplier from the dashboard to view detailed analysis
        </div>
      );
    }

    const delayProbability = predictDelay(selectedSupplier);
    const alternatives = getAlternativeSuppliers(selectedSupplier);

    return (
      <div className="space-y-6">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">{selectedSupplier.name}</h2>
          <p className="text-gray-600 mb-6">{selectedSupplier.category}</p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div>
              <p className="text-sm text-gray-600 mb-1">Price Score</p>
              <div className="flex items-center">
                <div className="flex-1 bg-gray-200 rounded-full h-2 mr-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full" 
                    style={{width: `${selectedSupplier.price}%`}}
                  ></div>
                </div>
                <span className="text-sm font-semibold">{selectedSupplier.price}</span>
              </div>
            </div>
            
            <div>
              <p className="text-sm text-gray-600 mb-1">Quality Score</p>
              <div className="flex items-center">
                <div className="flex-1 bg-gray-200 rounded-full h-2 mr-2">
                  <div 
                    className="bg-green-600 h-2 rounded-full" 
                    style={{width: `${selectedSupplier.quality}%`}}
                  ></div>
                </div>
                <span className="text-sm font-semibold">{selectedSupplier.quality}</span>
              </div>
            </div>
            
            <div>
              <p className="text-sm text-gray-600 mb-1">Delivery Score</p>
              <div className="flex items-center">
                <div className="flex-1 bg-gray-200 rounded-full h-2 mr-2">
                  <div 
                    className="bg-purple-600 h-2 rounded-full" 
                    style={{width: `${selectedSupplier.delivery}%`}}
                  ></div>
                </div>
                <span className="text-sm font-semibold">{selectedSupplier.delivery}</span>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg p-4 border border-blue-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-blue-600 font-medium">Overall Performance Score</p>
                <p className="text-3xl font-bold text-blue-900">{selectedSupplier.score}</p>
              </div>
              <Star className="w-16 h-16 text-blue-400" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center mb-4">
            <Clock className="w-6 h-6 text-orange-500 mr-2" />
            <h3 className="text-lg font-bold text-gray-800">AI Delay Prediction</h3>
          </div>
          
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-700">Probability of Delay</span>
              <span className="text-2xl font-bold text-orange-600">{delayProbability.toFixed(0)}%</span>
            </div>
            <div className="bg-gray-200 rounded-full h-3">
              <div 
                className="bg-orange-500 h-3 rounded-full transition-all" 
                style={{width: `${delayProbability}%`}}
              ></div>
            </div>
            <p className="text-sm text-gray-600 mt-3">
              Based on historical data: Average delay of {selectedSupplier.avgDelay} days over {selectedSupplier.orders} orders
            </p>
          </div>

          {delayProbability > 30 && (
            <div className="mt-4 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <p className="text-sm text-yellow-800 font-medium">
                ⚠️ Recommendation: Consider placing orders earlier or exploring backup suppliers
              </p>
            </div>
          )}
        </div>

        {alternatives.length > 0 && (
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center mb-4">
              <TrendingUp className="w-6 h-6 text-green-500 mr-2" />
              <h3 className="text-lg font-bold text-gray-800">Alternative Suppliers</h3>
            </div>
            
            <div className="space-y-3">
              {alternatives.map(alt => (
                <div key={alt.id} className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-colors">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-semibold text-gray-800">{alt.name}</h4>
                      <div className="flex items-center mt-1 text-sm text-gray-600">
                        <Star className="w-4 h-4 text-yellow-400 mr-1" />
                        <span>Score: {alt.score}</span>
                        <span className="mx-2">•</span>
                        <span className={`px-2 py-0.5 rounded-full text-xs ${getRiskColor(alt.risk)}`}>
                          {alt.risk}
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={() => setSelectedSupplier(alt)}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium"
                    >
                      View Details
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold text-gray-900">AI Vendor & Procurement Intelligence</h1>
          <p className="text-sm text-gray-600 mt-1">Smart supplier management for manufacturing MSMEs</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex gap-4 mb-6">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`px-6 py-2 rounded-lg font-medium transition-colors ${
              activeTab === 'dashboard'
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
            }`}
          >
            Dashboard
          </button>
          <button
            onClick={() => setActiveTab('analysis')}
            className={`px-6 py-2 rounded-lg font-medium transition-colors ${
              activeTab === 'analysis'
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
            }`}
          >
            AI Analysis
          </button>
        </div>

        {activeTab === 'dashboard' ? <Dashboard /> : <Analysis />}
      </div>
    </div>
  );
};

export default Vendor;