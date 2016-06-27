import React from 'react';

import User from './User';

const AllUsers = (props) => {
  if (props.viewer.loading) {
    return (
      <div>Loading...</div>
    );
  } else {
    return (
      <div>
        <h2>All Users</h2>
        <ul>
          {props.viewer.viewer.allUsers.edges.map((edge, i) => (
            <li key={i}>
              <User user={edge.node} />
            </li>
          ))}
        </ul>
      </div>
    );
  }
};

export default AllUsers;
