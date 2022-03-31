import seoConfig from '../constants/seo';

type GetSeoOptions = {
  omitOpenGraphImage?: boolean
};

function getSeo(options: GetSeoOptions = {}) {
  const { omitOpenGraphImage } = options;
  const { images, ...openGraph } = seoConfig.openGraph;

  return {
    ...seoConfig,
    openGraph: {
      ...openGraph,
      images: omitOpenGraphImage ? undefined : images,
    },
  };
}

export default getSeo;
