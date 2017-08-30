import { createMemoryHistory } from 'history'

const history = createMemoryHistory({
  initialEntries: [ '/profile' ],
  initialIndex: 0
});

export default history
