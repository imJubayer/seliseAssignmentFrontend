import { useEffect, useState } from 'react';
import { Grid, Typography, Card, CardActionArea, CardMedia, CardContent } from '@mui/material';
// axios
import axiosService from 'utils/axiosService';

const Dashboard = () => {
    const [books, setBooks] = useState([]);
    // const [loading, setLoading] = useState(false);
    useEffect(() => {
        // setLoading(false);
        const init = async () => {
            try {
                await axiosService.get<any>(`books`).then((resp) => {
                    console.log(resp);
                    if (resp.data.success) {
                        // setLoading(false);
                        setBooks(resp.data.response);
                    }
                });
            } catch (e) {
                console.log(e);
            }
        };
        init();
    }, []);
    return (
        <Grid container spacing={4}>
            {books.length &&
                books.map((book: any) => (
                    <Grid item md={3} xs={12}>
                        <Card sx={{ maxWidth: 345 }}>
                            <CardActionArea>
                                <CardMedia component="img" height="140" image={book?.img_path} alt={book?.name} />
                                <CardContent>
                                    <Typography gutterBottom variant="h3" component="div">
                                        {book?.name}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        {book?.author_name}
                                    </Typography>
                                    <Typography variant="overline" color="text.secondary" sx={{ color: 'red' }}>
                                        Price: {book?.price}
                                    </Typography>
                                </CardContent>
                            </CardActionArea>
                        </Card>
                    </Grid>
                ))}
        </Grid>
    );
};

export default Dashboard;
