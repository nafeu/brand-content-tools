import React, { useState } from 'react';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { sample } from 'lodash';
import { Card, Button, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';

import { ONE_SECOND, FIRST_ITEM, IDEA_GENERATOR_MAPPINGS } from '../../../constants.jsx';

const {
  AREAS,
  MEDIA_TYPE_NOUN_PHRASE,
  VERB_SUBJECT_PHRASE,
  PREPOSITION_OBJECT_PHRASE
} = IDEA_GENERATOR_MAPPINGS;

const DEFAULT_AREA = AREAS[FIRST_ITEM];

const generateRandomIdea = area => ({
  'selectedArea': area,
  'selectedMediaTypeNounPhrase': sample(MEDIA_TYPE_NOUN_PHRASE),
  'selectedVerbSubjectPhrase': sample(VERB_SUBJECT_PHRASE[area]),
  'selectedPrepositionObjectPhrase': sample(PREPOSITION_OBJECT_PHRASE[area])
})

const initialState = generateRandomIdea(DEFAULT_AREA);

const IdeaGenerator = () => {
  const [copyState, setCopyState] = useState(false);
  const [state, setState] = useState(initialState);

  const {
    selectedArea,
    selectedMediaTypeNounPhrase,
    selectedVerbSubjectPhrase,
    selectedPrepositionObjectPhrase
  } = state;

  const handleClickCopyToClipboard = () => {
    setCopyState(true);
    setTimeout(() => {
      setCopyState(false);
    }, ONE_SECOND);
  }

  const handleSelectArea = area => {
    if (selectedArea !== area) {
      setState(generateRandomIdea(area));
    }
  }

  const handleSelectMediaTypeNounPhrase = mediaTypeNounPhrase => {
    setState({
      ...state,
      selectedMediaTypeNounPhrase: mediaTypeNounPhrase
    });
  }

  const handleSelectVerbSubjectPhrase = verbSubjectPhrase => {
    setState({
      ...state,
      selectedVerbSubjectPhrase: verbSubjectPhrase
    });
  }

  const handleSelectPrepositionObjectPhrase = prepositionObjectPhrase => {
    setState({
      ...state,
      selectedPrepositionObjectPhrase: prepositionObjectPhrase
    });
  }

  const handleClickRandomize = () => {
    setState(generateRandomIdea(selectedArea));
  }

  const ideaText = selectedMediaTypeNounPhrase
    + ' ' + selectedVerbSubjectPhrase
    + ' ' + selectedPrepositionObjectPhrase;

  return (
    <Row>
      <Col xs={12} sm={12} md={{ span: 10, offset: 1 }} lg={{ span: 8, offset: 2 }}>
        <Row className="mb-2">
          <Col xs={12}>
            <Card className="text-center">
              <Card.Body>
                <Card.Title className="text-muted">Let's make...</Card.Title>
                <Card.Text>
                  <h3>{ideaText}</h3>
                </Card.Text>
                <Button onClick={handleClickRandomize} className="mr-1" variant="danger">Randomize</Button>
                <CopyToClipboard
                  text={ideaText}
                  onCopy={handleClickCopyToClipboard}
                >
                  <Button className="mr-1" variant="primary">{copyState ? 'Copied' : 'Copy To Clipboard'}</Button>
                </CopyToClipboard>
                <Button as={Link} to={"/image-builder"} variant="outline-success">Create Thumbnail</Button>
              </Card.Body>
            </Card>
          </Col>
        </Row>
        <Row className="mb-4">
          <Col xs={2}>
            <Card>
              <Card.Header>Areas</Card.Header>
              <Card.Body>
                {AREAS.map(area => (
                  <Button
                    variant={
                      selectedArea === area
                        ? 'primary'
                        : 'outline-secondary'
                    }
                    onClick={() => handleSelectArea(area)}
                    block
                  >
                    {area}
                  </Button>
                ))}
              </Card.Body>
            </Card>
          </Col>
          <Col xs={2}>
            <Card>
              <Card.Header>Media Type</Card.Header>
              <Card.Body>
                {MEDIA_TYPE_NOUN_PHRASE.map(mediaTypeNounPhrase => (
                  <Button
                    variant={
                      selectedMediaTypeNounPhrase === mediaTypeNounPhrase
                        ? 'primary'
                        : 'outline-secondary'
                    }
                    onClick={() => handleSelectMediaTypeNounPhrase(mediaTypeNounPhrase)}
                    className="text-small"
                    block
                  >
                    {mediaTypeNounPhrase}
                  </Button>
                ))}
              </Card.Body>
            </Card>
          </Col>
          <Col xs={5}>
            <Card>
              <Card.Header>Subject</Card.Header>
              <Card.Body>
                {VERB_SUBJECT_PHRASE[selectedArea].map(verbSubjectPhrase => (
                  <Button
                    variant={
                      selectedVerbSubjectPhrase === verbSubjectPhrase
                        ? 'primary'
                        : 'outline-secondary'
                    }
                    onClick={() => handleSelectVerbSubjectPhrase(verbSubjectPhrase)}
                    className="m-1 text-small"
                  >
                    {verbSubjectPhrase}
                  </Button>
                ))}
              </Card.Body>
            </Card>
          </Col>
          <Col xs={3}>
            <Card>
              <Card.Header>Object</Card.Header>
              <Card.Body>
                {PREPOSITION_OBJECT_PHRASE[selectedArea].map(prepositionObjectPhrase => (
                  <Button
                    variant={
                      selectedPrepositionObjectPhrase === prepositionObjectPhrase
                        ? 'primary'
                        : 'outline-secondary'
                    }
                    onClick={() => handleSelectPrepositionObjectPhrase(prepositionObjectPhrase)}
                    className="m-1 text-small"
                  >
                    {prepositionObjectPhrase}
                  </Button>
                ))}
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Col>
    </Row>
  )
};

export default IdeaGenerator;
