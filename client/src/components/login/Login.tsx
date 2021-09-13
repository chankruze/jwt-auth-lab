/*
Author: chankruze (chankruze@geekofia.in)
Created: Mon Sep 13 2021 18:13:11 GMT+0530 (India Standard Time)

Copyright (c) Geekofia 2021 and beyond
*/

import React, { FC, ReactNode, useState, useRef } from 'react';
import axios from 'axios';
import styled, { css } from 'styled-components';

type Props = {
	childeren?: ReactNode;
	animate?: boolean;
	setUser: Function;
};

const Container = styled.div`
	min-width: 400px;
	max-width: 500px;
	display: flex;
	background: rgb(27, 27, 27);
	padding: 1rem 1rem 2rem 1rem;
	border-radius: 0.25rem;
	flex-direction: column;
	margin: 1rem;
`;

const Title = styled.h1`
	color: whitesmoke;
	margin: 0.25rem 0.25rem 1.5rem 0.25rem;
	text-align: center;
`;

const Text = styled.p`
	margin-top: 0.5rem;
`;

const Input = styled.input`
	padding: 0.75rem;
	margin: 0.5rem;
	border: none;
	outline: none;
	background: #313131;
	border-bottom: 2px solid #616161;
	color: white;
	font-size: 1.2rem;
	border-radius: 0.25rem 0.25rem 0 0;
`;

const Button = styled.button`
	padding: 0.75rem 1.5rem;
	margin: 1rem;
	border: none;
	background: #313131;
	color: white;
	font-size: 1.2rem;
	border-radius: 0.25rem;
	align-self: center;
	cursor: pointer;
`;

const Login: FC<Props> = ({ animate, setUser }: Props) => {
	const [username, setUsername] = useState('');
	const [password, setPassword] = useState('');
	const [error, setError] = useState(false);
	const [success, setSuccess] = useState(false);

	const handleLogin = async (
		e: React.MouseEvent<HTMLButtonElement, MouseEvent>
	) => {
		e.preventDefault();

		if (username && password) {
			// api request
			axios
				.post(`${process.env.API_URI}/api/login`, {
					username,
					password
				})
				.then(({ status, data }) => {
					if (status === 200) {
						console.log(`Welcome ${data.username}!`);
						setUser(data);
					}
				})
				.catch(({ response }) => console.error(response));
		} else {
			console.error(`${username ? 'password' : 'username'} can't be blank`);
		}
	};

	return (
		<Container>
			<Title>Login</Title>
			<Input
				placeholder="Username"
				type="text"
				autoFocus
				required
				onChange={(e) => setUsername(e.target.value)}
			/>
			<Input
				placeholder="Password"
				type="password"
				required
				onChange={(e) => setPassword(e.target.value)}
			/>
			<Button onClick={handleLogin}>Login</Button>
		</Container>
	);
};

export default Login;
