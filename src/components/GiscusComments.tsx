import React from 'react';
import Giscus from '@giscus/react';

interface GiscusCommentsProps {
  repo?: string;
  repoId?: string;
  categoryId?: string;
}

const GiscusComments: React.FC<GiscusCommentsProps> = ({
  repo,
  repoId,
  categoryId,
}) => {
  // Giscus 配置 - 使用提供的默认值或环境变量
  const giscusConfig = {
    repo: repo || import.meta.env.PUBLIC_GISCUS_REPO || 'tomcomtang/astro-cartoon-portfolio',
    repoId: repoId || import.meta.env.PUBLIC_GISCUS_REPO_ID || 'R_kgDOQhFeMw',
    category: 'General', // 固定值
    categoryId: categoryId || import.meta.env.PUBLIC_GISCUS_CATEGORY_ID || 'DIC_kwDOQhFeM84CzVPU',
    mapping: 'pathname' as const, // 固定值
    reactionsEnabled: '1' as const, // 固定值
    emitMetadata: '0' as const, // 固定值
    inputPosition: 'bottom' as const, // 固定值
    theme: 'noborder_light' as const, // 固定值
    lang: 'en' as const, // 固定值
    loading: 'lazy' as const, // 固定值
  };

  return (
    <Giscus
      repo={giscusConfig.repo}
      repoId={giscusConfig.repoId}
      category={giscusConfig.category}
      categoryId={giscusConfig.categoryId}
      mapping={giscusConfig.mapping}
      reactionsEnabled={giscusConfig.reactionsEnabled}
      emitMetadata={giscusConfig.emitMetadata}
      inputPosition={giscusConfig.inputPosition}
      theme={giscusConfig.theme}
      lang={giscusConfig.lang}
      loading={giscusConfig.loading}
    />
  );
};

export default GiscusComments;

