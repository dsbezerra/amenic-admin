import { Box } from 'grommet';

const AppBar = props => (
  <Box
    tag="header"
    direction="row"
    align="center"
    justify="between"
    background="brand"
    {...props}
  />
);

export { AppBar };
