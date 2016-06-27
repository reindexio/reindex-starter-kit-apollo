import React from 'react';

import User from './User';

const CurrentUser = (props) => {
  if (props.viewer.loading) {
    return (
      <div>Loading...</div>
    );
  } else {
    return (
      <div>
        <h2>Current User</h2>
        <User user={props.viewer.viewer.user} />
      </div>
    );
  }
}

export default CurrentUser;
