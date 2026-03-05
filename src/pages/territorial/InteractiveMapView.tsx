import { FC } from 'react';
import PageLayout from '../../components/PageLayout';
import LeafletMap from '../../components/LeafletMap';

const InteractiveMapView: FC = () => {
  return (
    <PageLayout
      title="Peta Interaktif"
      subtitle="Interactive map with branch, merchant, and customer distributions"
    >
      <div className="h-[calc(100vh-12rem)]">
        <LeafletMap />
      </div>
    </PageLayout>
  );
};

export default InteractiveMapView;
