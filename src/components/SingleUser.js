import React from 'react';

import User from './User';

const SingleUser = (props) => {
  if (props.user.loading) {
    return (
      <div>Loading...</div>
    );
  } else {
    return (
      <div>
        <h2>User by id</h2>
        <User user={props.user.userById} />
      </div>
    );
  }
}

export default SingleUser;
