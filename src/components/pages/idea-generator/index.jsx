import React, { useState } from 'react';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { mapValues } from 'lodash';

import { SOCIAL_INFO_MAPPING } from '../../../constants.jsx';

const initialCopyState = mapValues(SOCIAL_INFO_MAPPING, item => false);

const SocialInfo = () => {
  const [copyState, setCopyState] = useState(initialCopyState);

  const handleCopy = key => {
    setCopyState({ ...copyState, [key]: true });
  }

  return (
    <div className="page-social-info">
      <CopyToClipboard
        text={SOCIAL_INFO_MAPPING.youtube}
        onCopy={() => handleCopy('youtube')}
      >
        <span>{copyState.youtube ? 'copied' : SOCIAL_INFO_MAPPING.youtube}</span>
      </CopyToClipboard>
    </div>
  )
};

export default SocialInfo;
