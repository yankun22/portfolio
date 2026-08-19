import React, { useState, useEffect } from 'react';
import type { Trip, Activity } from './types/itinerary';
import type { Companion, Expense } from './types/budget';
import type { PackingItem } from './types/packing';
import {
  loadInitialAppState,
  saveTripsToStorage,
  saveActiveTripId,
  saveCompanionsToStorage,
  saveExpensesToStorage,
  savePackingToStorage,
  type AppStateSnapshot
} from './services/storageService';
import { exportTripToPDF } from './services/pdfService';
import { generateDefaultPackingList } from './data/defaultPacking';

// Components
import { Header, type ActiveTab } from './components/common/Header';
import { ItineraryMap } from './components/map/ItineraryMap';
import { TimelineView } from './components/timeline/TimelineView';
import { ActivityModal } from './components/timeline/ActivityModal';
import { BudgetView } from './components/budget/BudgetView';
import { WeatherWidget } from './components/weather/WeatherWidget';
import { PackingView } from './components/packing/PackingView';
import { PrintView } from './components/export/PrintView';
import { ExportModal } from './components/export/ExportModal';
import { NewTripModal } from './components/export/NewTripModal';

export const App: React.FC = () => {
  const [appState, setAppState] = useState<AppStateSnapshot>(() => loadInitialAppState());
  const [activeTripId, setActiveTripId] = useState<string>(appState.activeTripId);
  const [selectedDayId, setSelectedDayId] = useState<string>('day-1');
  const [activeTab, setActiveTab] = useState<ActiveTab>('itinerary');
  const [isDarkMode, setIsDarkMode] = useState(true);

  const [directionsLeg, setDirectionsLeg] = useState<{ fromId: string; toId: string } | null>(null);

  const [mobileSubView, setMobileSubView] = useState<'timeline' | 'map'>('timeline');

  // Modals state
  const [isActivityModalOpen, setIsActivityModalOpen] = useState(false);
  const [editingActivity, setEditingActivity] = useState<Activity | null>(null);
  const [targetDayForNewActivity, setTargetDayForNewActivity] = useState<string | undefined>(undefined);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [isNewTripModalOpen, setIsNewTripModalOpen] = useState(false);

  // Current active trip
  const activeTrip =
    appState.trips.find((t) => t.id === activeTripId) || appState.trips[0];

  const currentCompanions: Companion[] = appState.companions[activeTrip.id] || [];
  const currentExpenses: Expense[] = appState.expenses[activeTrip.id] || [];
  const currentPacking: PackingItem[] = appState.packing[activeTrip.id] || [];

  const [selectedCurrency, setSelectedCurrency] = useState<string>(activeTrip.primaryCurrency || 'USD');

  // Sync dark mode HTML attribute
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', isDarkMode ? 'dark' : 'light');
  }, [isDarkMode]);

  // Sync storage on state updates
  useEffect(() => {
    saveTripsToStorage(appState.trips);
    saveActiveTripId(activeTripId);
    saveCompanionsToStorage(appState.companions);
    saveExpensesToStorage(appState.expenses);
    savePackingToStorage(appState.packing);
  }, [appState, activeTripId]);

  // Update primary currency when switching trips
  useEffect(() => {
    if (activeTrip?.primaryCurrency) {
      setSelectedCurrency(activeTrip.primaryCurrency);
      setSelectedDayId(activeTrip.days[0]?.id || 'day-1');
      setDirectionsLeg(null);
    }
  }, [activeTripId, activeTrip]);

  // Handler: Select Trip
  const handleSelectTrip = (tripId: string) => {
    setActiveTripId(tripId);
  };

  // Handler: Update Activities for active trip
  const handleUpdateActivities = (newActivities: Activity[]) => {
    const updatedTrips = appState.trips.map((t) => {
      if (t.id === activeTrip.id) {
        return { ...t, activities: newActivities };
      }
      return t;
    });

    setAppState((prev) => ({
      ...prev,
      trips: updatedTrips
    }));
  };

  // Handler: Save Activity (Add / Edit)
  const handleSaveActivity = (activity: Activity) => {
    let updatedActivities: Activity[];
    const exists = activeTrip.activities.some((a) => a.id === activity.id);

    if (exists) {
      updatedActivities = activeTrip.activities.map((a) =>
        a.id === activity.id ? activity : a
      );
    } else {
      updatedActivities = [...activeTrip.activities, activity];
    }

    handleUpdateActivities(updatedActivities);
  };

  // Handler: Delete Activity
  const handleDeleteActivity = (activityId: string) => {
    const updated = activeTrip.activities.filter((a) => a.id !== activityId);
    handleUpdateActivities(updated);
  };

  // Handler: Open Add Activity
  const handleOpenAddActivity = (dayId?: string) => {
    setEditingActivity(null);
    setTargetDayForNewActivity(dayId || (selectedDayId !== 'all' ? selectedDayId : 'day-1'));
    setIsActivityModalOpen(true);
  };

  // Handler: Open Edit Activity
  const handleOpenEditActivity = (activity: Activity) => {
    setEditingActivity(activity);
    setTargetDayForNewActivity(activity.dayId);
    setIsActivityModalOpen(true);
  };

  // Handler: Add New Day
  const handleAddDay = () => {
    const nextDayNum = activeTrip.days.length + 1;
    const lastDate = activeTrip.days[activeTrip.days.length - 1]?.date;
    let nextDateStr = new Date().toISOString().split('T')[0];

    if (lastDate) {
      const d = new Date(lastDate);
      d.setDate(d.getDate() + 1);
      nextDateStr = d.toISOString().split('T')[0];
    }

    const newDay = {
      id: `day-${nextDayNum}`,
      dayNumber: nextDayNum,
      date: nextDateStr,
      title: `Day ${nextDayNum} Exploration`,
      description: 'Scheduled activities and tours'
    };

    const updatedTrips = appState.trips.map((t) => {
      if (t.id === activeTrip.id) {
        return {
          ...t,
          days: [...t.days, newDay]
        };
      }
      return t;
    });

    setAppState((prev) => ({ ...prev, trips: updatedTrips }));
  };

  // Handler: Update Expenses
  const handleUpdateExpenses = (newExpenses: Expense[]) => {
    setAppState((prev) => ({
      ...prev,
      expenses: {
        ...prev.expenses,
        [activeTrip.id]: newExpenses
      }
    }));
  };

  // Handler: Add Companion
  const handleAddCompanion = (companion: Companion) => {
    setAppState((prev) => ({
      ...prev,
      companions: {
        ...prev.companions,
        [activeTrip.id]: [...(prev.companions[activeTrip.id] || []), companion]
      }
    }));
  };

  // Handler: Update Packing Items
  const handleUpdatePacking = (newPacking: PackingItem[]) => {
    setAppState((prev) => ({
      ...prev,
      packing: {
        ...prev.packing,
        [activeTrip.id]: newPacking
      }
    }));
  };

  // Handler: Create New Trip
  const handleCreateTrip = (newTrip: Trip) => {
    const initialCompanions: Companion[] = [
      { id: 'comp-lead', name: 'Lead Traveler (You)', avatarColor: '#3b82f6', isCurrentUser: true }
    ];
    const initialPacking = generateDefaultPackingList(newTrip.id);

    setAppState((prev) => ({
      ...prev,
      trips: [newTrip, ...prev.trips],
      companions: { ...prev.companions, [newTrip.id]: initialCompanions },
      expenses: { ...prev.expenses, [newTrip.id]: [] },
      packing: { ...prev.packing, [newTrip.id]: initialPacking }
    }));

    setActiveTripId(newTrip.id);
  };

  // Handler: Import Trip Bundle JSON
  const handleImportTrip = (bundle: any) => {
    const importedTrip: Trip = bundle.trip;
    const importedCompanions: Companion[] = bundle.companions || [];
    const importedExpenses: Expense[] = bundle.expenses || [];
    const importedPacking: PackingItem[] = bundle.packing || generateDefaultPackingList(importedTrip.id);

    const existingIndex = appState.trips.findIndex((t) => t.id === importedTrip.id);
    let updatedTrips = [...appState.trips];

    if (existingIndex !== -1) {
      updatedTrips[existingIndex] = importedTrip;
    } else {
      updatedTrips = [importedTrip, ...updatedTrips];
    }

    setAppState((prev) => ({
      ...prev,
      trips: updatedTrips,
      companions: { ...prev.companions, [importedTrip.id]: importedCompanions },
      expenses: { ...prev.expenses, [importedTrip.id]: importedExpenses },
      packing: { ...prev.packing, [importedTrip.id]: importedPacking }
    }));

    setActiveTripId(importedTrip.id);
  };

  // Handler: Export PDF
  const handleExportPDF = () => {
    exportTripToPDF(activeTrip, currentCompanions, currentExpenses, currentPacking);
  };

  return (
    <div className="app-container">
      {/* Header Navigation */}
      <Header
        trips={appState.trips}
        activeTrip={activeTrip}
        onSelectTrip={handleSelectTrip}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        selectedCurrency={selectedCurrency}
        onCurrencyChange={setSelectedCurrency}
        isDarkMode={isDarkMode}
        onToggleDarkMode={() => setIsDarkMode(!isDarkMode)}
        onOpenAddActivity={() => handleOpenAddActivity()}
        onOpenExportModal={() => setIsExportModalOpen(true)}
        onOpenNewTripModal={() => setIsNewTripModalOpen(true)}
        onExportPDF={handleExportPDF}
        mobileActiveSubView={mobileSubView}
        onToggleMobileSubView={setMobileSubView}
      />

      {/* Main Workspace View */}
      <main className="main-content">
        {activeTab === 'itinerary' && (
          <div className={`split-view-container ${mobileSubView === 'map' ? 'mobile-show-map' : 'mobile-show-timeline'}`}>
            {/* Left: Draggable Multi-Day Timeline */}
            <TimelineView
              trip={activeTrip}
              activities={activeTrip.activities}
              selectedDayId={selectedDayId}
              onSelectDay={setSelectedDayId}
              onUpdateActivities={handleUpdateActivities}
              onEditActivity={handleOpenEditActivity}
              onDeleteActivity={handleDeleteActivity}
              onAddActivity={handleOpenAddActivity}
              onAddDay={handleAddDay}
              onNavigateLeg={(fromId, toId) => {
                setDirectionsLeg({ fromId, toId });
                setMobileSubView('map'); // Auto switch to map on mobile when user clicks a leg
              }}
              primaryCurrency={selectedCurrency}
            />

            {/* Right: Leaflet Interactive Map */}
            <ItineraryMap
              days={activeTrip.days}
              activities={activeTrip.activities}
              selectedDayId={selectedDayId}
              onSelectActivity={(actId) => {
                const act = activeTrip.activities.find((a) => a.id === actId);
                if (act) handleOpenEditActivity(act);
              }}
              initialDirectionsLeg={directionsLeg}
              primaryCurrency={selectedCurrency}
            />
          </div>
        )}

        {activeTab === 'budget' && (
          <BudgetView
            trip={activeTrip}
            expenses={currentExpenses}
            companions={currentCompanions}
            onUpdateExpenses={handleUpdateExpenses}
            onAddCompanion={handleAddCompanion}
            primaryCurrency={selectedCurrency}
          />
        )}

        {activeTab === 'weather' && <WeatherWidget trip={activeTrip} />}

        {activeTab === 'packing' && (
          <PackingView
            trip={activeTrip}
            packingItems={currentPacking}
            companions={currentCompanions}
            onUpdatePackingItems={handleUpdatePacking}
          />
        )}

        {activeTab === 'print' && (
          <PrintView
            trip={activeTrip}
            companions={currentCompanions}
            expenses={currentExpenses}
            packing={currentPacking}
            primaryCurrency={selectedCurrency}
            onExportPDF={handleExportPDF}
            onBackToItinerary={() => setActiveTab('itinerary')}
          />
        )}
      </main>

      {/* Modals */}
      <ActivityModal
        isOpen={isActivityModalOpen}
        onClose={() => setIsActivityModalOpen(false)}
        onSave={handleSaveActivity}
        trip={activeTrip}
        initialActivity={editingActivity}
        targetDayId={targetDayForNewActivity}
        primaryCurrency={selectedCurrency}
      />

      <ExportModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        trip={activeTrip}
        appState={appState}
        onImportTrip={handleImportTrip}
      />

      <NewTripModal
        isOpen={isNewTripModalOpen}
        onClose={() => setIsNewTripModalOpen(false)}
        onCreateTrip={handleCreateTrip}
      />
    </div>
  );
};

export default App;
