import React from 'react';
import {
  Card,
  CardTitle,
  CardMedia,
  RaisedButton,
  CardImage,
  CardContent,
  CardText,
} from 'material-ui';

const styles = {
  cardMedia: {
    maxHeight: 394,
    overflow: 'hidden',
  },
  card: {
    cursor: 'pointer',
    height: 400,
    overflow: 'hidden',
  },
  bgImage: {
    width: '100%',
  },
};
class RatingCard extends React.Component {
  render() {
    return (
      <Card style={styles.card}>
        <CardMedia
          style={styles.cardMedia}
          overlay={
            <CardTitle
              title={this.props.data.title}
              subtitle={(Math.floor(this.props.data.vote_average) / 10) * 10}
            />
          }
        >
          <img
            style={styles.bgImage}
            src={
              'https://image.tmdb.org/t/p/w342/' + this.props.data.poster_path
            }
          />
        </CardMedia>
      </Card>
    );
  }
}

export default RatingCard;
