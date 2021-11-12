import React, { useLayoutEffect, useState } from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';

import { streamPropType } from '../constants/commonPropTypes';

// Only you are hidden -> "You are in the stream with audio only"
// You and one guest are hidden -> "You and 1 other are in the stream with audio only"
// You and multiple guests are hidden -> "You and {x} others are in the stream with audio only"
// Only 1 guest is hidden -> "{name} is in the stream with audio only"
// Multiple guests are hidden -> "{x} others are in the stream with audio only

const getParticipantsMessage = ({ streams }) => {
	const hiddenStreams = streams.filter(stream => !stream.isVideoOn);

	const isSelfHidden = hiddenStreams.some(stream => stream.isSelf);

	if (isSelfHidden) {
		if (hiddenStreams.length === 1) return 'You are';

		if (hiddenStreams.length === 2) return 'You and 1 other are';

		return `You and ${hiddenStreams.length - 1} others are`;
	}

	if (hiddenStreams.length === 1) return `${hiddenStreams[0].name} is`;

	return `${hiddenStreams.length} others are`;
};

const getMessage = props =>
	`${getParticipantsMessage(props)} in the stream with audio only`;

const Container = styled.div`
	border-radius: 4px;
	color: #ffffff;
	background-color: #333333;
	padding: 6px 12px;
`;

const shouldRender = ({ streams }) => streams.some(stream => !stream.isVideoOn);

const HiddenNotification = props => {
	const [isVisible, setIsVisible] = useState(false);

	useLayoutEffect(() => {
		if (!shouldRender(props) && isVisible) {
			setIsVisible(false);

			return () => undefined;
		}

		if (!shouldRender(props)) {
			return () => undefined;
		}

		setIsVisible(true);

		const timeoutId = setTimeout(() => {
			setIsVisible(false);
		}, 5000);

		return () => clearTimeout(timeoutId);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [props.streams]);

	return (
		isVisible && (
			<Container className={props.className}>{getMessage(props)}</Container>
		)
	);
};

HiddenNotification.propTypes = {
	className: PropTypes.string,
	streams: PropTypes.arrayOf(streamPropType),
};

export default HiddenNotification;
