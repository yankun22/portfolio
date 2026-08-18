import { useWealth } from '../../context/useWealth';
import { FireDialCard } from './FireDialCard';
import { FireControls } from './FireControls';
import { FireMilestoneTimeline } from './FireMilestoneTimeline';

export const FireView: React.FC = () => {
  const { fireResults } = useWealth();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* 4 Prominent Fire Progress Dials */}
      <div className="grid-4">
        <FireDialCard milestone={fireResults.milestones.coast} />
        <FireDialCard milestone={fireResults.milestones.lean} />
        <FireDialCard milestone={fireResults.milestones.traditional} />
        <FireDialCard milestone={fireResults.milestones.fat} />
      </div>

      {/* FIRE Configuration & Detailed Timeline */}
      <div className="grid-simulation">
        <div>
          <FireControls />
        </div>
        <div>
          <FireMilestoneTimeline />
        </div>
      </div>
    </div>
  );
};
