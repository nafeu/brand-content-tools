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
const DEFAULT_BACKGROUND_VARIATION = 1;
const DEFAULT_HEADSHOT_VARIATION = 1;
const DEFAULT_HEADSHOT_SCALE = 100;
const MAX_FONT_SIZE = 200;
const MIN_FONT_SIZE = 50;
const MIN_HEADSHOT_SCALE = 25;
const MAX_HEADSHOT_SCALE = 200;

const DEFAULT_STAGE_DIMENSIONS = IMAGE_OPTIONS[FIRST_ITEM]

const INITIAL_TEXT_STATE = {
  verb: {
    value: '',
    x: 10,
    y: 10,
    size: 50
  },
  subject: {
    value: '',
    x: 10,
    y: 10 + 50,
    size: 50
  },
  preposition: {
    value: '',
    x: 10,
    y: 10 + 50 + 50,
    size: 50
  },
  object: {
    value: '',
    x: 10,
    y: 10 + 50 + 50 + 50,
    size: 50
  }
}

const INITIAL_IMAGE_STATE = {
  background: {
    variation: 1
  },
  headshot: {
    variation: 1,
    scale: 100
  },
  action: {
    scale: 100,
    dataUrl: null
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
  const [text, setText] = useState(INITIAL_TEXT_STATE);
  const [image, setImage] = useState(INITIAL_IMAGE_STATE);
  const [stageDimensions, setStageDimensions] = useState(DEFAULT_STAGE_DIMENSIONS);

  const stage = useRef();

  const downloadURI = (uri, name) => {
    const link = document.createElement("a");
    link.download = name;
    link.href = uri;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleChangeText = ({ key, property, value }) => {
    setText({
      ...text,
      [key]: {
        ...text[key],
        [property]: value
      }
    });
  }

  const handleChangeImage = ({ key, property, value }) => {
    setImage({
      ...image,
      [key]: {
        ...image[key],
        [property]: value
      }
    });
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
      setImage({
        ...image,
        action: {
          ...image['action'],
          dataUrl: loadEvent.target.result
        }
      });
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
                      value={text.verb.value}
                      onChange={event => handleChangeText({ key: 'verb', property: 'value', value: event.target.value})}
                    />
                    <RangeSlider
                      min={MIN_FONT_SIZE}
                      max={MAX_FONT_SIZE}
                      value={text.verb.size}
                      onChange={event => handleChangeText({ key: 'verb', property: 'size', value: Number(event.target.value)})}
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
                      value={text.subject.value}
                      onChange={event => handleChangeText({ key: 'subject', property: 'value', value: event.target.value})}
                    />
                    <RangeSlider
                      min={MIN_FONT_SIZE}
                      max={MAX_FONT_SIZE}
                      value={text.subject.size}
                      onChange={event => handleChangeText({ key: 'subject', property: 'size', value: Number(event.target.value)})}
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
                      value={text.preposition.value}
                      onChange={event => handleChangeText({ key: 'preposition', property: 'value', value: event.target.value})}
                    />
                    <RangeSlider
                      min={MIN_FONT_SIZE}
                      max={MAX_FONT_SIZE}
                      value={text.preposition.size}
                      onChange={event => handleChangeText({ key: 'preposition', property: 'size', value: Number(event.target.value)})}
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
                      value={text.object.value}
                      onChange={event => handleChangeText({ key: 'object', property: 'value', value: event.target.value})}
                    />
                    <RangeSlider
                      min={MIN_FONT_SIZE}
                      max={MAX_FONT_SIZE}
                      value={text.object.size}
                      onChange={event => handleChangeText({ key: 'object', property: 'size', value: Number(event.target.value)})}
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
                  value={image.headshot.scale}
                  onChange={event => handleChangeImage({ key: 'headshot', property: 'scale', value: Number(event.target.value)})}
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
                <BackgroundImage variation={image.background.variation} />
                <HeadshotImage variation={image.headshot.variation} scale={image.headshot.scale} />
                <LogoImage stageWidth={stageDimensions.width} />
                <ActionImage dataUrl={image.action.dataUrl} />
                <Text
                  x={text.verb.x}
                  y={text.verb.y}
                  text={text.verb.value}
                  fontSize={text.verb.size}
                  fontFamily={'Fira Code'}
                  fill={'white'}
                  draggable
                />
                <Text
                  x={text.subject.x}
                  y={text.subject.y}
                  text={text.subject.value}
                  fontSize={text.subject.size}
                  fontFamily={'Fira Code'}
                  fill={'white'}
                  draggable
                />
                <Text
                  x={text.preposition.x}
                  y={text.preposition.y}
                  text={text.preposition.value}
                  fontSize={text.preposition.size}
                  fontFamily={'Fira Code'}
                  fill={'white'}
                  draggable
                />
                <Text
                  x={text.object.x}
                  y={text.object.y}
                  text={text.object.value}
                  fontSize={text.object.size}
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