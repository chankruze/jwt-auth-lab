/*
Author: chankruze (chankruze@geekofia.in)
Created: Tue Nov 24 2020 07:04:05 GMT+0530 (India Standard Time)

Copyright (c) Geekofia 2020 and beyond
*/

import React, { FC, useState } from 'react';
import styled, { css } from 'styled-components';
import styles from './App.module.sass';
import Login from './login/Login';

type User = {
	username: string;
	password: string;
	accessToken: string;
	refreshToken: string;
};

const Div = styled.div`
	min-width: 500px;
	max-width: 1000px;
	background: #2e2e2e;

	div {
		padding: 0.5rem 1rem;
		color: #fff;
		border: 2px dashed #585858;
	}

	p {
		width: inherit;
		white-space: pre-wrap;
		word-wrap: break-word;
		font-family: monospace;
		font-size: 1.1rem;
	}

	h1 {
		color: #00cf6f;
		background: #161616;
		padding: 0.5rem 1rem;
		font-family: monospace;
		font-size: 2rem;
		text-align: center;
	}

	b {
		margin-right: 0.25rem;
		color: #c3e600;
	}
`;

const App: FC = () => {
	const [user, setUser] = useState<User>();
	// const [user, setUser] = useState(null);

	return (
		<div className={styles.app}>
			{user ? (
				<Div>
					<h1>Authorized!</h1>
					<div>
						<p>
							<b>username:</b>
							{user.username}
						</p>
						<p>
							<b>accessToken:</b>
							{user.accessToken}
						</p>
						<p>
							<b>refreshToken:</b>
							{user.refreshToken}
						</p>
					</div>
				</Div>
			) : (
				<Login setUser={setUser} />
			)}
		</div>
	);
};

export default App;
