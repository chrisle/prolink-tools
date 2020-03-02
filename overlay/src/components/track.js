import { Flex } from '@rebass/grid/emotion';
import { observer } from 'mobx-react';
import { formatDistance } from 'date-fns';
import { css } from '@emotion/core';
import styled from '@emotion/styled';
import posed, { PoseGroup } from 'react-pose';
import React from 'react';

import * as icons from 'app/components/icons';
import config from 'app/config';
import TimeTicker from 'app/components/timeTicker';

const attributeIcons = {
  album: icons.Disc,
  label: icons.Layers,
  comment: icons.Hash,
  key: icons.Music,
  genre: icons.Star,
};

const MissingArtwork = styled(
  React.forwardRef((p, ref) => (
    <Flex alignItems="center" justifyContent="center" ref={ref} {...p}>
      <icons.Disc size="50%" />
    </Flex>
  ))
)`
  background: #000;
  color: #aaa;
  opacity: 0.5;
`;

let Artwork = React.forwardRef(({ animateIn, ...p }, ref) =>
  p.src ? (
    <img ref={ref} {...p} />
  ) : (
    <MissingArtwork ref={ref} className={p.className} />
  )
);

Artwork = styled(Artwork)`
  display: flex;
  height: ${p => p.size};
  width: ${p => p.size};
  border-radius: 3px;
  flex-shrink: 0;
`;

Artwork = posed(Artwork)({
  start: {
    clipPath: ({ animateIn }) =>
      animateIn
        ? 'polygon(0% 0%, 0% 0%, 0% 100%, 0% 100%)'
        : 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)',
  },
  enter: {
    clipPath: 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)',
  },
  exit: {
    applyAtStart: { zIndex: 10 }, // Above the next artwork
    clipPath: 'polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%)',
    transition: {
      type: 'spring',
      stiffness: 700,
      damping: 100,
    },
  },
});

let Text = styled('div')`
  background: rgba(0, 0, 0, 0.25);
  padding: 0 0.28em;
  border-radius: 1px;
  display: flex;
  align-items: center;
  margin-left: 4px;
`;

Text = posed(Text)({
  start: {
    opacity: 0,
    x: '-20px',
  },
  enter: {
    opacity: 1,
    x: 0,
  },
  exit: { x: 0 },
});

const Title = styled(Text)`
  font-weight: 600;
  font-size: 1.3em;
  line-height: 1.4;
  margin-bottom: 0.2em;
`;

const Artist = styled(Text)`
  font-size: 1.1em;
  line-height: 1.3;
  margin-bottom: 0.2em;
`;

let Attributes = styled('div')`
  display: flex;
  font-size: 0.9em;
  line-height: 1.4;
  margin-top: 0.1em;

  // Set nowrap to fix a layout bug that occurse when the element is FLIPed in
  // pose during the animation.
  white-space: nowrap;
`;

Attributes = posed(Attributes)({
  exit: { x: 0 },
  enter: {
    x: 0,
    beforeChildren: true,
    staggerChildren: 200,
    staggerDirection: -1,
  },
});

const Icon = styled(p => <p.icon className={p.className} size="1em" />)`
  margin-right: 0.25em;
`;

let Attribute = ({ icon, text, ...p }) =>
  text === '' ? null : (
    <Text ml={1} {...p}>
      <Icon icon={icon} />
      {text}
    </Text>
  );

const NoAttributes = styled(p => (
  <Attribute text="No Release Metadata" icon={icons.X} {...p} />
))`
  color: rgba(255, 255, 255, 0.6);
`;

let MetadataWrapper = React.forwardRef((p, ref) => (
  <Flex
    {...p}
    ref={ref}
    flex={1}
    alignItems="flex-end"
    flexDirection="column"
  />
));

MetadataWrapper = posed(MetadataWrapper)({
  start: {
    clipPath: 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)',
  },
  enter: {
    staggerChildren: 200,
    clipPath: 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)',
  },
  exit: {
    clipPath: 'polygon(100% 0%, 100% 0%, 100% 100%, 100% 100%)',
    transition: {
      type: 'spring',
      stiffness: 700,
      damping: 90,
    },
  },
});

const FullMetadata = observer(({ track, ...p }) => (
  <MetadataWrapper {...p}>
    <Title>{track.title}</Title>
    <Artist>{track.artist}</Artist>
    <Attributes>
      <PoseGroup>
        {config.detailItems.map(f => (
          <Attribute icon={attributeIcons[f]} text={track[f]} key={f} />
        ))}
        {config.detailItems.map(f => track[f]).join('') === '' && (
          <NoAttributes key="no-field" />
        )}
      </PoseGroup>
    </Attributes>
  </MetadataWrapper>
));

const FullTrack = React.forwardRef(({ track, ...props }, ref) => (
  <Flex ref={ref} {...props}>
    <FullMetadata track={track} mr={2} />
    <Artwork src={track.artwork} size="80px" />
  </Flex>
));

const MiniTitle = styled(Text)`
  font-size: 0.85em;
  font-weight: 600;
  line-height: 1.2;
  margin-bottom: 0.15em;
`;

const MiniArtist = styled(Text)`
  font-size: 0.8em;
  line-height: 1.2;
  margin-bottom: 0.25em;
`;

const PlayedAt = styled(Text)`
  font-size: 0.7em;
  line-height: 1.3;
`;

const MiniTrack = React.forwardRef(({ track, ...props }, ref) => (
  <Flex ref={ref} {...props}>
    <MetadataWrapper mr={1}>
      <MiniTitle>{track.title}</MiniTitle>
      <MiniArtist>{track.artist}</MiniArtist>
      <PlayedAt>
        <TimeTicker
          playedAt={track.playedAt}
          randomRange={[15, 30]}
          render={_ => `${formatDistance(Date.now(), track.playedAt)} ago`}
        />
      </PlayedAt>
    </MetadataWrapper>
    <Artwork animateIn src={track.artwork} size="50px" />
  </Flex>
));

const Track = React.forwardRef(({ mini, ...props }, ref) =>
  mini ? <MiniTrack ref={ref} {...props} /> : <FullTrack ref={ref} {...props} />
);

export default Track;
