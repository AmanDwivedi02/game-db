import CircularProgress from '@material-ui/core/CircularProgress';

import * as equal from 'fast-deep-equal';
import * as React from 'react';

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
        this.getGame();
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

    public render() {
        return(
            this.state.game === {} && this.state.error === "" ? 
            <CircularProgress thickness={3} /> : (
                this.state.error !== "" ? 
                <p>An error occured, please try again later</p> : <p>The game is {this.state.game.name}</p>
            )
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
