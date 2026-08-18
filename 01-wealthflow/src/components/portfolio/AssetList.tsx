import React, { useState, useMemo } from 'react';
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  Copy,
  TrendingUp,
  TrendingDown,
  Layers,
} from 'lucide-react';
import type { Asset, AssetCategory } from '../../types/portfolio';
import { useWealth } from '../../context/useWealth';
import { Card } from '../common/Card';
import { AssetModal } from './AssetModal';

const CATEGORIES: ('All' | AssetCategory)[] = ['All', 'Cash', 'Stocks', 'Crypto', 'Real Estate', 'Commodities'];

export const AssetList: React.FC = () => {
  const { assets, deleteAsset, duplicateAsset, formatCurrency, summary } = useWealth();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<'All' | AssetCategory>('All');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [assetToEdit, setAssetToEdit] = useState<Asset | null>(null);

  const filteredAssets = useMemo(() => {
    return assets.filter((a) => {
      const matchesCat = selectedCategory === 'All' || a.category === selectedCategory;
      const query = searchQuery.toLowerCase();
      const matchesSearch =
        a.name.toLowerCase().includes(query) ||
        (a.symbol && a.symbol.toLowerCase().includes(query)) ||
        (a.notes && a.notes.toLowerCase().includes(query));
      return matchesCat && matchesSearch;
    });
  }, [assets, selectedCategory, searchQuery]);

  const handleOpenAdd = () => {
    setAssetToEdit(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (asset: Asset) => {
    setAssetToEdit(asset);
    setIsModalOpen(true);
  };

  const getCategoryBadgeClass = (cat: AssetCategory) => {
    switch (cat) {
      case 'Cash':
        return 'badge-emerald';
      case 'Stocks':
        return 'badge-cyan';
      case 'Crypto':
        return 'badge-violet';
      case 'Real Estate':
        return 'badge-amber';
      case 'Commodities':
        return 'badge-rose';
      default:
        return 'badge-slate';
    }
  };

  return (
    <Card>
      {/* Header with Search & Filters */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '16px',
          marginBottom: '20px',
        }}
      >
        <div>
          <h2 className="card-title">
            <Layers size={20} color="#10b981" />
            Asset Portfolio Ledger
          </h2>
          <p className="card-subtitle">
            Manage individual holdings across all five supported asset classes
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <button className="btn btn-primary" onClick={handleOpenAdd}>
            <Plus size={16} />
            Add Asset Holding
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '12px',
          marginBottom: '18px',
          background: 'var(--bg-subtle)',
          padding: '10px 14px',
          borderRadius: 'var(--radius-md)',
          border: '1px solid var(--border-subtle)',
        }}
      >
        {/* Category Pills */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
          {CATEGORIES.map((cat) => {
            const isSelected = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                style={{
                  padding: '5px 12px',
                  borderRadius: '20px',
                  fontSize: '0.775rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  border: isSelected ? '1px solid #10b981' : '1px solid var(--border-subtle)',
                  background: isSelected ? 'rgba(16, 185, 129, 0.15)' : 'transparent',
                  color: isSelected ? '#34d399' : 'var(--text-secondary)',
                  transition: 'all 0.15s ease',
                }}
              >
                {cat}
              </button>
            );
          })}
        </div>

        {/* Search */}
        <div style={{ position: 'relative', minWidth: '220px' }}>
          <Search
            size={15}
            color="var(--text-muted)"
            style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)' }}
          />
          <input
            type="text"
            placeholder="Search holdings, tickers..."
            className="input-text"
            style={{ paddingLeft: '32px', paddingTop: '6px', paddingBottom: '6px', fontSize: '0.825rem' }}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Asset Table */}
      {filteredAssets.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '48px 0', color: 'var(--text-muted)' }}>
          <p style={{ fontSize: '1rem', fontWeight: 600 }}>No assets found</p>
          <p style={{ fontSize: '0.85rem', marginTop: '4px' }}>
            {searchQuery ? 'Try modifying your search filter.' : 'Click "Add Asset Holding" to populate your portfolio.'}
          </p>
        </div>
      ) : (
        <div className="table-responsive">
          <table className="wealth-table">
            <thead>
              <tr>
                <th>Asset Name</th>
                <th>Category</th>
                <th style={{ textAlign: 'right' }}>Market Value</th>
                <th style={{ textAlign: 'right' }}>Cost Basis</th>
                <th style={{ textAlign: 'right' }}>Unrealized Gain</th>
                <th style={{ textAlign: 'center' }}>Yield / Target</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredAssets.map((asset) => {
                const gain = asset.value - asset.costBasis;
                const gainPct = asset.costBasis > 0 ? (gain / asset.costBasis) * 100 : 0;
                const isGain = gain >= 0;
                const shareOfTotal = summary.totalValue > 0 ? (asset.value / summary.totalValue) * 100 : 0;
                const annualCashflow = (asset.value * asset.annualYieldPercent) / 100;

                return (
                  <tr key={asset.id}>
                    {/* Asset Name & Symbol */}
                    <td>
                      <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{asset.name}</span>
                          {asset.symbol && (
                            <span
                              style={{
                                fontFamily: 'var(--font-mono)',
                                fontSize: '0.725rem',
                                color: 'var(--text-secondary)',
                                background: 'rgba(255,255,255,0.06)',
                                padding: '1px 6px',
                                borderRadius: '4px',
                              }}
                            >
                              {asset.symbol}
                            </span>
                          )}
                        </div>
                        {asset.notes && (
                          <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)', marginTop: '2px' }}>
                            {asset.notes}
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Category Badge */}
                    <td>
                      <span className={`badge ${getCategoryBadgeClass(asset.category)}`}>
                        {asset.category}
                      </span>
                    </td>

                    {/* Market Value & Portfolio Share */}
                    <td style={{ textAlign: 'right' }}>
                      <div style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--text-primary)' }}>
                        {formatCurrency(asset.value)}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                        {shareOfTotal.toFixed(1)}% of total
                      </div>
                    </td>

                    {/* Cost Basis */}
                    <td style={{ textAlign: 'right' }}>
                      <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                        {formatCurrency(asset.costBasis)}
                      </div>
                      {asset.quantity && (
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>
                          {asset.quantity.toLocaleString()} units
                        </div>
                      )}
                    </td>

                    {/* Unrealized Gain/Loss */}
                    <td style={{ textAlign: 'right' }}>
                      <div
                        style={{
                          fontWeight: 700,
                          fontSize: '0.9rem',
                          color: isGain ? '#10b981' : '#f43f5e',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'flex-end',
                          gap: '4px',
                        }}
                      >
                        {isGain ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                        {isGain ? '+' : ''}
                        {formatCurrency(gain)}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: isGain ? '#34d399' : '#fb7185' }}>
                        {isGain ? '+' : ''}
                        {gainPct.toFixed(1)}%
                      </div>
                    </td>

                    {/* Yield / Target */}
                    <td style={{ textAlign: 'center' }}>
                      <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#06b6d4' }}>
                        {asset.annualYieldPercent.toFixed(1)}% ({formatCurrency(annualCashflow)}/yr)
                      </div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                        Target: {asset.targetAllocationPercent.toFixed(0)}%
                      </div>
                    </td>

                    {/* Actions */}
                    <td style={{ textAlign: 'right' }}>
                      <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                        <button
                          className="btn-icon"
                          title="Duplicate Asset"
                          onClick={() => duplicateAsset(asset.id)}
                        >
                          <Copy size={14} />
                        </button>
                        <button
                          className="btn-icon"
                          title="Edit Asset"
                          onClick={() => handleOpenEdit(asset)}
                        >
                          <Edit2 size={14} />
                        </button>
                        <button
                          className="btn-icon"
                          style={{ color: '#f43f5e' }}
                          title="Delete Asset"
                          onClick={() => {
                            if (window.confirm(`Delete "${asset.name}" from your portfolio?`)) {
                              deleteAsset(asset.id);
                            }
                          }}
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Asset Edit/Add Modal */}
      <AssetModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        assetToEdit={assetToEdit}
      />
    </Card>
  );
};
