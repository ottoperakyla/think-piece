import React from 'react';
import { render } from 'react-dom';

import './index.scss';

import Application from './components/Application';
import PostsProvider from './providers/PostsProvider';
import UserProvider from './providers/UserProvider';

render(<div>
    <PostsProvider>
        <UserProvider>
            <Application />
        </UserProvider>
    </PostsProvider>
    </div>,
     document.getElementById('root'));
