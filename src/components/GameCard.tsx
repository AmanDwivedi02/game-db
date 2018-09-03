// import CircularProgress from '@material-ui/core/CircularProgress';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';

import * as equal from 'fast-deep-equal';
import * as React from 'react';

import './GameCard.css';

interface IState {
    error: string
    game: any
}

export default class GameCard extends React.Component<{ gameId: string }, IState>{

    constructor(props: any) {
        super(props);
        this.state = {
            error: "",
            game: {}
        }
    }

    public componentDidUpdate(prevProps: any) {
        if (!equal(this.props.gameId, prevProps.gameId)) {
            this.setState({
                error: "",
                game: {}
            });
            this.getGame();
        }
    }

    public componentDidMount(){
        this.getGame();
    }

    public render() {
        const gameModes: any[] = [];
        if (this.state.game.hasOwnProperty('game_modes')){
            this.state.game.game_modes.forEach((mode: any, count: any) => {
                if (mode === 1){
                    gameModes.push({'index': count, mode: 'Single Player'});
                } else if (mode === 2) {
                    gameModes.push({'index': count, mode: 'Multiplayer'});
                } else if (mode === 3) {
                    gameModes.push({'index': count, mode: 'Co-op'});
                } else if (mode === 4) {
                    gameModes.push({'index': count, mode: 'Split-Screen'});
                } else if (mode === 5) {
                    gameModes.push({'index': count, mode: 'MMO'});
                }
            });
        }
        return (
            /* this.state.game === {} && this.state.error === "" ? 
            <CircularProgress thickness={3} /> : (
                this.state.error !== "" ? 
                <p>An error occured, please try again later</p> : <p>The game is {this.state.game.name}</p>
            ) */
            <Grid item={true} sm={6} md={4} lg={3}>
                <Card className="card" style={{ height: 600, overflow: 'auto' }}>
                    <CardMedia
                        component="img"
                        style={{ height: 500 }}
                        image={this.state.game.hasOwnProperty('cover') ? (
                            this.state.game.cover.hasOwnProperty('cloudinary_id') ? "http://images.igdb.com/igdb/image/upload/t_cover_big/" + this.state.game.cover.cloudinary_id + ".jpg" : "http://" + this.state.game.cover.url
                        ) : "../emptyCase.jpg"}
                        title="Game Cover"
                    />
                    <CardContent>
                        <Typography gutterBottom={true} variant="headline" component="h2">
                            {this.state.game.name}
                        </Typography>

                        <Typography gutterBottom={true} variant="subheading">
                            Release Date: {this.state.game.hasOwnProperty('release_dates') ? (
                                this.state.game.release_dates[0].hasOwnProperty('human') ?
                                    this.state.game.release_dates[0].human : "An error occured when finding the date."
                            ) : "Not Available"}
                        </Typography>

                        <Typography variant="subheading">
                            Game Modes:
                        </Typography>

                        {gameModes.map((mode:any) => (
                                <Typography key={mode.index}>{mode.mode}</Typography>
                            ))}

                        <Typography gutterBottom={true} />

                        <Typography variant="subheading">
                            Summary:
                        </Typography>

                        <Typography>
                            {this.state.game.summary !== "" ? this.state.game.summary : "None"}
                        </Typography>

                    </CardContent>
                </Card>
            </Grid>
        );
    }

    private getGame() {
        this.setState({ error: "", game: {} });
        fetch('https://cors-anywhere.herokuapp.com/https://api-endpoint.igdb.com/games/' + this.props.gameId, {
            headers: {
                'Accept': 'application/json',
                'user-key': '8336ee28d401e838215a9863d7d54b88'
            },
            method: 'GET'
        }).then((response: any) => {
            if (!response.ok) {
                this.setState({ error: response.status, game: "" })
            } else if (response.ok) {
                response.json().then((body: any) => {
                    this.setState(prevState => ({
                        error: '',
                        game: body[0]
                    }))
                    return body;
                })
            }
            return response;
        })
    };
}
