import { buildFeature, FeatureType } from 'admin-bro';

const feature = (): FeatureType => {
  return buildFeature({
    actions: {
      someAction: {},
    },
  });
};

export default feature;
