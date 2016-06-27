import { connect } from 'react-apollo';
import gql from 'graphql-tag';

import CurrentUser from '../components/CurrentUser';

function mapQueriesToProps() {
  return {
    viewer: {
      query: gql`
        query {
          viewer {
            user {
              id
            }
          }
        }
      `,
    },
  };
}

const CurrentUserContainer = connect({
  mapQueriesToProps,
})(CurrentUser);

export default CurrentUserContainer;
