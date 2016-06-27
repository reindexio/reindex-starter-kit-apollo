import { connect } from 'react-apollo';
import gql from 'graphql-tag';

import SingleUser from './SingleUser';

function mapQueriesToProps({ ownProps }) {
  return {
    user: {
      query: gql`
        query($id: ID!) {
          userById(id: $id) {
            id
          }
        }
      `,
      variables: {
        id: ownProps.params.userId,
      },
    },
  };
}

const UserContainer = connect({
  mapQueriesToProps,
})(SingleUser);

export default UserContainer;
