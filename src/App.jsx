import { useState } from 'react';
import CampaignGenerator from './components/CampaignGenerator';
import CampaignsTable from './components/CampaignsTable';
import './App.css';

function App() {
  const [activeTab, setActiveTab] = useState('generate');

  return (
    <div className="app">
      <div className="app-container">
        <div className="tabs">
          <button
            className={`tab ${activeTab === 'generate' ? 'active' : ''}`}
            onClick={() => setActiveTab('generate')}
          >
            Generate
          </button>
          <button
            className={`tab ${activeTab === 'view' ? 'active' : ''}`}
            onClick={() => setActiveTab('view')}
          >
            View All Campaigns
          </button>
        </div>

        <div className="tab-content">
          {activeTab === 'generate' ? <CampaignGenerator /> : <CampaignsTable />}
        </div>
      </div>
    </div>
  );
}

export default App
