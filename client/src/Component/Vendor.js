
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Package, Plus, X, ShoppingCart, Trash2, 
  Edit3, Phone, Clock, CheckCircle, AlertTriangle 
} from 'lucide-react';

const VendorApp = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [suppliers, setSuppliers] = useState([]);
  const [selectedSupplier, setSelectedSupplier] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showOrderModal, setShowOrderModal] = useState(false);
  
  // Form States
  const [formData, setFormData] = useState({
    name: '', contact: '', category: 'Raw Materials', 
    mainProduct: '', orderDate: '', expectedDate: '', price: ''
  });

  const [newOrderData, setNewOrderData] = useState({
    productName: '', orderDate: '', expectedDate: '', price: ''
  });

  useEffect(() => { fetchSuppliers(); }, []);

  const fetchSuppliers = async () => {
    try {
      const res = await axios.get('api/suppliers');
      setSuppliers(res.data);
      // Selected supplier update karein agar history tab khula hai
      if (selectedSupplier) {
        const updated = res.data.find(s => s._id === selectedSupplier._id);
        setSelectedSupplier(updated);
      }
    } catch (err) { console.error("Fetch Error:", err); }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await axios.post('api/suppliers', formData);
      alert("Vendor & First Order Registered!");
      setShowModal(false);
      fetchSuppliers();
    } catch (err) { alert("Error saving vendor"); }
  };

  const handleNewOrder = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`api/suppliers/${selectedSupplier._id}/new-order`, newOrderData);
      alert("New Order Placed!");
      setShowOrderModal(false);
      fetchSuppliers();
    } catch (err) { alert("Error placing order"); }
  };

  const updateDelivery = async (sId, oId, actualDate) => {
    if (!actualDate) return alert("Please select delivery date");
    try {
      await axios.put(`api/suppliers/${sId}/complete-order/${oId}`, { actualDate });
      alert("Delivery Status Updated!");
      fetchSuppliers();
    } catch (err) { alert("Update failed"); }
  };

  const deleteSupplier = async (id) => {
    if (window.confirm("Delete this vendor?")) {
      await axios.delete(`api/suppliers/${id}`);
      fetchSuppliers();
      setActiveTab('dashboard');
    }
  };

  const getRiskStyles = (risk) => {
    if (risk === 'High') return 'bg-red-100 text-red-700 border-red-200';
    if (risk === 'Medium') return 'bg-yellow-100 text-yellow-700 border-yellow-200';
    return 'bg-green-100 text-green-700 border-green-200';
  };

  // --- Components ---

  const Dashboard = () => (
    <div className="grid grid-cols-1 gap-6 animate-in fade-in duration-500">
      <div className="bg-white rounded-[32px] shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-8 flex justify-between items-center bg-gray-50/50">
          <div>
            <h2 className="text-2xl font-black tracking-tight">SUPPLIER NETWORK</h2>
            <p className="text-gray-400 text-xs font-bold uppercase">Active MSME Partnerships</p>
          </div>
          <button onClick={() => setShowModal(true)} className="bg-blue-600 text-white px-8 py-4 rounded-2xl font-bold flex items-center gap-2 shadow-xl shadow-blue-100 hover:scale-105 transition-all">
            <Plus size={20} /> Register New Vendor
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 text-gray-400 text-[10px] font-black uppercase tracking-widest">
              <tr>
                <th className="px-8 py-5">Supplier & Product</th>
                <th className="px-8 py-5 text-center">Efficiency Score</th>
                <th className="px-8 py-5 text-center">Risk Status</th>
                <th className="px-8 py-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {suppliers.map((s) => (
                <tr key={s._id} className="hover:bg-blue-50/20 transition-all cursor-pointer">
                  <td className="px-8 py-6" onClick={() => { setSelectedSupplier(s); setActiveTab('analysis'); }}>
                    <p className="font-black text-gray-900 text-lg leading-none">{s.name}</p>
                    <p className="text-xs text-blue-600 font-bold mt-1 uppercase tracking-tighter">{s.mainProduct}</p>
                  </td>
                  <td className="px-8 py-6 text-center">
                    <span className="text-xl font-black text-gray-800">{s.score.toFixed(0)}</span>
                    <span className="text-[10px] font-bold text-gray-400 ml-1">%</span>
                  </td>
                  <td className="px-8 py-6 text-center">
                    <span className={`px-4 py-1.5 rounded-full text-[10px] font-black border ${getRiskStyles(s.risk)}`}>
                      {s.risk.toUpperCase()}
                    </span>
                  </td>
                  <td className="px-8 py-6 text-right space-x-2">
                    <button onClick={() => deleteSupplier(s._id)} className="p-3 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"><Trash2 size={18}/></button>
                    <button onClick={() => { setSelectedSupplier(s); setActiveTab('analysis'); }} className="bg-gray-900 text-white px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest">View History</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const Analysis = () => (
    selectedSupplier ? (
      <div className="space-y-6 animate-in slide-in-from-bottom-6 duration-500">
        {/* Header Section */}
        <div className="bg-white p-10 rounded-[40px] shadow-sm border border-gray-100 flex justify-between items-end">
          <div>
            <span className="bg-blue-100 text-blue-700 px-4 py-1 rounded-lg text-[10px] font-black uppercase">Vendor Profile</span>
            <h2 className="text-5xl font-black text-gray-900 tracking-tighter mt-2">{selectedSupplier.name}</h2>
            <div className="flex gap-6 mt-4">
              <p className="text-sm font-bold text-gray-500 flex items-center gap-2"><Phone size={14} className="text-blue-500"/> {selectedSupplier.contact}</p>
              <p className="text-sm font-bold text-gray-500 flex items-center gap-2"><Package size={14} className="text-blue-500"/> {selectedSupplier.mainProduct}</p>
            </div>
          </div>
          <button onClick={() => setShowOrderModal(true)} className="bg-green-600 text-white px-8 py-4 rounded-2xl font-black flex items-center gap-2 shadow-lg shadow-green-100 hover:bg-green-700">
            <ShoppingCart size={20}/> New Purchase Order
          </button>
        </div>

        {/* History Section */}
        <div className="bg-white rounded-[40px] shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-8 bg-gray-50/50 border-b border-gray-100 flex justify-between items-center">
            <h3 className="font-black text-xl tracking-tight">TRANSACTION & INVOICE LEDGER</h3>
          </div>
          <table className="w-full text-left">
            <thead className="bg-gray-50 text-gray-400 text-[10px] font-black uppercase tracking-widest">
              <tr>
                <th className="px-10 py-5">Invoice ID</th>
                <th className="px-10 py-5">Order Date</th>
                <th className="px-10 py-5">Timeline</th>
                <th className="px-10 py-5">Status</th>
                <th className="px-10 py-5 text-right">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {selectedSupplier.orderHistory?.map((order, i) => (
                <tr key={i} className="hover:bg-gray-50/50 transition-all">
                  <td className="px-10 py-6 font-black text-blue-600 tracking-tighter">{order.orderId}</td>
                  <td className="px-10 py-6 text-sm font-bold text-gray-600">{new Date(order.orderDate).toLocaleDateString()}</td>
                  <td className="px-10 py-6">
                    <p className="text-[10px] font-black text-gray-400 uppercase">Expected: {new Date(order.expectedDate).toLocaleDateString()}</p>
                    {order.actualDate ? (
                       <p className="text-[10px] font-black text-blue-600 uppercase">Received: {new Date(order.actualDate).toLocaleDateString()}</p>
                    ) : (
                      <div className="mt-2 flex items-center gap-2">
                        <input type="date" id={`date-${order._id}`} className="text-[10px] p-1 border rounded font-bold outline-none border-blue-200" />
                        <button 
                          onClick={() => updateDelivery(selectedSupplier._id, order._id, document.getElementById(`date-${order._id}`).value)}
                          className="bg-blue-600 text-white px-3 py-1 rounded-lg text-[10px] font-bold"
                        >
                          RECEIVE
                        </button>
                      </div>
                    )}
                  </td>
                  <td className="px-10 py-6">
                    <span className={`px-4 py-1.5 rounded-xl text-[10px] font-black ${
                      order.status === 'Pending' ? 'bg-gray-100 text-gray-500' : 
                      order.status === 'On-Time' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                    }`}>
                      {order.status.toUpperCase()}
                    </span>
                  </td>
                  <td className="px-10 py-6 text-right font-black text-gray-900 text-lg">₹{order.price}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    ) : <div className="text-center py-40 font-black text-gray-200 text-4xl tracking-tighter">SELECT A VENDOR TO VIEW LEDGER</div>
  );

  return (
    <div className="min-h-screen bg-[#fcfcfc] text-gray-900 font-sans selection:bg-blue-100">
      <header className="bg-white border-b border-gray-100 px-12 py-8 sticky top-0 z-20">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3">
             <div className="w-10 h-10 bg-blue-600 rounded-2xl flex items-center justify-center text-white font-black italic shadow-lg shadow-blue-200">M</div>
             <h1 className="text-3xl font-black tracking-tighter">MSME<span className="text-blue-600">INTEL</span></h1>
          </div>
          <div className="flex bg-gray-100 p-2 rounded-[24px]">
            {['dashboard', 'analysis'].map(tab => (
              <button key={tab} onClick={() => setActiveTab(tab)} className={`px-10 py-3 rounded-[18px] text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === tab ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-400'}`}>
                {tab === 'dashboard' ? 'Directory' : 'Ledger History'}
              </button>
            ))}
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-12">
        {activeTab === 'dashboard' ? <Dashboard /> : <Analysis />}
      </main>

      {/* --- REGISTRATION MODAL --- */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-2xl flex items-center justify-center z-50 p-6">
          <div className="bg-white rounded-[48px] p-12 w-full max-w-2xl shadow-2xl animate-in zoom-in duration-300">
            <div className="flex justify-between items-center mb-10">
              <h2 className="text-4xl font-black tracking-tighter">REGISTER VENDOR</h2>
              <button onClick={() => setShowModal(false)} className="text-gray-300 hover:text-gray-900"><X/></button>
            </div>
            <form onSubmit={handleRegister} className="grid grid-cols-2 gap-6">
              <input required placeholder="Company Name" className="col-span-2 bg-gray-50 p-5 rounded-2xl font-bold outline-none ring-2 ring-transparent focus:ring-blue-600 transition-all" onChange={e => setFormData({...formData, name: e.target.value})} />
              <input required placeholder="Contact Number" className="bg-gray-50 p-5 rounded-2xl font-bold outline-none focus:ring-2 focus:ring-blue-600" onChange={e => setFormData({...formData, contact: e.target.value})} />
              <input required placeholder="Category (e.g. Steel)" className="bg-gray-50 p-5 rounded-2xl font-bold outline-none focus:ring-2 focus:ring-blue-600" onChange={e => setFormData({...formData, category: e.target.value})} />
              <input required placeholder="Primary Product" className="bg-gray-50 p-5 rounded-2xl font-bold outline-none focus:ring-2 focus:ring-blue-600" onChange={e => setFormData({...formData, mainProduct: e.target.value})} />
              <input required type="number" placeholder="Initial Order Price" className="bg-gray-50 p-5 rounded-2xl font-bold outline-none focus:ring-2 focus:ring-blue-600" onChange={e => setFormData({...formData, price: e.target.value})} />
              
              <div className="space-y-1">
                <label className="text-[10px] font-black text-gray-400 uppercase px-2">Order Placement Date</label>
                <input required type="date" className="w-full bg-gray-50 p-5 rounded-2xl font-bold outline-none" onChange={e => setFormData({...formData, orderDate: e.target.value})} />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-black text-gray-400 uppercase px-2">Expected Delivery Date</label>
                <input required type="date" className="w-full bg-gray-50 p-5 rounded-2xl font-bold outline-none" onChange={e => setFormData({...formData, expectedDate: e.target.value})} />
              </div>

              <button type="submit" className="col-span-2 bg-blue-600 text-white font-black p-6 rounded-[24px] shadow-2xl shadow-blue-200 mt-4 uppercase tracking-widest text-sm hover:scale-[1.02] active:scale-95 transition-all">
                Submit & Open First Invoice
              </button>
            </form>
          </div>
        </div>
      )}

      {/* --- NEW ORDER MODAL --- */}
      {showOrderModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-2xl flex items-center justify-center z-50 p-6">
          <div className="bg-white rounded-[40px] p-12 w-full max-w-lg shadow-2xl">
            <h2 className="text-3xl font-black mb-8 tracking-tighter">NEW PURCHASE ORDER</h2>
            <form onSubmit={handleNewOrder} className="space-y-5">
              <input required placeholder="Product to Order" className="w-full bg-gray-50 p-5 rounded-2xl font-bold outline-none focus:ring-2 focus:ring-blue-600" onChange={e => setNewOrderData({...newOrderData, productName: e.target.value})} />
              <input required type="number" placeholder="Price" className="w-full bg-gray-50 p-5 rounded-2xl font-bold outline-none focus:ring-2 focus:ring-blue-600" onChange={e => setNewOrderData({...newOrderData, price: e.target.value})} />
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-gray-400 px-2 uppercase">Order Date</label>
                  <input required type="date" className="w-full bg-gray-50 p-5 rounded-2xl font-bold outline-none" onChange={e => setNewOrderData({...newOrderData, orderDate: e.target.value})} />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-gray-400 px-2 uppercase">Expected Date</label>
                  <input required type="date" className="w-full bg-gray-50 p-5 rounded-2xl font-bold outline-none" onChange={e => setNewOrderData({...newOrderData, expectedDate: e.target.value})} />
                </div>
              </div>
              <div className="flex gap-4 pt-4">
                 <button type="button" onClick={() => setShowOrderModal(false)} className="flex-1 font-black text-gray-400">CANCEL</button>
                 <button type="submit" className="flex-[2] bg-blue-600 text-white font-black p-5 rounded-2xl shadow-xl shadow-blue-100 uppercase tracking-widest">Confirm Order</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default VendorApp;