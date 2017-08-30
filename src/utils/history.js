import { createMemoryHistory } from 'history'

const history = createMemoryHistory({
  initialEntries: [ '/login' ],
  initialIndex: 0
});

export default history
