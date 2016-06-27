import { connect } from 'react-apollo';
import gql from 'graphql-tag';

import AllUsers from '../components/AllUsers';

function mapQueriesToProps() {
  return {
    viewer: {
      query: gql`
        query {
          viewer {
            allUsers(first: 1000) {
              edges {
                node {
                  id
                }
              }
            }
          }
        }
      `,
    },
  };
}

const AllUsersContainer = connect({
  mapQueriesToProps,
})(AllUsers);

export default AllUsersContainer;
