import styled from 'styled-components'
import { device } from '../assets/idk.jsx'

const Content = styled.aside`
	margin: 0 auto;
	margin: 2em auto;
	padding-left: 10px;

	::after {
		content: '';
		display: table;
		clear: both;
	}

	:first-child {
		margin-top: 0;
	}
	:last-child {
		margin-bottom: 0;
	}

	@media screen and (${device.tablets}) {
		padding-left: 0px;
	}
`

const ContentPoint = styled.span`
	margin: 0 auto;
	top: 0%;
	left: 0%;
	width: 6px;
	height: 6px;
	border-radius: 50%;
	background-color: blue;
	display: block;
	margin-left: -8px;

	@media screen and (${device.tablets}) {
		left: 50%;
		margin-left: -2px;
	}
`

const ContentChildren = styled.div`
	margin: 0 auto;
	padding: 0em;
	top: -8px;
	width: 50%;

	@media screen and (${device.tablets}) {
		padding: 0em 2em;
		left: ${props => (props.position === 'left' ? '0%' : '50%')};
		text-align: ${props => (props.position === 'left' ? 'right' : 'left')};
	}
`

function LinearMap({ children, className, position }) {
	return (
		<Content className={className}>
			<ContentPoint />
			<ContentChildren position={position}>{children}</ContentChildren>
		</Content>
	)
}

export default LinearMap