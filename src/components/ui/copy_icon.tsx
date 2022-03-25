import { Image, Tooltip } from '@chakra-ui/react';
import React from 'react';
import copy from 'copy-to-clipboard';

interface Props {
  text: string;
}

function CopyIcon({ text }: Props) {
  const normalImagePath = '/ui_icons/copy/normal.svg';
  const hoverImagePath = '/ui_icons/copy/hover.svg';
  const activeImagePath = '/ui_icons/copy/active.svg';

  const defaultTooltip = 'Copy';
  const copiedTooltip = 'Copied';

  const [imageSource, setImageSource] = React.useState(normalImagePath);
  const [tooltipLabel, setTooltipLabel] = React.useState(defaultTooltip);

  return (
    <Tooltip label={tooltipLabel}>
      <Image
        m={0}
        src={imageSource}
        onMouseOver={() => setImageSource(hoverImagePath)}
        onMouseLeave={() => { setImageSource(normalImagePath); setTooltipLabel(defaultTooltip); }}
        onMouseDown={() => setImageSource(activeImagePath)}
        onMouseUp={() => { setImageSource(hoverImagePath); }}
        onClick={() => {
          copy(text);
          setTooltipLabel(copiedTooltip);
        }}
      />
    </Tooltip>

  );
}

export default CopyIcon;
