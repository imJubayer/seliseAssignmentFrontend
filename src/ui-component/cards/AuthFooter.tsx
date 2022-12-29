// material-ui
import { Link, Typography, Stack } from '@mui/material';

// ==============================|| FOOTER - AUTHENTICATION 2 & 3 ||============================== //

const AuthFooter = () => (
    <Stack direction="row" justifyContent="space-between">
        <Typography variant="subtitle2" component={Link} href="https://selise" target="_blank" underline="hover">
            selise
        </Typography>
        <Typography variant="subtitle2" component={Link} href="https://selise" target="_blank" underline="hover">
            &copy; selise
        </Typography>
    </Stack>
);

export default AuthFooter;
