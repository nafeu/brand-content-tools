import React, { useState, useRef } from 'react';
import {
  Stage,
  Layer,
  Rect,
  Circle,
  Text,
  Image,
  Group
} from 'react-konva';
import useImage from 'use-image';
import {
  Row,
  Col,
  InputGroup,
  FormControl,
  Button,
  Form
} from 'react-bootstrap';
import RangeSlider from 'react-bootstrap-range-slider';

import { IMAGE_OPTIONS, IMAGE_OPTIONS_MAPPING } from '../../../constants.jsx'

const FIRST_ITEM = 0;
const DEFAULT_VERB_FONT_SIZE = 50;
const DEFAULT_SUBJECT_FONT_SIZE = 50;
const DEFAULT_PREPOSITION_FONT_SIZE = 50;
const DEFAULT_OBJECT_FONT_SIZE = 50;
const DEFAULT_BACKGROUND_VARIATION = 1;
const DEFAULT_HEADSHOT_VARIATION = 1;
const DEFAULT_HEADSHOT_SCALE = 100;
const MAX_FONT_SIZE = 200;
const MIN_FONT_SIZE = 50;
const MIN_HEADSHOT_SCALE = 25;
const MAX_HEADSHOT_SCALE = 200;

const DEFAULT_STAGE_DIMENSIONS = IMAGE_OPTIONS[FIRST_ITEM]

const TEXT_POSITIONS = {
  verb: {
    x: 10,
    y: 10
  },
  subject: {
    x: 10,
    y: 10 + 50
  },
  preposition: {
    x: 10,
    y: 10 + 50 + 50
  },
  object: {
    x: 10,
    y: 10 + 50 + 50 + 50
  }
}

const BackgroundImage = ({ variation = 1 }) => {
  const [image] = useImage(`/assets/bg-${variation}.png`);
  return <Image image={image} />;
}

const HeadshotImage = ({ variation = 1, x, y, scale }) => {
  const [image] = useImage(`/assets/headshot-${variation}.png`);
  if (image) {
    return <Group
      clipFunc={ctx => {
        ctx.arc(image.width / 2, (image.height / 2) - 50, 200, 0, Math.PI * 2, false);
      }}
      x={x}
      y={y}
      scaleX={scale / 100}
      scaleY={scale / 100}
      draggable
    >
      <Image image={image} />
    </Group>
  }
  return <Text text={'loading headshot...'}/>
}

const LogoImage = ({ stageWidth }) => {
  const [image] = useImage('/assets/logo-2.png');

  const padding = 10;
  const scaleX = 0.25;
  const scaleY = 0.25;
  const x = image ? stageWidth - (image.width * scaleX) - padding : 0;
  const y = padding;

  return <Image
    scaleX={scaleX}
    scaleY={scaleY}
    x={x}
    y={y}
    image={image}
  />;
}

const ActionImage = ({ dataUrl }) => {
  if (dataUrl) {
    const [image] = useImage(dataUrl);

    return <Image image={image} />;
  }

  return <Text text={'Please paste action image'} />
}

const ImageBuilder = () => {
  const [verbText, setVerbText] = useState('');
  const [verbFontSize, setVerbFontSize] = useState(DEFAULT_VERB_FONT_SIZE);
  const [subjectText, setSubjectText] = useState('');
  const [subjectFontSize, setSubjectFontSize] = useState(DEFAULT_SUBJECT_FONT_SIZE);
  const [prepositionText, setPrepositionText] = useState('');
  const [prepositionFontSize, setPrepositionFontSize] = useState(DEFAULT_PREPOSITION_FONT_SIZE);
  const [objectText, setObjectText] = useState('');
  const [objectFontSize, setObjectFontSize] = useState(DEFAULT_OBJECT_FONT_SIZE);
  const [stageDimensions, setStageDimensions] = useState(DEFAULT_STAGE_DIMENSIONS);
  const [actionImageDataUrl, setActionImageDataUrl] = useState(null);

  const [backgroundVariation, setBgVariation] = useState(DEFAULT_BACKGROUND_VARIATION);
  const [headshotVariation, setHeadshotVariation] = useState(DEFAULT_HEADSHOT_VARIATION);
  const [headshotScale, setHeadshotScale] = useState(DEFAULT_HEADSHOT_SCALE);

  const stage = useRef();

  const downloadURI = (uri, name) => {
    const link = document.createElement("a");
    link.download = name;
    link.href = uri;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleChangeVerbText = event => {
    setVerbText(event.target.value);
  }

  const handleChangeVerbFontSize = event => {
    setVerbFontSize(Number(event.target.value));
  }

  const handleChangeSubjectText = event => {
    setSubjectText(event.target.value);
  }

  const handleChangeSubjectFontSize = event => {
    setSubjectFontSize(Number(event.target.value));
  }

  const handleChangePrepositionText = event => {
    setPrepositionText(event.target.value);
  }

  const handleChangePrepositionFontSize = event => {
    setPrepositionFontSize(Number(event.target.value));
  }

  const handleChangeObjectText = event => {
    setObjectText(event.target.value);
  }

  const handleChangeObjectFontSize = event => {
    setObjectFontSize(Number(event.target.value));
  }

  const handleChangeHeadshotScale = event => {
    setHeadshotScale(Number(event.target.value));
  }

  const handleClickDownloadImage = () => {
    const dataURL = stage.current.toDataURL({ pixelRatio: 1 });
    downloadURI(dataURL, `${stageDimensions.id} - ${new Date().toDateString()}`);
  }

  const handleChangeSelectStageDimensions = event => {
    setStageDimensions(IMAGE_OPTIONS_MAPPING[event.target.value]);
  }

  const handlePasteImage = pasteEvent => {
    const items = pasteEvent.clipboardData.items;

    const blob = items[0].getAsFile();
    const reader = new FileReader();

    reader.onload = loadEvent => {
      setActionImageDataUrl(loadEvent.target.result)
    };

    reader.readAsDataURL(blob);
  }

  return (
    <Row className="justify-content-center">
      <Col>
        <Row className="mt-2">
          <Col xs={12} sm={12} md={3} lg={3}>
            <Form>
              <Form.Group>
                <Form.Label>Select Image Template</Form.Label>
                <Form.Control
                  as="select"
                  onChange={handleChangeSelectStageDimensions}
                  value={stageDimensions.id}
                  custom
                >
                  {
                    IMAGE_OPTIONS.map(
                      ({ id }) => <option value={id}>{id}</option>
                    )
                  }
                </Form.Control>
              </Form.Group>
              <Row>
                <Col>
                  <Form.Group>
                    <Form.Label>Enter Verb</Form.Label>
                    <Form.Control
                      as="input"
                      placeholder="ie. How to make ... , Making ... , Creating ... , Playing ... , etc."
                      value={verbText}
                      onChange={handleChangeVerbText}
                    />
                    <RangeSlider
                      min={MIN_FONT_SIZE}
                      max={MAX_FONT_SIZE}
                      value={verbFontSize}
                      onChange={handleChangeVerbFontSize}
                      tooltipPlacement='bottom'
                    />
                  </Form.Group>
                </Col>
                <Col>
                  <Form.Group>
                    <Form.Label>Enter Subject</Form.Label>
                    <Form.Control
                      as="input"
                      placeholder="ie. Melodies ... , Drum Patterns ... , VR Games ... , etc."
                      value={subjectText}
                      onChange={handleChangeSubjectText}
                    />
                    <RangeSlider
                      min={MIN_FONT_SIZE}
                      max={MAX_FONT_SIZE}
                      value={subjectFontSize}
                      onChange={handleChangeSubjectFontSize}
                      tooltipPlacement='bottom'
                    />
                  </Form.Group>
                </Col>
              </Row>
              <Row>
                <Col>
                  <Form.Group>
                    <Form.Label>Enter Preposition</Form.Label>
                    <Form.Control
                      as="input"
                      placeholder="ie. in ... , with ... , inside of ... , etc."
                      value={prepositionText}
                      onChange={handleChangePrepositionText}
                    />
                    <RangeSlider
                      min={MIN_FONT_SIZE}
                      max={MAX_FONT_SIZE}
                      value={prepositionFontSize}
                      onChange={handleChangePrepositionFontSize}
                      tooltipPlacement='bottom'
                    />
                  </Form.Group>
                </Col>
                <Col>
                  <Form.Group>
                    <Form.Label>Enter Object</Form.Label>
                    <Form.Control
                      as="input"
                      placeholder="ie. Cubase 11 ... , Oculus Quest 2 ... , Beat Making ... , etc."
                      value={objectText}
                      onChange={handleChangeObjectText}
                    />
                    <RangeSlider
                      min={MIN_FONT_SIZE}
                      max={MAX_FONT_SIZE}
                      value={objectFontSize}
                      onChange={handleChangeObjectFontSize}
                      tooltipPlacement='bottom'
                    />
                  </Form.Group>
                </Col>
              </Row>
              <Form.Group>
                <Form.Label>Adjust Headshot</Form.Label>
                <RangeSlider
                  min={MIN_HEADSHOT_SCALE}
                  max={MAX_HEADSHOT_SCALE}
                  value={headshotScale}
                  onChange={handleChangeHeadshotScale}
                  tooltipPlacement='bottom'
                />
              </Form.Group>
            </Form>

            <InputGroup className="mb-3">
              <FormControl as="input" placeholder="Paste Action Image Here" onPaste={handlePasteImage}/>
            </InputGroup>

            <Button onClick={handleClickDownloadImage} variant="secondary" size="lg" block>
              Download Image
            </Button>
          </Col>
          <Col xs={12} sm={12} md={9} lg={9}>
            <Stage className="mt-4 mb-4 konva-container" width={stageDimensions.width} height={stageDimensions.height} ref={stage}>
              <Layer>
                <BackgroundImage variation={backgroundVariation} />
                <HeadshotImage variation={headshotVariation} scale={headshotScale} />
                <LogoImage stageWidth={stageDimensions.width} />
                <ActionImage dataUrl={actionImageDataUrl} />
                <Text
                  x={TEXT_POSITIONS.verb.x}
                  y={TEXT_POSITIONS.verb.y}
                  text={verbText}
                  fontSize={verbFontSize}
                  fontFamily={'Fira Code'}
                  fill={'white'}
                  draggable
                />
                <Text
                  x={TEXT_POSITIONS.subject.x}
                  y={TEXT_POSITIONS.subject.y}
                  text={subjectText}
                  fontSize={subjectFontSize}
                  fontFamily={'Fira Code'}
                  fill={'white'}
                  draggable
                />
                <Text
                  x={TEXT_POSITIONS.preposition.x}
                  y={TEXT_POSITIONS.preposition.y}
                  text={prepositionText}
                  fontSize={prepositionFontSize}
                  fontFamily={'Fira Code'}
                  fill={'white'}
                  draggable
                />
                <Text
                  x={TEXT_POSITIONS.object.x}
                  y={TEXT_POSITIONS.object.y}
                  text={objectText}
                  fontSize={objectFontSize}
                  fontFamily={'Fira Code'}
                  fill={'white'}
                  draggable
                />
              </Layer>
            </Stage>
          </Col>
        </Row>
      </Col>
    </Row>
  )
};

export default ImageBuilder;