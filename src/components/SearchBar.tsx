import { Input } from '@material-ui/core/';
import CircularProgress from '@material-ui/core/CircularProgress';
import Grid from '@material-ui/core/Grid';

import * as React from 'react';
import GameCard from './GameCard';

interface IState {
    error: any,
    gameIds: any,
    loading: boolean
}

export default class SearchBar extends React.Component<{}, IState> {

    constructor(props: any) {
        super(props)
        this.state = {
            error: "",
            gameIds: [],
            loading: false
        }
        this.updateInputValue = this.updateInputValue.bind(this);
    }

    public render() {
        return (
            <div>
                <Grid container={true} xs={12} justify={'center'}>
                    <Grid container={true} xs={12} justify={'center'}>
                        <Grid item={true} xs={4}>
                            <Input
                                placeholder="Enter game name"
                                inputProps={{
                                    'aria-label': 'Description',
                                }}
                                fullWidth={true}
                                onKeyPress={this.updateInputValue}
                            />
                            <Grid container={true} justify={'center'} xs={12}>
                                <Grid item={true}>
                                    {this.state.loading ? <CircularProgress thickness={3} /> : (
                                        this.state.error !== "" ? <p>An error occured, please try again later.</p> : (
                                            this.state.gameIds.length === 0 ? <p>Please type in a game and press enter.</p> :
                                                ""
                                        )
                                    )}
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>

                    <Grid item={true} xs={12}>
                        {this.state.loading ? "" : (
                            this.state.error !== "" ? "" : (
                                this.state.gameIds.length === 0 ? "" :
                                    <Grid container={true} spacing={40}>
                                        {this.state.gameIds.map((gameId: any) => (
                                            <GameCard key={gameId.index} gameId={gameId.id} />
                                        ))}
                                    </Grid>
                            )
                        )}
                    </Grid>
                </Grid>
            </div>
        );
    }

    private updateInputValue(evt: any) {
        if (evt.key === 'Enter') {
            this.setState({ loading: true });
            this.setState({
                error: "",
                gameIds: []
            });
            this.getGameIds(evt.target.value);
        }
    }

    private getGameIds(userInput: string) {
        fetch('https://cors-anywhere.herokuapp.com/https://api-endpoint.igdb.com/games/?search=' + userInput, {
            headers: {
                'Accept': 'application/json',
                'user-key': '8336ee28d401e838215a9863d7d54b88'
            },
            method: 'GET'
        }).then((response: any) => {
            if (!response.ok) {
                this.setState({ error: response.status, gameIds: [] });
            } else if (response.ok) {
                response.json().then((body: any) => {
                    body.forEach((element: any, index: any) => {
                        this.setState(prevState => ({
                            error: '',
                            gameIds: [...prevState.gameIds, { 'index': index, 'id': element.id }]
                        }))
                    });
                    return body;
                })
            }
            this.setState({ loading: false });
            return response;
        })
    }
}