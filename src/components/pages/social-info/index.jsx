import React, { useState } from 'react';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { CardGroup, Card, Button, Row, Col } from 'react-bootstrap';

import { SOCIAL_INFO, ONE_SECOND } from '../../../constants.jsx';

const initialCopyState = SOCIAL_INFO.reduce((acc, current) => {
  return {
    ...acc,
    [current.key]: false
  }
}, {});

const SocialInfo = () => {
  const [copyState, setCopyState] = useState(initialCopyState);

  const handleCopy = key => {
    setCopyState({ ...copyState, [key]: true });
    setTimeout(() => {
      setCopyState({ ...copyState, [key]: false });
    }, ONE_SECOND);
  }

  return (
    <Row>
      <Col xs={12} sm={12} md={{ span: 10, offset: 1 }} lg={{ span: 8, offset: 2 }}>
        <CardGroup>
          {SOCIAL_INFO.map(({ key, label, text }) => (
            <Card key={key} style={{ width: '18rem' }}>
              <Card.Body>
                <Card.Title>{label}</Card.Title>
                <Card.Text>
                  {text}
                </Card.Text>
                <CopyToClipboard
                  key={key}
                  text={text}
                  onCopy={() => handleCopy(key)}
                >
                  <Button variant="primary">{copyState[key] ? 'Copied' : 'Copy To Clipboard'}</Button>
                </CopyToClipboard>
              </Card.Body>
            </Card>
          ))}
          </CardGroup>
      </Col>
    </Row>
  )
};

export default SocialInfo;
