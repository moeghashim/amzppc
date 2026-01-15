import { useState, useEffect } from 'react';
import { generateCampaignNames } from '../utils/campaignGenerator';
import { checkAsinExists, saveCampaigns } from '../services/campaignService';
import ErrorMessage from './ErrorMessage';
import SuccessMessage from './SuccessMessage';
import './CampaignGenerator.css';

export default function CampaignGenerator() {
  const [asin, setAsin] = useState('');
  const [productSlug, setProductSlug] = useState('');
  const [campaigns, setCampaigns] = useState([]);
  const [copiedIndex, setCopiedIndex] = useState(null);
  const [allCopied, setAllCopied] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    // Clear messages after 5 seconds
    if (error) {
      const timer = setTimeout(() => setError(''), 5000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => setSuccess(''), 5000);
      return () => clearTimeout(timer);
    }
  }, [success]);

  const handleGenerate = async () => {
    if (!asin.trim() || !productSlug.trim()) {
      return;
    }

    setError('');
    setSuccess('');
    setLoading(true);

    try {
      // Check if ASIN already exists
      const exists = await checkAsinExists(asin.trim());
      
      if (exists) {
        setError('This ASIN already exists. Please use a different ASIN or view existing campaigns.');
        setLoading(false);
        return;
      }

      // Generate campaigns
      const generated = generateCampaignNames(asin.trim(), productSlug.trim());
      setCampaigns(generated);
      setCopiedIndex(null);
      setAllCopied(false);
    } catch (err) {
      setError(`Failed to check ASIN: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (campaigns.length === 0) {
      setError('No campaigns to save. Please generate campaigns first.');
      return;
    }

    setError('');
    setSuccess('');
    setSaving(true);

    try {
      await saveCampaigns(asin.trim(), productSlug.trim(), campaigns);
      setSuccess('Campaigns saved successfully!');
      // Clear the form after successful save
      setTimeout(() => {
        setAsin('');
        setProductSlug('');
        setCampaigns([]);
      }, 2000);
    } catch (err) {
      if (err.message.includes('already exists')) {
        setError('This ASIN already exists. Please use a different ASIN or view existing campaigns.');
      } else {
        setError(`Failed to save campaigns: ${err.message}`);
      }
    } finally {
      setSaving(false);
    }
  };

  const handleCopy = async (text, index) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const handleCopyAll = async () => {
    if (campaigns.length === 0) return;
    try {
      const allText = campaigns.map(c => c.name).join('\n');
      await navigator.clipboard.writeText(allText);
      setAllCopied(true);
      setTimeout(() => setAllCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy all:', err);
    }
  };

  return (
    <div className="campaign-generator">
      <div className="generator-container">
        <header className="generator-header">
          <h1>Amazon PPC Campaign Name Generator</h1>
          <p className="subtitle">Generate campaign names for all ad types</p>
        </header>

        <div className="input-section">
          <ErrorMessage message={error} onClose={() => setError('')} />
          <SuccessMessage message={success} onClose={() => setSuccess('')} />

          <div className="input-group">
            <label htmlFor="asin">ASIN</label>
            <input
              id="asin"
              type="text"
              value={asin}
              onChange={(e) => {
                setAsin(e.target.value);
                setError('');
              }}
              placeholder="B08XYZ1234"
              className="input-field"
              disabled={loading || saving}
            />
          </div>

          <div className="input-group">
            <label htmlFor="productSlug">Product Slug</label>
            <input
              id="productSlug"
              type="text"
              value={productSlug}
              onChange={(e) => {
                setProductSlug(e.target.value);
                setError('');
              }}
              placeholder="wireless-headphones"
              className="input-field"
              disabled={loading || saving}
            />
          </div>

          <div className="button-group">
            <button
              onClick={handleGenerate}
              disabled={!asin.trim() || !productSlug.trim() || loading || saving}
              className="generate-button"
            >
              {loading ? 'Checking...' : 'Generate Campaign Names'}
            </button>

            {campaigns.length > 0 && (
              <button
                onClick={handleSave}
                disabled={saving || loading}
                className="save-button"
              >
                {saving ? 'Saving...' : 'Save Campaigns'}
              </button>
            )}
          </div>
        </div>

        {campaigns.length > 0 && (
          <div className="results-section">
            <div className="results-header">
              <h2>Generated Campaign Names ({campaigns.length})</h2>
              <button
                onClick={handleCopyAll}
                className="copy-all-button"
              >
                {allCopied ? '✓ Copied!' : 'Copy All'}
              </button>
            </div>

            <div className="campaigns-list">
              {campaigns.map((campaign, index) => (
                <div key={index} className="campaign-item">
                  <div className="campaign-label">{campaign.label}</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', width: '100%' }}>
                    <code className="campaign-name">{campaign.name}</code>
                    <button
                      onClick={() => handleCopy(campaign.name, index)}
                      className="copy-button"
                      aria-label="Copy campaign name"
                    >
                      {copiedIndex === index ? '✓' : '📋'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
